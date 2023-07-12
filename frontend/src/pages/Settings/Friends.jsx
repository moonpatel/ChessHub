import { Button, Card, Flex, List, Stack, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import React from 'react'

const Friends = () => {
    return (
        <Card sx={{ backgroundColor: '#272623', textAlign: 'left' }} p='30px'>
            <Title>Friends</Title>
            <Flex direction='row' gap='lg' my='20px'>
                <TextInput w='300px' sx={{ backgroundColor: '#272623' }} placeholder='Search username' icon={<IconSearch />} />
                <Button color='gray'>Add friend</Button>
            </Flex>
            <Stack>
                {
                    friends.map(({ username }) => {
                        return (
                            <Flex ff='monospace'>
                                {username}
                            </Flex>
                        )
                    })
                }
            </Stack>
        </Card>
    )
}

const friends = [
    { username: 'moonpatel' },
    { username: 'user2' },
    { username: 'user3' }
]

export default Friends