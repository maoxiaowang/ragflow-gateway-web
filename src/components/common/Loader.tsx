import {Loader, Center, Text, Stack} from '@mantine/core';
import {type ReactNode, useEffect, useState} from 'react';
import {IconAlertCircle} from "@tabler/icons-react";

interface DataLoaderProps<T> {
  loading: boolean;
  data: T[] | null | undefined;
  emptyText?: string;
  children: (item: T) => ReactNode;
  minHeight?: number | string; // Loader 最小高度
}

export function DataLoader<T>({
                                loading,
                                data,
                                emptyText = '暂无数据',
                                children,
                              }: DataLoaderProps<T>) {
  const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (loading) {
      // 用 setTimeout 异步触发 setShow，避免同步调用
      timer = setTimeout(() => setShowLoader(true), 200); // 延迟 200ms
    } else {
      Promise.resolve().then(() => setShowLoader(false));
    }

    return () => clearTimeout(timer);
  }, [loading]);

  // 延迟 Loader 优先显示
  if (loading && showLoader) {
    return (
      <Center style={{ minHeight: "50vh", flexDirection: 'column' }}>
        <Loader />
      </Center>
    );
  }

  // 数据为空时才显示空状态
  if (!loading && (!data || data.length === 0)) {
    return (
      <Center style={{ minHeight: "50vh", flexDirection: 'column' }}>
        <Stack align="center" gap={10}>
          <IconAlertCircle size={48} color="#999" />
          <Text color="dimmed">{emptyText}</Text>
        </Stack>
      </Center>
    );
  }

  return <Stack gap="lg">{data?.map((item) => children(item))}</Stack>;
}
