import {useEffect, useMemo, useState} from 'react';
import {
  ActionIcon,
  Avatar, Badge,
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Menu,
  Modal,
  Pagination,
  ScrollArea,
  Table,
  Text,
  TextInput
} from '@mantine/core';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import cx from 'clsx';
import classes from './UserList.module.css';
import {Breadcrumbs} from "@/layouts/breadcrums/Breadcrumbs";
import {RoleService, UserService} from "@/moudules/iam/service";
import type {PaginatedContent} from "@/api/types";
import type {Role, User} from "@/moudules/iam/types";
import {IconDots, IconKey, IconLockAccessOff, IconPlus, IconShield, IconTrash, IconUserPlus} from "@tabler/icons-react";
import {DataLoaderArray} from "@/components/common/Loader.tsx";

export function UserListPage() {
  const [selection, setSelection] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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

  const [resetPwdModalOpened, setResetPwdModalOpened] = useState(false);
  const [resetPwdUserId, setResetPwdUserId] = useState<number | null>(null);

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deleteUserIds, setDeleteUserIds] = useState<number[]>([]);

  const [disableModalOpened, setDisableModalOpened] = useState(false);
  const [disableUserIds, setDisableUserIds] = useState<number[]>([]);

  const queryClient = useQueryClient();

  /* ======================= queries ======================= */

  // 用户列表
  const {data: userResp, isLoading} = useQuery<PaginatedContent<User>>({
    queryKey: ['users', page, pageSize],
    queryFn: async () => {
      const res = await UserService.listUsers(page, pageSize);
      return res.data;
    },
  });

  const users = useMemo(() => userResp?.items ?? [], [userResp?.items]);
  const total = userResp?.total ?? 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelection((current) => current.filter((id) => users.some(u => u.id === id)));
    }, 0);
    return () => clearTimeout(timeout);
  }, [users]);

  const allSelected = users.length > 0 && selection.length === users.length;
  const partiallySelected = selection.length > 0 && selection.length < users.length;

  // 角色列表
  const {data: roleResp} = useQuery<PaginatedContent<Role>>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await RoleService.listRoles();
      return res.data;
    },
  });

  const roleItems = roleResp?.items ?? [];

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

  const disableUsersMutation = useMutation({
    mutationFn: async ({userIds, disable}: { userIds: number[]; disable: boolean }) => {
      return UserService.disableUsers(userIds, disable);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      setDisableModalOpened(false);
      setDisableUserIds([]);
      setSelection([]);
    }
  });


  /* ======================= handlers ======================= */

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
      const roleIds =
        res.data?.map((r: Role) => r.id) ?? [];
      setSelectedRoles(roleIds);
    } else {
      setSelectedRoles([]);
    }
    setAssignRoleModalOpened(true);
  };

  const openDisableModal = (userIds: number[]) => {
    setDisableUserIds(userIds);
    setDisableModalOpened(true);
  };

  /* ======================= render ======================= */

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(85vh - 30px)',
      }}
    >
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
              <Button size="sm">批量操作 ({selection.length})</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUserPlus size={16}/>}
                onClick={() => openAssignRolesModal(selection)}
              >
                分配角色
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLockAccessOff size={16}/>}
                onClick={() => openDisableModal(selection)}
              >
                禁用
              </Menu.Item>
              <Menu.Divider/>
                            <Menu.Item
                leftSection={<IconTrash size={16}/>}
                color="red"
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
          <>
            <ScrollArea>
              <Table verticalSpacing="sm">
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
                    <Table.Th>ID</Table.Th>
                    <Table.Th>用户名</Table.Th>
                    <Table.Th>昵称</Table.Th>
                    <Table.Th>状态</Table.Th>
                    <Table.Th>超级管理员</Table.Th>
                    <Table.Th>创建于</Table.Th>
                    <Table.Th>更新于</Table.Th>
                    <Table.Th w={60}>操作</Table.Th>
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
                        <Group gap="sm">
                          <Avatar size={26} src={user.avatar} radius={26}/>
                          <span>{user.username}</span>
                        </Group>
                      </Table.Td>
                      <Table.Td>{user.nickname || "-"}</Table.Td>
                      <Table.Td>
                        <Badge color={user.is_active ? "green" : "gray"} variant="light">
                          {user.is_active ? "正常" : "禁用"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={user.is_superuser ? "blue" : "gray"} variant="light">
                          {user.is_superuser ? "是" : "否"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{user.created_at}</Table.Td>
                      <Table.Td>{user.updated_at}</Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="transparent" color="gray" size="sm">
                              <IconDots size={20}/>
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconShield size={16}/>}
                              onClick={() => openAssignRolesModal([user.id])}
                            >
                              分配角色
                            </Menu.Item>
                            <Menu.Item leftSection={<IconKey size={16}/>}>
                              重置密码
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item leftSection={<IconTrash size={16}/>} color="red">
                              删除
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>


          </>
        )}
      </DataLoaderArray>

      {/* ======================= Assign Roles Modal ======================= */}
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
        <TextInput
          label="密码"
          placeholder="请输入密码"
          type="password"
          value={newUserForm.password}
          onChange={(e) => setNewUserForm(f => ({...f, password: e.target.value}))}
          mb="sm"
        />
        <TextInput
          label="昵称"
          value={newUserForm.nickname}
          onChange={(e) =>
            setNewUserForm((f) => ({...f, nickname: e.currentTarget.value}))
          }
          mb="sm"
        />

        <Checkbox
          label="是否激活"
          checked={newUserForm.is_active}
          onChange={(e) =>
            setNewUserForm((f) => ({...f, is_active: e.currentTarget.checked}))
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

      {/* Disable user modal */}
      <Modal
        opened={disableModalOpened}
        onClose={() => setDisableModalOpened(false)}
        title="禁用用户"
        centered
      >
        <Text>确定要禁用选中的 {disableUserIds.length} 个用户吗？</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDisableModalOpened(false)}>取消</Button>
          <Button
            color="red"
            onClick={() =>
              disableUsersMutation.mutate({userIds: disableUserIds, disable: true})
            }
          >
            确认
          </Button>
        </Group>
      </Modal>
    </div>
  );
}