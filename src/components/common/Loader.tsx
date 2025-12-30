import {Center, Loader, Stack, Text} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import React, {useEffect, useState, type ReactNode} from "react";


interface DataLoaderSingleProps<T> {
  loading: boolean;
  data: T | null | undefined;
  emptyText?: ReactNode | ((item: T | null | undefined) => ReactNode);
  emptyIcon?: ReactNode | ((item: T | null | undefined) => ReactNode);
  children: (item: T) => ReactNode;
  minHeight?: number | string;
}

export function DataLoaderSingle<T>({
  loading,
  data,
  emptyText = "暂无数据",
  emptyIcon = <IconAlertCircle size={48} color="#999" />,
  children,
  containerStyle = { minHeight: "50vh" },
}: DataLoaderSingleProps<T> & { containerStyle?: React.CSSProperties }) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) timer = setTimeout(() => setShowLoader(true), 200);
    else Promise.resolve().then(() => setShowLoader(false));
    return () => clearTimeout(timer);
  }, [loading]);

  const style = { display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center", ...containerStyle };

  if (loading && showLoader) {
    return (
      <Center style={style}>
        <Loader />
      </Center>
    );
  }

  if (!data) {
    return (
      <Center style={style}>
        <Stack align="center" gap={10}>
          {typeof emptyIcon === "function" ? emptyIcon(data) : emptyIcon}
          <Text c="dimmed">
            {typeof emptyText === "function" ? emptyText(data) : emptyText}
          </Text>
        </Stack>
      </Center>
    );
  }

  return <>{children(data)}</>;
}


interface DataLoaderArrayProps<T> {
  loading: boolean;
  data: T[] | null | undefined;
  emptyText?: ReactNode | ((items: T[]) => ReactNode);
  emptyIcon?: ReactNode | ((items: T[]) => ReactNode);
  children: (items: T[]) => ReactNode;
  minHeight?: number | string;
}

export function DataLoaderArray<T>(
  {

    loading,
    data,
    emptyText = "暂无数据",
    emptyIcon = <IconAlertCircle size={48} color="#999"/>,
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
      <Center style={{minHeight, flexDirection: "column"}}>
        <Loader/>
      </Center>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <Center style={{minHeight, flexDirection: "column"}}>
        <Stack align="center" gap={10}>
          {typeof emptyIcon === "function" ? emptyIcon(data ?? []) : emptyIcon}
          <Text c="dimmed">
            {typeof emptyText === "function" ? emptyText(data ?? []) : emptyText}
          </Text>
        </Stack>
      </Center>
    );
  }

  return <>{children(data!)}</>;
}
