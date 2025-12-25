import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification as _Notification } from '@mantine/core';
import React from 'react';

type NotificationProps = {
  title: string;
  content: string | React.ReactNode;
  type?: 'success' | 'error'; // 可以扩展 info 等
};

export function Notification({ title, content, type = 'error' }: NotificationProps) {
  const config = {
    success: { color: 'teal', icon: <IconCheck size={20} /> },
    error: { color: 'red', icon: <IconX size={20} /> },
  };

  const { color, icon } = config[type];

  return (
    <_Notification title={title} color={color} icon={icon}>
      {content}
    </_Notification>
  );
}