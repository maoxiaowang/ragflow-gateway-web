import {useState} from 'react';
import {Avatar, Center, Checkbox, Group, Loader, Pagination, ScrollArea, Table, Text} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import classes from './UserList.module.css';
import cx from 'clsx';
import {Breadcrumbs} from "@/layouts/breadcrums/Breadcrumbs";
import {UserService} from "@/moudules/user/service";
import type {PaginatedContent} from "@/api/types";
import type {User} from "@/moudules/user/types";


export function UserListPage() {
  const [selection, setSelection] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [orderBy, setOrderBy] = useState('created_at'); // 默认排序字段
  const [descOrder, setDescOrder] = useState(false); // 默认升序

  const toggleRow = (id: number) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  // const toggleAll = (items: User[]) =>
  //   setSelection((current) => (current.length === items.length ? [] : items.map((item) => item.id)));


const { data: resp, isLoading } = useQuery<PaginatedContent<User>>({
  queryKey: ['users', page, pageSize],
  queryFn: async () => {
    const result = await UserService.list_users(page, pageSize);
    return result.data; // 返回 PaginatedContent<User>
  },
});

  const items = resp?.items ?? [];
  const total = resp?.total ?? 0;

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: 'calc(85vh - 30px)'}}>
      <Breadcrumbs items={[{label: 'Home', href: '/'}, {label: 'Users'}]}/>

      {isLoading ? (
        <Center style={{minHeight: '50vh', flexDirection: 'column'}}>
          <Loader/>
        </Center>
      ) : !items.length ? (
        <Center style={{minHeight: '50vh', flexDirection: 'column'}}>
          <Text c="dimmed">暂无用户</Text>
        </Center>
      ) : (
        <>
          <ScrollArea style={{overflowX: 'auto'}}>
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
                  <Table.Th>Created At</Table.Th>
                  <Table.Th>Updated At</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => (
                  <Table.Tr key={item.id} className={cx({[classes.rowSelected]: selection.includes(item.id)})}>
                    <Table.Td>
                      <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)}/>
                    </Table.Td>
                    <Table.Td>{item.id}</Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size={26} src={item.avatar} radius={26}/>
                        <Text size="sm" fw={500}>{item.username}</Text>
                      </Group>
                    </Table.Td>
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
            style={{marginTop: 'auto'}}
          />
        </>
      )}
    </div>
  );
}