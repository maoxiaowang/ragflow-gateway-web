import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Center,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconColorSwatch, IconUpload } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

import { Breadcrumbs } from "@/layouts/breadcrums/Breadcrumbs";
import { DatasetService } from "@/moudules/dataset/service";
import type { Dataset, Document } from "@/moudules/dataset/types";
import { DataLoaderArray, DataLoaderSingle } from "@/components/common/Loader";
import { DropzoneWithButton, type UploadStatus } from "@/components/dropzone/DropzoneWithButton";
import {formatShanghaiTime} from "@/utils/tz.ts";

export function DatasetDetailPage() {
  const { datasetId } = useParams<{ datasetId: string }>();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDataset, setLoadingDataset] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadDone, setUploadDone] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(0);
  const [uploadStatusMap, setUploadStatusMap] = useState<Record<string, UploadStatus>>({});

  const statusMap: Record<string, { label: string; color: string }> = {
    done: { label: "完成", color: "green" },
    failed: { label: "解析失败", color: "red" },
    running: { label: "解析中", color: "yellow" },
  };

  // ===== 数据获取 =====
  const fetchDataset = useCallback(async () => {
    setLoadingDataset(true);
    try {
      const resp = await DatasetService.list_datasets({ id: datasetId });
      setDataset(resp.data.items?.[0] || null);
    } finally {
      setLoadingDataset(false);
    }
  }, [datasetId]);

  const fetchDocuments = useCallback(async () => {
    setLoadingDocuments(true);
    try {
      const resp = await DatasetService.list_documents(datasetId!);
      setDocuments(resp.data.items || []);
    } finally {
      setLoadingDocuments(false);
    }
  }, [datasetId]);

  useEffect(() => {
    if (!datasetId) return;
    void fetchDataset();
    void fetchDocuments();
  }, [datasetId, fetchDataset, fetchDocuments]);

  const getFileKey = (file: File) => `${file.name}_${file.size}`;

  // ===== 上传逻辑（串行 + 行内标记） =====
  const uploadDocuments = async (files: File[]) => {
  if (files.length === 0) return;

  setUploading(true);
  setUploadTotal(files.length);
  setUploadDone(0);
  setUploadSuccess(0);

  // 初始化状态
  const map: Record<string, UploadStatus> = {};
  files.forEach(f => map[getFileKey(f)] = "pending");
  setUploadStatusMap(map);

  try {
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = getFileKey(file);
      try {
        await DatasetService.uploadDocument(datasetId!, file);
        setUploadStatusMap(prev => ({ ...prev, [key]: "success" }));
        successCount++;
      } catch {
        setUploadStatusMap(prev => ({ ...prev, [key]: "error" }));
        failCount++;
      }
      setUploadDone(i + 1);
      setUploadSuccess(successCount);
    }

    await fetchDocuments();

    // 根据是否有失败文件决定是否关闭 Modal
    if (failCount === 0) {
      setUploadModalOpened(false);
      setSelectedFiles([]);
      setUploadTotal(0);
      setUploadDone(0);
      setUploadSuccess(0);
      setUploadStatusMap({});
    }
  } finally {
    setUploading(false);
  }
};

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "知识库", href: "/datasets" },
          { label: dataset?.name || "详情" },
        ]}
      />

      {/* 知识库信息 */}
      <DataLoaderSingle loading={loadingDataset} data={dataset}>
        {(ds) => (
          <Paper radius="md" p="lg">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <ThemeIcon size="xl" radius="md" variant="gradient" gradient={{deg: 0, from: "blue", to: "teal"}}>
                  <IconColorSwatch size={20} />
                </ThemeIcon>

                <Text size="xl" fw={600}>
                  {ds.name}
                </Text>

                <Text size="sm" c="dimmed">
                  {ds.description || "暂无描述"}
                </Text>

                <Group gap="sm">
                  <Badge variant="light">{ds.document_count} 文档</Badge>
                  <Badge variant="light" color="gray">{ds.chunk_count} 分块</Badge>
                </Group>

                <Text size="xs" c="dimmed">
                  更新于 {formatShanghaiTime(ds.update_date)}
                </Text>
              </Stack>

              <Button
                leftSection={<IconUpload size={14} />}
                onClick={() => setUploadModalOpened(true)}
              >
                上传文档
              </Button>
            </Group>
          </Paper>
        )}
      </DataLoaderSingle>

      {/* 文档列表 */}
      <DataLoaderArray loading={loadingDocuments} data={documents}>
        {(docs) => (
          <ScrollArea mt="md" mah={500}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>文档名</Table.Th>
                  <Table.Th>上传时间</Table.Th>
                  <Table.Th>大小</Table.Th>
                  <Table.Th>解析状态</Table.Th>
                  <Table.Th>操作</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {docs.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Center py="md">暂无文档</Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  docs.map((doc) => (
                    <Table.Tr key={doc.id}>
                      <Table.Td>{doc.name}</Table.Td>
                      <Table.Td>{formatShanghaiTime(doc.create_date)}</Table.Td>
                      <Table.Td>{(doc.size / 1024).toFixed(2)} KB</Table.Td>
                      <Table.Td>
                        <Badge color={statusMap[doc.status]?.color}>
                          {statusMap[doc.status]?.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Button size="xs" variant="subtle">下载</Button>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </DataLoaderArray>

      {/* 上传 Modal */}
      <Modal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        title="上传文档"
        size="lg"
        centered
      >
        <Stack gap="md">
          <DropzoneWithButton
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            uploading={uploading}
            uploadTotal={uploadTotal}
            uploadDone={uploadDone}
            uploadSuccess={uploadSuccess}
            uploadStatusMap={uploadStatusMap}
            onUpload={uploadDocuments}
          />
        </Stack>
      </Modal>
    </>
  );
}
