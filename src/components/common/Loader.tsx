import { Center, Loader, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState, type ReactNode } from "react";


interface DataLoaderSingleProps<T> {
  loading: boolean;
  data: T | null | undefined;
  emptyText?: string;
  children: (item: T) => ReactNode;
  minHeight?: number | string;
}

export function DataLoaderSingle<T>({
  loading,
  data,
  emptyText = "暂无数据",
  children,
  minHeight = "50vh",
}: DataLoaderSingleProps<T>) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) timer = setTimeout(() => setShowLoader(true), 200);
    else Promise.resolve().then(() => setShowLoader(false));
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && showLoader) {
    return (
      <Center style={{ minHeight, flexDirection: "column" }}>
        <Loader />
      </Center>
    );
  }

if (!data) {
  return (
    <Center style={{minHeight, flexDirection: "column"}}>
      <Stack align="center" gap={10}>
        <IconAlertCircle size={48} color="#999"/>
        <Text c="dimmed">{emptyText}</Text>
      </Stack>
    </Center>
  );
}

  return <>{children(data)}</>;
}


interface DataLoaderArrayProps<T> {
  loading: boolean;
  data: T[] | null | undefined;
  emptyText?: string;
  children: (items: T[]) => ReactNode;
  minHeight?: number | string;
}

export function DataLoaderArray<T>({
  loading,
  data,
  emptyText = "暂无数据",
  children,
  minHeight = "50vh",
}: DataLoaderArrayProps<T>) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) timer = setTimeout(() => setShowLoader(true), 200);
    else Promise.resolve().then(() => setShowLoader(false));
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && showLoader) {
    return (
      <Center style={{ minHeight, flexDirection: "column" }}>
        <Loader />
      </Center>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <Center style={{ minHeight, flexDirection: "column" }}>
        <Stack align="center" gap={10}>
          <IconAlertCircle size={48} color="#999" />
          <Text c="dimmed">{emptyText}</Text>
        </Stack>
      </Center>
    );
  }

  return <>{children(data!)}</>;
}
