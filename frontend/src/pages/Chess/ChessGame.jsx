import { Avatar, Flex, Image, NavLink, Text, Title } from '@mantine/core'
import React from 'react'
import ChessBoard from '../Play/ChessBoard'

const ChessGame = () => {
    return (
        <Flex gap="xl" justify='center' align='center' wrap='nowrap' direction='row'>
            <Flex gap="xs" justify='center' align='start' wrap='nowrap' direction='column' >
                <NavLink
                    p="2px"
                    label={"username"}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
                <ChessBoard />
                <NavLink
                    p="2px"
                    label={"username"}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
            </Flex>
            <Flex w="450px" bg='gray' h="600px" sx={{ borderRadius: '10px' }}>
                <Title>Game Data</Title>
            </Flex>
        </Flex>
    )
}

export default ChessGame