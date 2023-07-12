import React from 'react'
import { Avatar, Card, Container, Flex, Grid, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core'
import { getUserData } from '../../../utils/auth'

const Profile = () => {
    let { username } = getUserData()
    return (
        <Stack>
            <Flex gap="md" sx={{ display: 'flex', backgroundColor: '#272623', borderRadius: '5px' }} bg='gray' w="100%" p="30px">
                <Avatar size={180} color='lime' variant='gradient' gradient={{ from: 'blue', to: 'green', deg: 100 }}>
                    <Text sx={{ fontSize: '120px' }}>
                        {username[0].toUpperCase()}
                    </Text>
                </Avatar>
                <div>
                    <Title>{username}</Title>
                    <Group position='left'>
                        <Text>{'-------'}</Text>
                        <Text>city</Text>
                    </Group>
                </div>
            </Flex>
            <Flex gap="md" sx={{ display: 'flex', backgroundColor: '#272623', borderRadius: '5px', textAlign: 'left' }} bg='gray' w="100%" p="30px">
                <Grid w='100%' gutter={30} columns={12}>
                    <Grid.Col span={6}>
                        <TextInput label='Username' />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput label='Email address' />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput label='First Name' />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput label='Last Name' />
                    </Grid.Col>
                </Grid>
            </Flex>
        </Stack>
    )
}

export default Profile