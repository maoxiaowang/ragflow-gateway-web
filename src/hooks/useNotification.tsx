import { notifications } from "@mantine/notifications";

export function useNotification() {

  const success = (title: string, content: string) => {
    notifications.show({
      autoClose: 3000,
      message: content,
      title: title,
      color: "teal"
    });
  };

  const error = (title: string, content: string) => {
    notifications.show({
      autoClose: 5000,
      message: content,
      title: title,
      color: "red"
    });
  };

  const info = (title: string, content: string) => {
    notifications.show({
      autoClose: 3000,
      message: content,
      title: title
    });
  };

  return { success, error, info };
}