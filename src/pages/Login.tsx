import {useState} from 'react';
import {Box, Button, Center, Paper, PasswordInput, TextInput, Title} from '@mantine/core';
import type {LoginParams} from '@/auth/auth.types';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "@/auth/useAuth";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async () => {
        setLoading(true);
        const params: LoginParams = {username, password};
        try {
          await login(params);
          navigate('/'); // 成功跳转
        } catch (err) {
          void err;
          setPassword('');
        } finally {
          setLoading(false);
        }
    };

    return (
        <Center style={{
            width: '100vw',
            height: '100vh',
            flexDirection: 'column',
            paddingBottom: '30vh', // 顶部留空，整体稍微靠上
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