/*
全局 Provider
应用“外壳”（主题 / 通知 / 全局）
 */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import App from './App';
import {AuthProvider} from "@/auth/AuthProvider";
import {LoadingProvider} from "@/context/LoginContext.tsx";
import {GlobalLoading} from "@/components/Common/GlobalLoading.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <Notifications />
      <LoadingProvider>
        {/* 全局遮罩 */}
        <GlobalLoading />

        {/* Auth 状态管理 */}
        <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
        </QueryClientProvider>
      </LoadingProvider>
    </MantineProvider>
  </StrictMode>
);