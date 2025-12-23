import {useState, useEffect, ReactNode} from 'react';
import {
  Anchor,
  Avatar,
  Breadcrumbs,
  Checkbox,
  Container,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text
} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import {request} from '@/api/axios';
import {UserEndpoints} from '@/api/endpoints'; // 假设这是你之前定义的接口
import classes from './UserList.module.css';
import cx from 'clsx';
import {Link} from "react-router-dom";

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

  const toggleAll = () =>
    setSelection((current) => (current.length === data?.data.items.length ? [] : data?.data.items.map((item) => item.id)));


  // 获取用户列表的查询函数
  const {data, isLoading} = useQuery<UserListResponse>({
    queryKey: ['users', page, pageSize, orderBy, descOrder],  // 使用 queryKey 作为数组
    queryFn: () =>
      request.get(UserEndpoints.list, {
        params: {page, page_size: pageSize, order_by: orderBy, desc_order: descOrder},
      }),
  });

  // 渲染用户列表
  const rows = data?.data.items.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={cx({[classes.rowSelected]: selected})}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)}/>
        </Table.Td>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={26} src={item.avatar} radius={26}/>
            <Text size="sm" fw={500}>
              {item.username}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.job}</Table.Td>
        <Table.Td>{item.created_at}</Table.Td>
        <Table.Td>{item.updated_at}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Breadcrumbs separatorMargin="md" mt="xs" style={{ textAlign: 'left' }}>
          <Anchor href="/">Home</Anchor>
          <Anchor href="/users">Users</Anchor>
        </Breadcrumbs>
      </div>

      <ScrollArea style={{minHeight: '400px', overflowX: 'auto'}}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === data?.data.items.length}
                  indeterminate={selection.length > 0 && selection.length !== data?.data.items.length}
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
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

      </ScrollArea>
              {/* 分页控件 */}
        <Pagination
          page={page}
          onChange={setPage}
          total={Math.ceil(data?.data.total / pageSize)}  // 总页数计算
          onPerPageChange={setPageSize}
          pageSize={pageSize}
          position="center"
        />
    </>
  );
}