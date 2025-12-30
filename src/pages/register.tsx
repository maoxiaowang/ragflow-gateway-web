import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Anchor,
  Button,
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
import classes from './Login.module.css'; // 可以共用样式

import type {PasswordRules, RegisterParams} from '@/auth/types';
import {AuthService} from "@/auth/service.ts";

const DEFAULT_RULES: PasswordRules = {
  min_length: 6,
  uppercase: false,
  lowercase: false,
  digits: false,
  symbols: false,
};


export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<PasswordRules | null>(DEFAULT_RULES);
  const [rulesLoaded, setRulesLoaded] = useState(false);

  const {register} = useAuth();
  const notify = useNotification();

  useEffect(() => {
    let mounted = true;
    setRulesLoaded(false);
    AuthService.getPasswordRules().then((res) => {
      if (!mounted) return;
      if (res?.code === 0 && res.data) {
        setRules(res.data);
      } else {
        setRules(DEFAULT_RULES);
      }
      setRulesLoaded(true);
    });
    return () => {
      mounted = false;
    };

  }, []);

  const form = useForm({
    initialValues: {
      username: '',
      password1: '',
      password2: '',
      invite_code: '',
    },
    validate: {
      username: (v) =>
        v.length < 3 ? '用户名至少3个字符' : null,

      password1: (value) => {
        const errors: string[] = [];
        if (rules) {
          if (value.length < rules.min_length) {errors.push(`至少 ${rules.min_length} 个字符`);}
          if (rules.uppercase && !/[A-Z]/.test(value)) {errors.push('至少包含一个大写字母');}
          if (rules.lowercase && !/[a-z]/.test(value)) {errors.push('至少包含一个小写字母');}
          if (rules.digits && !/[0-9]/.test(value)) {errors.push('至少包含一个数字');}
          if (rules.symbols && !/[!@#$%^&*]/.test(value)) {errors.push('至少包含一个符号');}
          return errors.length ? errors.join('，') : null;
        }
        return null;
      },
      password2: (value, values) =>
        value !== values.password1 ? '两次密码不一致' : null,
      invite_code: (v) =>
        v.length < 8 ? '邀请码至少8个字符' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const payload: RegisterParams = {
      username: values.username,
      password1: values.password1,
      password2: values.password2,
      invite_code: values.invite_code,
    };

    try {
      // 明确丢弃 password2（仅前端校验）
      await register(payload);

      notify.success('注册成功', '请使用新账号登录');
      navigate(ROUTES.auth.login.path);
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        notify.error('注册失败', err.message);
      } else {
        notify.error('注册失败', '未知错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} withBorder shadow="md" radius="md" p="xl">
        <Center mb="xl">
          <Title order={2} className={classes.title}>
            <Text
              fw={900}
              size="xl"
              variant="gradient"
              gradient={{from: 'blue', to: 'cyan', deg: 90}}
              inherit
            >
              加入 RagFlow Gateway
            </Text>
          </Title>
        </Center>

        <form onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInput
            label="用户名"
            placeholder="请输入用户名"
            size="md"
            radius="md"
            required
            {...form.getInputProps('username')}
          />

          <PasswordInput
            label="密码"
            placeholder="请输入密码"
            size="md"
            radius="md"
            mt="md"
            required
            minLength={6}
            {...form.getInputProps('password1')}
          />

          <PasswordInput
            label="确认密码"
            placeholder="请再次输入密码"
            size="md"
            radius="md"
            mt="md"
            required
            {...form.getInputProps('password2')}
          />

          <TextInput
            label="邀请码"
            placeholder="请输入邀请码"
            size="md"
            radius="md"
            mt="md"
            required
            {...form.getInputProps('invite_code')}
          />

          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            loading={loading}
            disabled={!rulesLoaded}
          >
            注册
          </Button>
        </form>

        <Text ta="center" mt="md">
          已有账号?{' '}
          <Anchor href="#" fw={500} onClick={(e) => {
            e.preventDefault();
            navigate(ROUTES.auth.login.path);
          }}>
            登录
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}