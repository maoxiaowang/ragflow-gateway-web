import {Card, Text, Badge, Group, Avatar, Stack} from '@mantine/core';
import {AppBreadcrumbs} from "@/components/common/AppBreadcrumbs";
import {useEffect, useState} from "react";
import {DatasetServices} from "@/moudules/dataset/service.ts";
import type {Dataset} from "@/moudules/dataset/types.ts";
import {DataLoader} from "@/components/common/Loader.tsx";


export function DatasetPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {items} = await DatasetServices.list({'page': 1});
        setDatasets(items);
      } catch (err) {
        console.error("获取数据集失败", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <>
      <AppBreadcrumbs items={[{label: 'Home', href: '/'}, {label: 'Users'}]}/>

      <DataLoader loading={loading} data={datasets} emptyText={"暂无知识库"}>
        {(ds) => (
          <Card
            key={ds.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{cursor: 'pointer', width: 350}}
          >
            <Group align="flex-start">
              <Avatar color="blue" radius="xl">
                {ds.name[0].toUpperCase()}
              </Avatar>

              <Stack gap={12} style={{flex: 1}}>
                <Text fw="600" size="lg">
                  {ds.name}
                </Text>

                <Text size="sm" c="dimmed" lineClamp={2}>
                  {ds.description || '暂无描述'}
                </Text>

                <Group>
                  <Badge color="green" variant="light">
                    {ds.document_count} 文档
                  </Badge>
                  <Badge color="cyan" variant="light">
                    {ds.chunk_count} 分块
                  </Badge>
                </Group>

                <Text size="xs" c="dimmed">
                  更新于 {new Date(ds.update_date).toLocaleString()}
                </Text>
              </Stack>
            </Group>
          </Card>
        )}
      </DataLoader>
    </>
  );
}
