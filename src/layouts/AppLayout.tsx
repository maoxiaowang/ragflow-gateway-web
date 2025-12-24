import {Outlet} from 'react-router-dom';
import {AppShell} from '@mantine/core';

import {NavbarSimple} from "@/components/Navbar/NavbarSimple";
import {HeaderSimple} from "@/components/Header/HeaderSimple";
import {useDisclosure} from "@mantine/hooks";


export default function AppLayout() {
  const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
  // const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (

    <AppShell
      padding="md"
      header={{ height: 56 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
    >
    <AppShell.Header>
    <HeaderSimple mobileOpened={mobileOpened} toggleMobile={toggleMobile}/>
    </AppShell.Header>

      <AppShell.Navbar>
     <NavbarSimple/>
    </AppShell.Navbar>

       <AppShell.Main>
    <Outlet/>
    </AppShell.Main>
    </AppShell>
  );

}