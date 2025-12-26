import {Group, Text} from '@mantine/core';
import {Logo} from '@/components/common/Logo.tsx';
import {
  IconDashboard,
  IconDatabaseImport,
  IconLogout, IconMessage, IconMessageChatbot,
  IconSettings,
  IconSwitchHorizontal, IconUsers,
} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '@/auth/useAuth.ts';
import classes from './NavbarSimple.module.css';

const data = [
  {link: '/', label: 'Dashboard', icon: IconDashboard},
  {link: '/datasets', label: 'Datasets', icon: IconDatabaseImport},
  {link: '/chats', label: 'Chats', icon: IconMessage},
  {link: '/agents', label: 'Agent', icon: IconMessageChatbot},
  {link: '/users', label: 'Users', icon: IconUsers},
  {link: '/settings', label: 'Other Settings', icon: IconSettings},
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
          <Text fw={600} size="md">
            Ragflow Gateway
          </Text>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(e) => e.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5}/>
          <span>Change account</span>
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
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}