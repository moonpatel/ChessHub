import { Avatar, Card, Divider, Flex, Image, NavLink, Text, Title } from '@mantine/core'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { getUserData } from '../../../utils/auth';

const Layout = () => {
    const user = getUserData();
    let username = user.username;
    return (
        <Flex gap="xl" justify='center' align='center' wrap='nowrap' direction='row'>
            <Flex gap="xs" justify='center' align='start' wrap='nowrap' direction='column' >
                <NavLink
                    p="2px"
                    label={"opponent"}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
                <Image width={600} height={600} src="/src/assets/chess_board.png" />
                <NavLink
                    p="2px"
                    label={username}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
            </Flex>
            <Outlet />
        </Flex>
    )
}



export default Layout