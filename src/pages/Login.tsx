import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Center,
} from '@mantine/core';
import {useNotification} from '@/hooks/useNotification';
import {ROUTES} from '@/routes';
import {useAuth} from '@/auth/useAuth';
import {AuthError} from '@/auth/errors';
import classes from './Login.module.css';

import type {LoginParams} from '@/auth/types';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();
  const notify = useNotification();

  const handleSubmit = async () => {
    setLoading(true);
    const params: LoginParams = {username, password};

    try {
      await login(params);
      navigate(ROUTES.dashboard.path);
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
    <div className={classes.wrapper}>
      <Paper className={classes.form} withBorder shadow="md" radius="md" p="xl">
        <Center mb="xl">
          <Text
                fw={900}
                size="xl"
                variant="gradient"
                gradient={{from: 'blue', to: 'cyan', deg: 90}}
          >
            <Title order={2} className={classes.title}>
              RagFlow Gateway
            </Title>

          </Text>
        </Center>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <TextInput
            label="用户名"
            placeholder="请输入用户名"
            size="md"
            radius="md"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
          />

          <PasswordInput
            label="密码"
            placeholder="请输入密码"
            size="md"
            radius="md"
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />

          <Checkbox
            label="保持登录"
            mt="md"
            size="md"
            checked={keepLogin}
            onChange={(e) => setKeepLogin(e.currentTarget.checked)}
          />

          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            loading={loading}
          >
            登录
          </Button>
        </form>

        <Text ta="center" mt="md">
          没有账号?{' '}
          <Anchor href="#" fw={500} onClick={(e) => e.preventDefault()}>
            注册
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}