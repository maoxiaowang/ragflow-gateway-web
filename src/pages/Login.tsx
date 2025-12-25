import {useState} from 'react';
import {Box, Button, Center, Paper, PasswordInput, TextInput, Title} from '@mantine/core';
import type {LoginParams} from '@/auth/auth.types';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "@/auth/useAuth";
import {useNotification} from "@/hooks/useNotification.tsx";
import {getErrorMessage} from "@/api/axios.ts";

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
      navigate('/'); // 成功跳转
    } catch (err) {
      const {code, message} = getErrorMessage(err)
      if (code === 40101) {
        notify.error("登录失败", "用户名或密码错误");
      } else {
        // 其他错误统一处理
        notify.error("请求失败", message);
      }
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{
      height: '100vh',
      flexDirection: 'column',
    }}>
      <Box>
        {/* 标题 */}
        <Center mb="xl">
          <Title>RagFlow Admin</Title>
        </Center>

        {/* 登录表单 */}
        <Paper withBorder shadow="md" p={30} radius="md" style={{minWidth: 360}}>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
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
