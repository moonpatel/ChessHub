import { Avatar, Flex, Image, MediaQuery, NavLink } from '@mantine/core'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { getUserData } from '../../utils/auth';

const Layout = () => {
    const user = getUserData();
    let username = user.username;
    return (
        <Flex gap="xl" miw={360} justify='center' align='center' wrap='nowrap' mt={{ base: '50px', sm: '0px' }} direction={{ base: 'column', lg: 'row' }}>
            <Flex gap="xs" justify='center' align='start' wrap='nowrap' direction='column' >
                <NavLink
                    p="2px"
                    label={"opponent"}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Image width={600} miw={480} src="/src/assets/images/chess_board.png" />
                </MediaQuery>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Image width="100%" maw={540} src="/src/assets/images/chess_board.png" />
                </MediaQuery>
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