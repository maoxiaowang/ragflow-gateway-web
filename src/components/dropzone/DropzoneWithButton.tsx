import { useRef } from "react";
import {
  Button,
  Group,
  Text,
  Stack,
  ActionIcon,
  Progress,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone as MantineDropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import classes from "./DropzoneWithButton.module.css";

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
  closeModal?: () => void; // optional callback
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

  const handleClear = () => {
    setSelectedFiles([]);
    setUploadTotal?.(0);
    setUploadDone?.(0);
    setUploadSuccess?.(0);
    setUploadStatusMap?.({});
  };

  return (
    <Stack gap="sm">
      <MantineDropzone
        openRef={openRef}
        disabled={uploading}
        multiple
        maxSize={30 * 1024 ** 2}
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
            <MantineDropzone.Accept>松开即可上传</MantineDropzone.Accept>
            <MantineDropzone.Reject>文件类型不支持或文件过大</MantineDropzone.Reject>
            <MantineDropzone.Idle>拖拽文件到这里，或点击选择</MantineDropzone.Idle>
          </Text>

          <Text size="sm" c="dimmed" ta="center" mt={4}>
            支持 文本/ PDF / 图片 / Excel / PPT / Word 等，单文件最大 30MB
          </Text>
        </div>
      </MantineDropzone>

      <Button variant="light" onClick={() => openRef.current?.()} disabled={uploading}>
        选择文件
      </Button>

      {/* 上传进度条 */}
      {uploading && uploadTotal && uploadTotal > 0 && (
        <Stack gap={4}>
          <Progress
            value={(uploadDone! / uploadTotal) * 100}
            radius="lg"
            animated
            striped
          />
          <Text size="xs" c="dimmed" ta="right">
            已上传 {uploadSuccess} / {uploadTotal}
          </Text>
        </Stack>
      )}

      {/* 文件列表 */}
      {selectedFiles.length > 0 && (
        <Stack gap="xs" mt="sm" mah={240} style={{ overflowY: "auto" }}>
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

            return (
              <Group key={key} justify="space-between" style={{ padding: 6, borderRadius: 6, backgroundColor: bg }}>
                <Text size="sm" c={color}>
                  {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>

                {!uploading && (
                  <ActionIcon color="red" variant="subtle" onClick={() => setSelectedFiles(prev => prev.filter(f => getFileKey(f) !== key))}>
                    <IconX size={14} />
                  </ActionIcon>
                )}
              </Group>
            );
          })}

          <Group gap="sm" mt="sm">
            <Button
              size="sm"
              loading={uploading}
              disabled={uploading || selectedFiles.length === 0}
              onClick={() => onUpload(selectedFiles)}
            >
              开始上传
            </Button>
            <Button size="sm" variant="outline" disabled={uploading && selectedFiles.length === 0} onClick={handleClear}>
              清空
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}