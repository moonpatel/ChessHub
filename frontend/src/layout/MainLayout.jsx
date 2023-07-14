import { AppShell, Burger, Container, Header, MediaQuery, Navbar, Paper, Text, createStyles, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'
import NavbarLinks from '../components/NavbarLinks';
import { Outlet } from 'react-router-dom'
import Logout from '../components/Logout';
import UserDataContextProvider from '../context/user-data-context';

const useStyles = createStyles((theme) => ({
    body: {
        width: '100%',
        height: '100%'

    },
    root: {
        width: '100%',
        height: '100vh'

    },
    main: {
        width: '100%',
        height: '100vh'
    }
}))

const MainLayout = () => {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <UserDataContextProvider>
            <Paper>
                <AppShell classNames={{
                    body: classes.body,
                    root: classes.root,
                    main: classes.main
                }}
                    styles={{
                        main: {
                            background: theme.colorScheme === 'dark' ? '#302e2a' : theme.colors.gray[0]
                        },
                        body: {
                            textAlign: 'center'
                        }
                    }}
                    layout='alt'
                    navbar={
                        <Navbar py="md" px="0" hiddenBreakpoint="md" sx={{ backgroundColor: '#262523' }} hidden={!opened} width={{ md: 150 }}>
                            <Navbar.Section>
                                <Text size={30} weight={700}>Chess</Text>
                            </Navbar.Section>
                            <Navbar.Section grow mt="md">
                                <NavbarLinks />
                            </Navbar.Section>
                            <Navbar.Section >
                                <Logout />
                            </Navbar.Section>
                        </Navbar>
                    }
                    header={
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Header zIndex={1000} p="md">
                                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                    <Burger
                                        opened={opened}
                                        onClick={() => setOpened((o) => !o)}
                                        size="sm"
                                        color={theme.colors.gray[6]}
                                        mr="xl"
                                    />

                                    <Text>Application header</Text>
                                </div>
                            </Header>
                        </MediaQuery>
                    }
                >
                    <Container size="100%" px={{ 'md': '10px', 'lg': '30px' }} >
                        <Outlet />
                    </Container>
                </AppShell>
            </Paper>
        </UserDataContextProvider>
    );
}

export default MainLayout