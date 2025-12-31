import React, { useRef } from "react";
import {
  Button,
  Group,
  Text,
  Stack,
  ActionIcon,
  Progress,
  useMantineTheme,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { Dropzone as MantineDropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import classes from "./DropzoneWithButton.module.css";
import { FILE_ICONS } from "@/constants/fileIcons";
import { getFileColor } from "@/utils/fileColor.ts";

export type UploadStatus = "pending" | "success" | "error";

interface DropzoneWithButtonProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploading: boolean;
  uploadTotal?: number;
  setUploadTotal?: React.Dispatch<React.SetStateAction<number>>;
  uploadDone?: number;
  setUploadDone?: React.Dispatch<React.SetStateAction<number>>;
  uploadSuccess?: number;
  setUploadSuccess?: React.Dispatch<React.SetStateAction<number>>;
  uploadStatusMap?: Record<string, UploadStatus>;
  setUploadStatusMap?: React.Dispatch<React.SetStateAction<Record<string, UploadStatus>>>;
  onUpload: (files: File[]) => Promise<void>;
  closeModal?: () => void;
}

const getFileKey = (file: File) => `${file.name}_${file.size}`;

export function DropzoneWithButton({
  selectedFiles,
  setSelectedFiles,
  uploading,
  uploadTotal,
  setUploadTotal,
  uploadDone,
  setUploadDone,
  uploadSuccess,
  setUploadSuccess,
  uploadStatusMap = {},
  setUploadStatusMap,
  onUpload
}: DropzoneWithButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  // 清空所有选中的文件
  const handleClear = () => {
    setSelectedFiles([]);
    setUploadTotal?.(0);
    setUploadDone?.(0);
    setUploadSuccess?.(0);
    setUploadStatusMap?.({});
  };

  // 用户点击触发打开文件选择器
  const handleOpenFiles = () => {
    openRef.current?.();
  };

  return (
    <Stack gap="sm">
      <MantineDropzone
        openRef={openRef}
        disabled={uploading}
        multiple
        maxSize={100 * 1024 ** 2}
        accept={[
          MIME_TYPES.pdf,
          MIME_TYPES.doc,
          MIME_TYPES.docx,
          MIME_TYPES.jpeg,
          MIME_TYPES.png,
          MIME_TYPES.csv,
          MIME_TYPES.xls,
          MIME_TYPES.xlsx,
          MIME_TYPES.ppt,
          MIME_TYPES.pptx,
          "text/html",
          "text/plain",
          "application/json",
        ]}
        className={classes.dropzone}
        radius="md"
        onDrop={(files) =>
          setSelectedFiles((prev) => {
            const existed = new Set(prev.map((f) => getFileKey(f)));
            const filtered = files.filter((f) => !existed.has(getFileKey(f)));
            return [...prev, ...filtered];
          })
        }
      >
        <div style={{ pointerEvents: "none" }}>
          <Group justify="center">
            <MantineDropzone.Accept>
              <IconDownload size={50} color={theme.colors.green[6]} stroke={1.5} />
            </MantineDropzone.Accept>

            <MantineDropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </MantineDropzone.Reject>

            <MantineDropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} className={classes.icon} />
            </MantineDropzone.Idle>
          </Group>

          <Text ta="center" fw={600} fz="lg" mt="md">
            <MantineDropzone.Accept>松开即可添加</MantineDropzone.Accept>
            <MantineDropzone.Reject>文件类型不支持或文件过大</MantineDropzone.Reject>
            <MantineDropzone.Idle>拖拽文件到这里，或点击选择</MantineDropzone.Idle>
          </Text>

          <Text size="sm" c="dimmed" ta="center" mt={4}>
            支持 文本/ PDF / 图片 / Excel / PPT / Word 等，单文件最大 100MB
          </Text>
        </div>

        {/*<Center mt="lg">*/}
        {/*  <Button radius={50} onClick={handleOpenFiles} disabled={uploading}>*/}
        {/*    选择文件*/}
        {/*  </Button>*/}
        {/*</Center>*/}
      </MantineDropzone>

      {/* 上传进度条 */}
      {uploading && uploadTotal && uploadTotal > 0 && (
        <Stack gap={4}>
          <Progress value={(uploadDone! / uploadTotal) * 100} radius="lg" animated striped />
          <Text size="xs" c="dimmed" ta="right">
            已上传 {uploadSuccess} / {uploadTotal}
          </Text>
        </Stack>
      )}

      {/* 文件列表 */}
      {selectedFiles.length > 0 && (
        <Stack gap="2px" mt="sm" mah={240} style={{ overflowY: "auto" }}>
          {selectedFiles.map((file) => {
            const key = getFileKey(file);
            const status = uploadStatusMap[key];
            const bg =
              status === "success"
                ? "var(--mantine-color-green-0)"
                : status === "error"
                  ? "var(--mantine-color-red-0)"
                  : undefined;
            const color =
              status === "success"
                ? "green"
                : status === "error"
                  ? "red"
                  : undefined;

            const suffix = file.name.split('.').pop()?.toLowerCase() ?? 'default';

            return (
              <Group key={key} justify="space-between" gap="xs"
                     style={{ padding: 4, borderRadius: 6, backgroundColor: bg }}>
                <Group gap="xs" align="center">
                  <ThemeIcon size="sm" variant="light" color={getFileColor(suffix)}>
                    {FILE_ICONS[suffix] ?? FILE_ICONS.default}
                  </ThemeIcon>
                  <Text size="13px" c={color} style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 450,
                  }}>{file.name}</Text>
                  <Text size="13px" c={color} style={{ flexShrink: 0, margin: '0 4px' }}>·</Text>
                  <Text size="13px" c={color}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </Group>
                {!uploading && (
                  <ActionIcon color="red" variant="subtle"
                              onClick={() => setSelectedFiles(prev => prev.filter(f => getFileKey(f) !== key))}>
                    <IconX size={14} />
                  </ActionIcon>
                )}
              </Group>
            );
          })}
        </Stack>
      )}

      {/* 清空 & 上传按钮 */}
      {selectedFiles.length > 0 && (
        <Group justify="space-between" mt="sm" style={{ paddingTop: 4 }}>
          <Text size="xs" c="dimmed" style={{ marginTop: 10 }}>
            队列个数：{selectedFiles.length}
          </Text>

          <Group gap="sm" mt="sm" justify="flex-end">
            <Button size="sm" variant="outline" disabled={uploading} onClick={handleClear}>
              清空
            </Button>
            <Button size="sm" loading={uploading} disabled={uploading} onClick={() => onUpload(selectedFiles)}>
              开始上传
            </Button>
          </Group>
        </Group>
      )}
    </Stack>
  );
}