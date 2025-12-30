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
import {useForm} from '@mantine/form';
import {useNotification} from '@/hooks/useNotification';
import {ROUTES} from '@/routes';
import {useAuth} from '@/auth/useAuth';
import {AuthError} from '@/auth/errors';
import classes from './Login.module.css';

import type {LoginParams} from '@/auth/types';
import {useState} from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [keepLogin, setKeepLogin] = useState(true);

  const navigate = useNavigate();
  const {login} = useAuth();
  const notify = useNotification();

  const form = useForm<LoginParams>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (v) => (!v ? '请输入用户名' : null),
      password: (v) => (!v ? '请输入密码' : null),
    },
  });

  const handleSubmit = async (values: LoginParams) => {
    setLoading(true);
    try {
      await login(values, keepLogin);
      navigate(ROUTES.dashboard.path);
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        notify.error('登录失败', err.message);
      } else {
        notify.error('登录失败', '未知错误');
      }
      form.setFieldValue('password', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} withBorder shadow="md" radius="md" p="xl">
        <Center mb="xl">
          <Title order={2} className={classes.title}>
            RagFlow Gateway
          </Title>
        </Center>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="用户名"
            placeholder="请输入用户名"
            size="md"
            radius="md"
            required
            autoFocus
            {...form.getInputProps('username')}
          />

          <PasswordInput
            label="密码"
            placeholder="请输入密码"
            size="md"
            radius="md"
            mt="md"
            required
            {...form.getInputProps('password')}
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
          <Anchor
            fw={500}
            onClick={() => navigate(ROUTES.auth.register.path)}
          >
            注册
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}