import { AppShell, Button, Container, Navbar, Paper, Text, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'
import NavbarLinks from '../components/NavbarLinks';
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <Paper>
            <AppShell
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
                    },
                    body: {
                        textAlign: 'center'
                    }
                }}
                navbarOffsetBreakpoint="sm"
                navbar={
                    <Navbar py="md" px="0" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 30, lg: 180 }}>
                        <Navbar.Section>
                            <Text size={30} weight={700}>Chess</Text>
                        </Navbar.Section>
                        <Navbar.Section grow mt="md">
                            <NavbarLinks />
                        </Navbar.Section>
                        <Navbar.Section>
                            <Button color='red' size='md' px='xl'>Logout</Button>
                        </Navbar.Section>
                    </Navbar>
                }
            >
                <Container size="100%" px="100px" >
                    <Outlet />
                </Container>
            </AppShell>
        </Paper>
    );
}

export default MainLayout