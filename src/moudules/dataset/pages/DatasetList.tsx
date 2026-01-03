import {Card, Text, Badge, Group, Avatar, Stack, SimpleGrid} from '@mantine/core';
import {Breadcrumbs} from "@/layouts/breadcrums/Breadcrumbs.tsx";
import {useEffect, useState} from "react";
import {DatasetService} from "@/moudules/dataset/service";
import type {Dataset} from "@/moudules/dataset/types.ts";
import {DataLoaderArray} from "@/components/common/Loader.tsx";
import {useNavigate} from "react-router-dom";
import {useNotification} from "@/hooks/useNotification";


export function DatasetPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotification()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp = await DatasetService.list_datasets({ page: 1 });

        setDatasets(resp.items);

      } catch (error: unknown) {
        if (error instanceof Error) {
          notify.error('获取知识库失败', error.message);
        } else {
          notify.error('获取知识库失败', '未知错误');
        }
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [notify]);

  const navigate = useNavigate();

  return (
    <>
      <Breadcrumbs items={[{label: 'Home', href: '/'}, {label: 'Users'}]}/>

      <DataLoaderArray data={datasets} loading={loading} emptyText="暂无知识库">
        {(dsList) => (
          <SimpleGrid
            cols={{base: 1, sm: 1, md: 2, lg: 3, xl: 4}}
            spacing={{base: "sm", sm: "md", xl: "lg"}}
            verticalSpacing={{base: "sm", sm: "md", md: "lg", xl: "lg"}}
          >
            {dsList.map(ds => (
              <Card
                key={ds.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{cursor: 'pointer', width: '100%'}}
                onClick={() => navigate(`/datasets/${ds.id}`)}
              >
                <Group align="flex-start">
                  <Avatar color="blue" radius="xl">
                    {ds.name[0].toUpperCase()}
                  </Avatar>
                  <Stack gap={12} style={{flex: 1}}>
                    <Text fw="600" size="lg">{ds.name}</Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>{ds.description || '暂无描述'}</Text>
                    <Group>
                      <Badge color="green" variant="light">{ds.document_count} 文档</Badge>
                      <Badge color="cyan" variant="light">{ds.chunk_count} 分块</Badge>
                    </Group>
                    <Text size="xs" c="dimmed">更新于 {new Date(ds.update_date).toLocaleString()}</Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </DataLoaderArray>
    </>
  );
}
