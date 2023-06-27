import { Card, Container, Flex, Group, Image, Stack, Text, Title } from '@mantine/core'
import React from 'react'

const Profile = () => {
    return (
        <Stack>
            <Flex gap="md" sx={{ display: 'flex' }} bg='gray' w="750px" p="30px">
                <Image withPlaceholder width="180px" height="180px" />
                <div>
                    <Title>username</Title>
                    <Group position='left'>
                        <Text>full name</Text>
                        <Text>city</Text>
                    </Group>
                </div>
            </Flex>
            <Flex gap="md" sx={{ display: 'flex' }} bg='gray' w="750px" p="30px">
                <Image withPlaceholder width="180px" height="180px" />
                <div>
                    <Title>username</Title>
                    <Group position='left'>
                        <Text>full name</Text>
                        <Text>city</Text>
                    </Group>
                </div>
            </Flex>
        </Stack>
    )
}

export default Profile