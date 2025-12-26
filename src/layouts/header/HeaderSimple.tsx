import {Burger, Container, Group, Text} from '@mantine/core';
import { Logo } from '@/components/common/Logo.tsx';
import classes from './HeaderSimple.module.css';
import {useState} from "react";

const links = [
  { link: '/about', label: 'Features' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/learn', label: 'Learn' },
  { link: '/community', label: 'Community' },
];

export function HeaderSimple({
  mobileOpened,
  toggleMobile,
}: {
  mobileOpened: boolean;
  toggleMobile: () => void;
}) {
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}>
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Group justify="flex-start">
          <Logo height={28} />
        <Text>Ragflow Gateway</Text>
        </Group>

        <Group gap={8} visibleFrom="xs">
          {/* 菜单链接 */}
          {items}
        </Group>

        {/* 仅移动端显示 */}
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
        />
      </Container>
    </header>
  );
}