import {useEffect, useMemo, useState} from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Menu,
  Modal,
  NativeSelect,
  Pagination,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
  useMantineTheme
} from '@mantine/core';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import cx from 'clsx';
import classes from './UserList.module.css';
import {Breadcrumbs} from "@/layouts/breadcrums/Breadcrumbs";
import {RoleService, UserService} from "@/moudules/iam/service";
import type {PaginatedContent} from "@/api/types";
import type {Role, User} from "@/moudules/iam/types";
import {
  IconAlertCircle,
  IconChevronDown,
  IconDots,
  IconKey,
  IconLockAccess,
  IconLockAccessOff,
  IconPlus,
  IconTrash,
  IconUserPlus
} from "@tabler/icons-react";
import {DataLoaderArray} from "@/components/common/Loader.tsx";
import {CounterButton} from "@/components/button/CounterButton.tsx";
import {formatShanghaiTime} from "@/utils/tz.ts";
import {useNotification} from "@/hooks/useNotification.tsx";

function UserListPage() {
  const [selection, setSelection] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const notify = useNotification();

  // --- modals ---
  const [assignRoleModalOpened, setAssignRoleModalOpened] = useState(false);
  const [currentUserIds, setCurrentUserIds] = useState<number[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const [createUserModalOpened, setCreateUserModalOpened] = useState(false);
  const defaultUserForm = {
    username: '',
    password: '',
    nickname: '',
    is_active: true,
  }
  const [newUserForm, setNewUserForm] = useState(defaultUserForm);

  // const [resetPwdModalOpened, setResetPwdModalOpened] = useState(false);
  // const [resetPwdUserId, setResetPwdUserId] = useState<number | null>(null);

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deleteUserIds, setDeleteUserIds] = useState<number[]>([]);

  const [changeStatusModalOpened, setChangeStatusModalOpened] = useState(false);
  const [statusUserIds, setStatusUserIds] = useState<number[]>([]);
  const [statusValue, setStatusValue] = useState(true); // true: 激活, false: 禁用

  const queryClient = useQueryClient();

  /* ======================= queries ======================= */

  // 用户列表
  const {data: userResp, isLoading} = useQuery<PaginatedContent<User>>({
    queryKey: ['users', page, pageSize],
    queryFn: async () => {
      return await UserService.listUsers(page, pageSize); // 返回完整对象
    },
  });

  const users = useMemo(() => userResp?.items ?? [], [userResp]);
  const total = userResp?.total ?? 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelection((current) =>
        current.filter((id) => users.some((u) => u.id === id))
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, [users]);

  const allSelected = users.length > 0 && selection.length === users.length;
  const partiallySelected = selection.length > 0 && selection.length < users.length;

// ======================= roles =======================
  const {data: roleResp} = useQuery<PaginatedContent<Role>>({
    queryKey: ['roles'],
    queryFn: async () => {
      return await RoleService.listRoles();
    },
  });

  const roleItems = useMemo(() => roleResp?.items ?? [], [roleResp]);

  /* ======================= mutations ======================= */

  const createUserMutation = useMutation({
    mutationFn: async () => {
      return UserService.createUser(newUserForm);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users']
      });
      setCreateUserModalOpened(false);
      setNewUserForm(defaultUserForm)
    }
  });

  // 分配角色（覆盖式）
  const assignRolesMutation = useMutation({
    mutationFn: async ({
                         userIds,
                         roleIds,
                       }: {
      userIds: number[];
      roleIds: number[];
    }) => {
      await Promise.all(
        userIds.map((uid) =>
          UserService.assignUserRoles(uid, roleIds)
        )
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      setAssignRoleModalOpened(false);
      setSelection([]);
      setCurrentUserIds([]);
      setSelectedRoles([]);
    },
  });

  // 禁用用户
  const changeUserStatusMutation = useMutation({
    mutationFn: async ({userIds, disable}: { userIds: number[], disable: boolean }) => {
      return UserService.disableUsers(userIds, disable); // 后端接口复用
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['users']});
      notify.success('操作成功');
    },
    onError: async (err) => {
      notify.error("操作失败", err.message ?? "未知错误");
    },
    onSettled: () => {
      setChangeStatusModalOpened(false);
      setStatusUserIds([]);
      setSelection([]);
    }
  });

  // 删除用户
  const deleteUsersMutation = useMutation({
    mutationFn: async (userIds: number[]) => {
      if (userIds.length === 1) {
        await UserService.deleteUser(userIds[0]);
      } else if (userIds.length > 1) {
        await UserService.deleteUsers(userIds);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['users']});
      setDeleteModalOpened(false);
      setDeleteUserIds([]);
      setSelection([]);
    },
  });

  const openDeleteModal = (userIds: number[]) => {
    setDeleteUserIds(userIds);
    setDeleteModalOpened(true);
  };


  const toggleRow = (id: number) => {
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const openAssignRolesModal = async (userIds: number[]) => {
    setCurrentUserIds(userIds);
    if (userIds.length === 1) {
      const res = await UserService.listUserRoles(userIds[0]);
      const roleIds = res?.map((r: Role) => r.id) ?? [];
      setSelectedRoles(roleIds);
    } else {
      setSelectedRoles([]);
    }
    setAssignRoleModalOpened(true);
  };

  const openChangeStatusModal = (userIds: number[], currentStatus?: boolean) => {
    setStatusUserIds(userIds);
    setStatusValue(currentStatus !== undefined ? !currentStatus : false);
    setChangeStatusModalOpened(true);
  };

  const theme = useMantineTheme();

  return (
    <>
      <Breadcrumbs
        items={[
          {label: 'Home', href: '/'},
          {label: 'Users'},
        ]}
      />

      <Group style={{margin: '12px 0', width: '100%'}}>
        {selection.length > 0 && (
          <Menu shadow="md" width={220}>
            <Menu.Target>
              <CounterButton leftSection={selection.length} rightSection={<IconChevronDown size={18}/>}>
                批量操作
              </CounterButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUserPlus size={18} color={theme.colors.blue[6]}/>}
                onClick={() => openAssignRolesModal(selection)}
              >
                分配角色
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLockAccessOff size={18} color={theme.colors.blue[6]}/>}
                onClick={() => openChangeStatusModal(selection)}
              >
                更改状态
              </Menu.Item>
              <Menu.Divider/>
              <Menu.Item
                leftSection={<IconTrash size={18} color={theme.colors.red[6]}/>}
                onClick={() => openDeleteModal(selection)}
              >
                删除
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        <Button
          leftSection={<IconPlus size={16}/>}
          onClick={() => setCreateUserModalOpened(true)}
          style={{marginLeft: 'auto'}} // always on right
        >
          创建用户
        </Button>
      </Group>

      <DataLoaderArray<User>
        loading={isLoading}
        data={users}
        emptyText="暂无用户"
        minHeight="50vh"
      >
        {(data) => (
          <Box px="md">
            <Table.ScrollContainer mt="md" maxHeight={900} minWidth={562} mih={580}>
              <Table highlightOnHover
                     verticalSpacing="sm"
                     stickyHeader
                     styles={{
                       td: {whiteSpace: 'nowrap'},
                     }}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={40}>
                      <Checkbox
                        checked={allSelected}
                        indeterminate={partiallySelected}
                        onChange={(e) => {
                          if (e.currentTarget.checked) {
                            setSelection(users.map((u) => u.id));
                          } else {
                            setSelection([]);
                          }
                        }}
                      />
                    </Table.Th>
                    <Table.Th w={80}>ID</Table.Th>
                    <Table.Th miw={220}>用户名</Table.Th>
                    <Table.Th miw={120}>昵称</Table.Th>
                    <Table.Th miw={120}>状态</Table.Th>
                    <Table.Th miw={180}>创建于</Table.Th>
                    <Table.Th miw={180}>更新于</Table.Th>
                    <Table.Th miw={80}>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {data.map((user) => (
                    <Table.Tr
                      key={user.id}
                      className={cx({[classes.rowSelected]: selection.includes(user.id)})}
                    >
                      <Table.Td>
                        <Checkbox
                          checked={selection.includes(user.id)}
                          onChange={() => toggleRow(user.id)}
                        />
                      </Table.Td>
                      <Table.Td>{user.id}</Table.Td>
                      <Table.Td>
                        <Group gap="sm" wrap="nowrap">
                          <Avatar size={26} src={user.avatar} radius={26}/>
                          <Text truncate>{user.username}</Text>
                          {user.is_superuser && (
                            <Badge color="teal" size="xs" variant="light">
                              超管
                            </Badge>
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>{user.nickname || "-"}</Table.Td>
                      <Table.Td>
                        <Badge color={user.is_active ? "blue" : "gray"} variant="light">
                          {user.is_active ? "正常" : "禁用"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{formatShanghaiTime(user.created_at)}</Table.Td>
                      <Table.Td>{formatShanghaiTime(user.updated_at)}</Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="transparent" color="gray" size="sm">
                              <IconDots size={20}/>
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconUserPlus size={18} color={theme.colors.blue[6]}/>}
                              onClick={() => openAssignRolesModal([user.id])}
                            >
                              分配角色
                            </Menu.Item>
                            <Menu.Item
                              leftSection={user.is_active ?
                                <IconLockAccessOff size={18} color={theme.colors.blue[6]}/> :
                                <IconLockAccess size={18} color={theme.colors.blue[6]}/>}
                              onClick={() => openChangeStatusModal([user.id], user.is_active)}
                            >
                              {user.is_active ? '禁用账号' : '激活账号'}
                            </Menu.Item>
                            <Menu.Item leftSection={<IconKey size={16} color={theme.colors.blue[6]}/>} disabled>
                              重置密码
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item leftSection={<IconTrash size={16} color={theme.colors.red[6]}/>}>
                              删除
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {/*<Pagination*/}
            {/*  value={page}*/}
            {/*  onChange={setPage}*/}
            {/*  total={Math.ceil(total / pageSize)}*/}
            {/*  style={{marginTop: 'auto'}}*/}
            {/*/>*/}
            <Group justify="space-between" mt="md">
              <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil(total / pageSize)}
              />

              <Group gap="xs">
                <Text size="sm">每页显示</Text>
                <NativeSelect
                  data={[5, 10, 20, 50].map((n) => ({value: n.toString(), label: n.toString()}))}
                  value={pageSize.toString()}
                  onChange={(e) => {
                    setPageSize(Number(e.currentTarget.value));
                    setPage(1); // 调整页码到第一页
                  }}
                  size="sm"
                />
              </Group>
            </Group>
          </Box>
        )}
      </DataLoaderArray>

      {/* Assign Roles Modal */}
      <Modal
        opened={assignRoleModalOpened}
        onClose={() => setAssignRoleModalOpened(false)}
        title="分配角色"
        size="md"
        centered
      >
        {roleItems.map((role) => (
          <Checkbox
            key={role.id}
            label={role.display_name}
            checked={selectedRoles.includes(role.id)}
            onChange={(e) => {
              const checked = e.currentTarget.checked;
              setSelectedRoles((current) =>
                checked
                  ? [...current, role.id]
                  : current.filter((id) => id !== role.id)
              );
            }}
            mb={12}
          />
        ))}

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => setAssignRoleModalOpened(false)}
          >
            取消
          </Button>
          <Button
            loading={assignRolesMutation.isPending}
            onClick={() =>
              assignRolesMutation.mutate({
                userIds: currentUserIds,
                roleIds: selectedRoles,
              })
            }
          >
            提交
          </Button>
        </Group>
      </Modal>

      {/* Add user modal */}
      <Modal
        opened={createUserModalOpened}
        onClose={() => setCreateUserModalOpened(false)}
        title="创建用户"
        size="md"
        centered
      >
        <TextInput
          label="用户名"
          placeholder="请输入用户名"
          value={newUserForm.username}
          onChange={(e) => setNewUserForm(f => ({...f, username: e.target.value}))}
          mb="sm"
        />
        <PasswordInput
          label="密码"
          placeholder="请输入密码"
          value={newUserForm.password}
          onChange={(e) => setNewUserForm(f => ({...f, password: e.target.value}))}
          mb="sm"
        />
        <TextInput
          label="昵称"
          value={newUserForm.nickname}
          onChange={(e) =>
            setNewUserForm((f) => ({...f, nickname: e.target.value}))
          }
          mb="sm"
        />

        <Checkbox
          label="是否激活"
          checked={newUserForm.is_active}
          onChange={(e) =>
            setNewUserForm((f) => ({...f, is_active: e.target.checked}))
          }
          mb="sm"
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => setCreateUserModalOpened(false)}
          >
            取消
          </Button>
          <Button
            loading={createUserMutation.isPending}
            onClick={() => createUserMutation.mutate()}
          >
            创建
          </Button>
        </Group>
      </Modal>

      {/* Change Status Modal */}
      <Modal
        opened={changeStatusModalOpened}
        onClose={() => setChangeStatusModalOpened(false)}
        title="更改用户状态"
        centered
      >
        <Text>选择新的用户状态（共 {statusUserIds.length} 个用户）:</Text>
        <NativeSelect
          data={[
            {value: 'true', label: '激活'},
            {value: 'false', label: '禁用'},
          ]}
          value={statusValue.toString()}
          onChange={(e) => setStatusValue(e.currentTarget.value === 'true')}
          mt="sm"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setChangeStatusModalOpened(false)}>取消</Button>
          <Button
            color={statusValue ? 'blue' : 'red'}
            onClick={() =>
              changeUserStatusMutation.mutate({userIds: statusUserIds, disable: !statusValue})
            }
          >
            确认
          </Button>
        </Group>
      </Modal>

      {/* Delete user modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="删除用户"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Text mt={10}>
            确定要删除选中的 <Text fw={700} span>{deleteUserIds.length}</Text> 个用户吗？
          </Text>

          <Alert
            variant="light"
            color="red"
            title="警告"
            icon={<IconAlertCircle size={20}/>}
            styles={{root: {padding: '12px 16px', fontSize: 14}}}
          >
            用户相关数据都会被删除，删除后无法恢复
          </Alert>

          <Group justify="right" gap="sm" mt="md">
            <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
              取消
            </Button>
            <Button
              color="red"
              loading={deleteUsersMutation.isPending}
              onClick={() => deleteUsersMutation.mutate(deleteUserIds)}
            >
              删除
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default UserListPage