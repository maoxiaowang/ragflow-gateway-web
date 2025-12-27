import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Center, Paper, PasswordInput, TextInput, Title} from '@mantine/core';
import {useNotification} from '@/hooks/useNotification';
import {ROUTES} from '@/routes';

import type {LoginParams} from '@/auth/types';
import {useAuth} from '@/auth/useAuth';
import {AuthError} from '@/auth/errors';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();
  const notify = useNotification();

  const handleSubmit = async () => {
    setLoading(true);

    const params: LoginParams = {username, password};

    try {
      await login(params);
      navigate(ROUTES.dashboard.path); // 成功跳转
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        notify.error('登录失败', err.message);
      } else {
        notify.error('登录失败', '未知错误');
      }
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{height: '100vh', flexDirection: 'column'}}>
      <Box>
        {/* 标题 */}
        <Center mb="xl">
          <Title>RagFlow Admin</Title>
        </Center>

        {/* 登录表单 */}
        <Paper withBorder shadow="md" p={30} radius="md" style={{minWidth: 360}}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <TextInput
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
            <PasswordInput
              label="密码"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              mt="md"
              required
            />
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              登录
            </Button>
          </form>
        </Paper>
      </Box>
    </Center>
  );
}