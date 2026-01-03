import {notifications} from "@mantine/notifications";
import {useMemo} from "react";

export function useNotification() {
  return useMemo(() => ({
    success: (title: string, content?: string) => {
      notifications.show({
        autoClose: 3000,
        message: content ?? '',
        title: title,
        color: 'teal',
      });
    },
    error: (title: string, content?: string) => {
      notifications.show({
        autoClose: 5000,
        message: content ?? '',
        title: title,
        color: 'red',
      });
    },
    info: (title: string, content?: string) => {
      notifications.show({
        autoClose: 3000,
        message: content ?? '',
        title: title,
      });
    },
  }), []);
}