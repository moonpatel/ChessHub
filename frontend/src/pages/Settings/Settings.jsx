import React from 'react'

import { Link, Outlet } from 'react-router-dom';
import { Box, Flex, NavLink, Title } from '@mantine/core'
import { ColorWheelIcon, GearIcon, GlobeIcon, LockOpen1Icon, PersonIcon } from '@radix-ui/react-icons'

const Settings = () => {
    return (
        <Box ml='45px'>
            <Flex align="center" my="lg">
                <GearIcon style={{ scale: '1.8' }} width="45px" />
                <Title order={1} sx={{ flexDirection: 'row' }} >
                    Settings
                </Title>
            </Flex>
            <Flex justify="start" direction="row" gap="xl" w="100%">
                <Flex w="300px" gap="3px" align="center" justify="start" direction="column">
                    {linksList.map((link, index) => <NavLink w="100%" p="10px" key={index} component={Link} sx={{ backgroundColor: '#262523' }} label={link.label} icon={link.icon} to={link.to} />)}
                </Flex>
                <div style={{ width: '720px' }}>
                    <Outlet />
                </div>
            </Flex>
        </Box>
    )
}

const linksList = [
    { label: "Profile", to: "/settings/profile", icon: <PersonIcon /> },
    { label: "Password", to: "/settings/password", icon: <LockOpen1Icon /> },
    { label: "Themes", to: "/settings/themes", icon: <ColorWheelIcon /> },
    { label: "Friends", to: "/settings/friends", icon: <GlobeIcon /> },
]

export default Settings