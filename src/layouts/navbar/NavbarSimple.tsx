import {Group, Text} from '@mantine/core';
import {Logo} from '@/components/common/Logo.tsx';
import {
  IconDashboard,
  IconDatabaseImport,
  IconLogout, IconMessage, IconMessageChatbot,
  IconSwitchHorizontal, IconUsers,
} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '@/auth/useAuth.ts';
import classes from './NavbarSimple.module.css';

const data = [
  {link: '/', label: '首页', icon: IconDashboard},
  {link: '/datasets', label: '知识库', icon: IconDatabaseImport},
  {link: '/chats', label: 'Chats', icon: IconMessage},
  {link: '/agents', label: '智能体', icon: IconMessageChatbot},
  {link: '/users', label: '用户', icon: IconUsers},
];

export function NavbarSimple() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {logout} = useAuth();

  const links = data.map((item) => (
    <Link
      key={item.label}
      to={item.link}
      className={classes.link}
      data-active={pathname === item.link || undefined}
    >
      <item.icon className={classes.linkIcon} stroke={1.5}/>
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header}>
          <Logo height={32}/>
          <Text variant="gradient"
                gradient={{from: 'blue', to: 'cyan', deg: 90}}
                fw={600}
                size="md"
          >
            Ragflow Gateway
          </Text>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(e) => e.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5}/>
          <span>切换账号</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(e) => {
            e.preventDefault();
            logout();
            navigate('/login');
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5}/>
          <span>登出</span>
        </a>
      </div>
    </nav>
  );
}