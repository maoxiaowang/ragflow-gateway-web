import {useState} from 'react';
import {
  Avatar, Center,
  Checkbox,
  Group, Loader,
  Pagination,
  ScrollArea,
  Table,
  Text
} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import {request} from '@/api/request';
import {USER_ENDPOINTS} from '@/api/endpoints'; // 假设这是你之前定义的接口
import classes from './UserList.module.css';
import cx from 'clsx';
import {AppBreadcrumbs} from "@/components/common/AppBreadcrumbs.tsx";


interface User {
  id: string;
  avatar: string;
  username: string;
  email: string;
  job: string;
  created_at: string;
  updated_at: string;
}

interface UserListResponse {
  data: {
    total: number;
    page: number;
    page_size: number;
    items: User[];
  };
  code: number;
  message: string;
}


export function UserListPage() {
  const [selection, setSelection] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('created_at'); // 默认排序字段
  const [descOrder, setDescOrder] = useState(false); // 默认升序

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  // const toggleAll = (items: User[]) =>
  //   setSelection((current) => (current.length === items.length ? [] : items.map((item) => item.id)));


  // 获取用户列表的查询函数
  const {data, isLoading} = useQuery<UserListResponse>({
    queryKey: ['users', page, pageSize, orderBy, descOrder],  // 使用 queryKey 作为数组
    queryFn: () =>
      request.get(USER_ENDPOINTS.list, {
        params: {page, page_size: pageSize, order_by: orderBy, desc_order: descOrder},
      }),
  });

  const items = data?.data.items ?? [];
  const total = data?.data.total ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(85vh - 30px)' }}>
      {/* Breadcrumb 永远显示 */}
      <AppBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Users' }]} />

      {isLoading ? (
        <Center style={{ minHeight: '50vh', flexDirection: 'column' }}>
          <Loader />
        </Center>
      ) : !items.length ? (
        <Center style={{ minHeight: '50vh', flexDirection: 'column' }}>
          <Text c="dimmed">暂无用户</Text>
        </Center>
      ) : (
        <>
          <ScrollArea style={{ overflowX: 'auto' }}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={40}>
                    <Checkbox
                      onChange={(e) => {
    const checked = e.currentTarget.checked;
    if (checked) {
      setSelection(items.map((item) => item.id));
    } else {
      setSelection([]);
    }
  }}
                      checked={selection.length === items.length}
                      indeterminate={selection.length > 0 && selection.length < items.length}
                    />
                  </Table.Th>
                  <Table.Th>UID</Table.Th>
                  <Table.Th>Username</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Job</Table.Th>
                  <Table.Th>Created At</Table.Th>
                  <Table.Th>Updated At</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => (
                  <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selection.includes(item.id) })}>
                    <Table.Td>
                      <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
                    </Table.Td>
                    <Table.Td>{item.id}</Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size={26} src={item.avatar} radius={26} />
                        <Text size="sm" fw={500}>{item.username}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{item.email}</Table.Td>
                    <Table.Td>{item.job}</Table.Td>
                    <Table.Td>{item.created_at}</Table.Td>
                    <Table.Td>{item.updated_at}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Pagination
            value={page}
            onChange={setPage}
            total={Math.ceil(total / pageSize)}
            style={{ marginTop: 'auto' }}
          />
        </>
      )}
    </div>
  );
}