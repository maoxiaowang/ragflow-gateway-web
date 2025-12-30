import React, {useCallback, useEffect, useState} from "react";
import {
  ActionIcon,
  Badge, Box,
  Button,
  Checkbox, CloseButton,
  Group,
  Menu,
  Modal, Pagination,
  Paper,
  Stack, Switch,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconDots,
  IconDownload,
  IconFileCode,
  IconTrash,
  IconUpload,
  IconQuestionMark, IconSearchOff, IconSearch, IconBrandDatabricks
} from "@tabler/icons-react";
import {useParams} from "react-router-dom";

import {Breadcrumbs} from "@/layouts/breadcrums/Breadcrumbs";
import {DatasetService} from "@/moudules/dataset/service";
import type {Dataset, Document} from "@/moudules/dataset/types";
import {DataLoaderArray, DataLoaderSingle} from "@/components/common/Loader";
import {DropzoneWithButton, type UploadStatus} from "@/components/dropzone/DropzoneWithButton";
import {formatShanghaiTime} from "@/utils/tz.ts";
import {FILE_ICONS} from "@/constants/fileIcons.tsx";
import {getFileColor} from "@/utils/fileColor";
import api from "@/api/axios.ts";
import {API_ENDPOINTS} from "@/api";
import {useNotification} from "@/hooks/useNotification.tsx";

export function DatasetDetailPage() {
  const {datasetId} = useParams<{ datasetId: string }>();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDataset, setLoadingDataset] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  // 删除
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadDone, setUploadDone] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(0);
  const [uploadStatusMap, setUploadStatusMap] = useState<Record<string, UploadStatus>>({});

  // 删除
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDocIds, setDeleteDocIds] = useState<string[]>([]);
  const [deleteChunks, setDeleteChunks] = useState(true);

  // 解析
  const [parseDocIds, setParseDocIds] = useState<string[]>([]);
  const [parsing, setParsing] = useState(false);
  const [autoParse, setAutoParse] = useState(true);

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 搜索
  const [searchText, setSearchText] = useState("");  // 搜索框的文字
  const [finalSearchText, setFinalSearchText] = useState("")  // 最终搜索关键字
  const [prevPageBeforeSearch, setPrevPageBeforeSearch] = useState(1);

  const pageSize = 10;

  const notify = useNotification();

  const statusMap: Record<string, { label: string; color: string }> = {
    DONE: {label: "完成", color: "green"},
    FAILED: {label: "失败", color: "red"},
    RUNNING: {label: "解析中", color: "yellow"},
    UNSTART: {label: "未解析", color: "grey"}
  };


  // ============= 数据获取 ===============

  const fetchDataset = useCallback(async () => {
    setLoadingDataset(true);
    try {
      const resp = await DatasetService.list_datasets({_id: datasetId});
      setDataset(resp.data.items?.[0] || null);
    } finally {
      setLoadingDataset(false);
    }
  }, [datasetId]);

  const fetchDocuments = useCallback(async () => {
    if (!datasetId) return;

    setLoadingDocuments(true);
    const params: Record<string, string | number> = {
      page: currentPage,
      page_size: pageSize,
    };
    if (finalSearchText.trim()) {
      params.keywords = finalSearchText.trim();
    }

    try {
      const resp = await DatasetService.list_documents(datasetId, params);

      const items = resp.data.items || [];
      const total = resp.data.total || items.length || 0;
      const pages = Math.ceil(total / pageSize);
      setTotalPages(pages);

      if (!finalSearchText && items.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return; // 等 useEffect 监听 currentPage 来重新调用 fetchDocuments
      }

      setDocuments(items);
    } finally {
      setLoadingDocuments(false);
    }
  }, [currentPage, datasetId, finalSearchText]);

  useEffect(() => {
    if (!datasetId) return;
    void fetchDataset();
    void fetchDocuments();
  }, [datasetId, fetchDataset, fetchDocuments]);

  const getFileKey = (file: File) => `${file.name}_${file.size}`;

  // ============= 文档解析 ===============

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
          const uploadedDoc = await DatasetService.uploadDocument(datasetId!, file);
          setUploadStatusMap(prev => ({...prev, [key]: "success"}));
          successCount++;

          // 如果勾选了“创建时解析”，立即解析该文档
          const uploadDocId = uploadedDoc.data?.[0]?.id;
          if (autoParse && uploadDocId) {
            // 解析单个文档
            await DatasetService.parseDocuments(datasetId!, [uploadDocId]);
          }

        } catch {
          setUploadStatusMap(prev => ({...prev, [key]: "error"}));
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

  // ============= 文档删除 ===============

  const handleDelete = async () => {
    if (!datasetId || deleteDocIds.length === 0) return;

    setDeleting(true);
    try {
      // 如果勾选了“同时删除切片”，先调用删除 chunk 接口
      if (deleteChunks) {
        await Promise.all(
          deleteDocIds.map(docId => DatasetService.deleteChunks(datasetId, docId)),
        );
      }

      // 调用删除文档接口
      const resp = await DatasetService.deleteDocuments(datasetId, deleteDocIds);
      if (resp.code === 0) {
        await fetchDocuments();
        setDeleteModalOpened(false);
        setDeleteDocIds([]);
      }
    } finally {
      setDeleting(false);
    }
  };

  // ============= 文档解析 ===============

  const handleParse = useCallback(async () => {
    if (!datasetId || parseDocIds.length === 0) return;
    setParsing(true)
    const resp = await DatasetService.parseDocuments(datasetId, parseDocIds)
    if (resp.code === 0) {
      await fetchDocuments();
    }
    setParseDocIds([])
    setParsing(false)
  }, [datasetId, fetchDocuments, parseDocIds]);

  useEffect(() => {
    if (parseDocIds.length === 0 || parsing) return;
    void handleParse();
  }, [parseDocIds, parsing, handleParse]);


  // ============= 文档下载 ===============

  const handleDownload = async (docId: string, docName: string) => {
    if (!datasetId) return;

    try {
      const resp = await api.get(
        API_ENDPOINTS.ragflow.document.download(datasetId, docId).path,
        {responseType: 'blob'}
      );

      // 获取 Content-Disposition
      const disposition = resp.headers['content-disposition'];
      let filename = docName; // 优先使用前端提供的 name
      if (!filename && disposition) {
        const utf8Match = disposition.match(/filename\*=UTF-8''(.+)$/);
        const asciiMatch = disposition.match(/filename="?([^"]+)"?/);
        if (utf8Match) filename = decodeURIComponent(utf8Match[1]);
        else if (asciiMatch) filename = asciiMatch[1];
      }

      const blob = new Blob([resp.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      notify.success("下载成功", "打开浏览器下载历史查看")
    } catch (err) {
      console.error('下载失败', err);

    }
  };

  // ============= 轮询解析状态 ===============

  useEffect(() => {
    if (documents.length === 0) {
      return;
    }

    const hasRunning = documents.some(doc => doc.run === 'RUNNING');
    if (!hasRunning) {
      // 没有解析中的文档，停止轮询
      return;
    }

    // 有解析中的文档，开始轮询
    const interval = setInterval(() => {
      void fetchDocuments();
    }, 3000);

    return () => clearInterval(interval);
  }, [documents, fetchDocuments, currentPage]);

  // ============= 文档搜索 ===============

  const handleSearch = () => {
    setPrevPageBeforeSearch(currentPage);
    setCurrentPage(1);
    setFinalSearchText(searchText);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setCurrentPage(prevPageBeforeSearch);
    setFinalSearchText("")
  };


  return (
    <>
      <Breadcrumbs
        items={[
          {label: "首页", href: "/"},
          {label: "知识库", href: "/datasets"},
          {label: dataset?.name || "详情"},
        ]}
      />

      {/* 知识库信息 */}
      <DataLoaderSingle loading={loadingDataset} data={dataset} containerStyle={{minHeight: 171, backgroundColor: "#f6f6f6"}}>
        {(ds) => (
          <Paper radius="md" p="lg" style={{backgroundColor: "#f6f6f6"}}>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">

                <Group align="center" gap="sm">
                  <ThemeIcon size="xl" radius="md" variant="gradient" gradient={{deg: 0, from: "blue", to: "teal"}}>
                    <IconBrandDatabricks size={26}/>
                  </ThemeIcon>

                  <Text size="xl" fw={600}>
                    {ds.name}
                  </Text>
                </Group>

                {/* 描述 */}
                <Text size="sm" c="dimmed">
                  {ds.description || "暂无描述"}
                </Text>

                {/* Badge */}
                <Group gap="sm">
                  <Badge variant="light">{ds.document_count} 文档</Badge>
                  <Badge variant="light" color="gray">{ds.chunk_count} 分块</Badge>
                </Group>

                {/* 更新时间 */}
                <Text size="xs" c="dimmed">
                  更新于 {formatShanghaiTime(ds.update_date)}
                </Text>
              </Stack>

              <Button
                leftSection={<IconUpload size={14}/>}
                onClick={() => setUploadModalOpened(true)}
                variant="gradient"
              >
                上传文档
              </Button>
            </Group>
          </Paper>
        )}
      </DataLoaderSingle>

      {/* 搜索输入框 */}
      <Group mt="xl" mb="sm" pl="lg">
        <TextInput
          size="xs"
          placeholder="输入文档名搜索"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.currentTarget.value);
            // 如果用户清空了输入框，自动清除搜索
            if (e.currentTarget.value === "") {
              handleClearSearch();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => handleClearSearch()}
              style={{display: searchText ? undefined : 'none'}}
            />
          }
        />

        {/* 搜索按钮 */}
        <ActionIcon onClick={handleSearch} disabled={!searchText}> <IconSearch size={16}/> </ActionIcon>

      </Group>


      {/* 文档列表 */}
      <DataLoaderArray
        loading={loadingDocuments}
        data={documents}
        emptyText={() =>
          finalSearchText
            ? "未找到匹配的文档"
            : "暂无文档"
        }
        emptyIcon={finalSearchText ? <IconSearchOff size={48} color="#999"/> : undefined}
      >
        {(docs) => (
          <Box px="md">
            <Table.ScrollContainer mt="md" maxHeight={900} minWidth={562} mih={566}>
              <Table highlightOnHover miw={800} verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{whiteSpace: "nowrap", overflow: "hidden",}}>文档名</Table.Th>
                    <Table.Th>上传时间</Table.Th>
                    <Table.Th miw="50">大小</Table.Th>
                    <Table.Th miw="70">切片数</Table.Th>
                    <Table.Th miw="80">解析状态</Table.Th>
                    <Table.Th miw="50">操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {docs.map((doc) => (
                    <Table.Tr key={doc.id}>
                      <Table.Td>
                        <Group gap="xs" align="center">
                          {/* 根据 suffix 获取图标，没匹配到用 default */}
                          <ThemeIcon
                            size="sm"
                            variant="light"
                            color={getFileColor(doc.suffix)}
                          >
                            {FILE_ICONS[doc.suffix] ?? FILE_ICONS.default}
                          </ThemeIcon>
                          <Text>{doc.name}</Text>
                        </Group></Table.Td>
                      <Table.Td>{formatShanghaiTime(doc.create_date)}</Table.Td>
                      <Table.Td miw="50">{(doc.size / 1024).toFixed(2)} KB</Table.Td>
                      <Table.Td miw="50">{doc.chunk_count > 0 ? doc.chunk_count : '-'}</Table.Td>
                      <Table.Td miw="50">
                        <Badge variant="light" color={statusMap[doc.run]?.color}>
                          {statusMap[doc.run]?.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" trigger="click" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="transparent" color="gray" size="sm">
                              <IconDots size={20}/>
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconFileCode size={16}/>}
                              disabled={deleting || doc.run === "RUNNING"}
                              onClick={() => {
                                setParseDocIds([doc.id])
                              }}>解析</Menu.Item>
                            <Menu.Item
                              leftSection={<IconDownload size={16}/>}
                              onClick={() => handleDownload(doc.id, doc.name)}>下载
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item
                              leftSection={<IconTrash size={16}/>}
                              color="red"
                              disabled={deleting || doc.run === "RUNNING"}
                              onClick={() => {
                                setDeleteDocIds([doc.id]);   // 单删也是 list
                                setDeleteModalOpened(true);
                              }}>删除</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))
                  }
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>


            <Group display="center" mt="md">
              <Pagination
                value={currentPage}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
                total={totalPages}
                size="md"
                siblings={1}
                withEdges
              />
            </Group>

          </Box>

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
        <Group align="center" gap="xs" style={{marginBottom: '10px'}}>
          <Switch
            label="创建时解析"
            checked={autoParse}
            onChange={(event) => setAutoParse(event.currentTarget.checked)}
          />
          <Tooltip label="文档解析完成后才可用于 AI 问答和检索" position="top" withArrow>
            <ActionIcon color="gray" variant="light" size="xs">
              <IconQuestionMark size={14}/>
            </ActionIcon>
          </Tooltip>
        </Group>
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

      {/* 确认删除 Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpened(false);
          }
        }}
        title="确认删除"
        centered
      >
        <Stack>
          <Text>{deleteDocIds.length === 1
            ? "确认删除该文档吗？"
            : `确认删除选中的 ${deleteDocIds.length} 个文档吗？`}</Text>
          <Checkbox
            label="同时删除切片"
            checked={deleteChunks}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDeleteChunks(event.currentTarget.checked)}
          />
          <Group justify="flex-end">
            <Button variant="default" disabled={deleting} onClick={() => setDeleteModalOpened(false)}>取消</Button>
            <Button color="red" loading={deleting} disabled={deleting} onClick={handleDelete}>删除</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
