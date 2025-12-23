import {Group, Text} from '@mantine/core';
import {Logo} from '@/components/Common/Logo';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal, IconUsers,
} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '@/auth/useAuth';
import classes from './NavbarSimple.module.css';

const data = [
  {link: '/', label: 'Dashboard', icon: IconBellRinging},
  {link: '/billing', label: 'Billing', icon: IconReceipt2},
  {link: '/security', label: 'Security', icon: IconFingerprint},
  {link: '/ssh', label: 'SSH Keys', icon: IconKey},
  {link: '/databases', label: 'Databases', icon: IconDatabaseImport},
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