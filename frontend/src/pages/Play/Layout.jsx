import React from 'react'

import { Outlet } from 'react-router-dom'
import { Avatar, Flex, Image, MediaQuery, NavLink } from '@mantine/core'

import { getUserData } from '../../utils/auth';

const Layout = () => {
    const user = getUserData();
    let username = user.username;
    return (
        <Flex h='100vh' justify='center' align='center' wrap='nowrap' mt={{ base: '50px', sm: '0px' }} direction={{ base: 'column', lg: 'row' }}>
            <Flex gap="xs" h={'95vh'} justify='center' align='start' wrap='nowrap' direction='column' >
                <NavLink
                    p="2px"
                    label={"opponent"}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <img draggable={false} height={'100%'} style={{aspectRatio:'1'}} miw={480} src="/assets/images/chess_board.png" />
                </MediaQuery>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <img draggable={false} width="100%" maw={540} src="/assets/images/chess_board.png" />
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