import { Avatar, Button, Card, Flex, Image, Select, Text, TextInput, Title } from '@mantine/core'
import React from 'react'
import FriendsList from '../../components/FriendsList'
import { IconSearch } from '@tabler/icons-react'
import { Form, Link, redirect, useParams, useSearchParams } from 'react-router-dom'
import { socket } from '../../socket'

const ChallengeFriend = () => {
    const params = useParams();
    let friend_username = params["friend_username"];

    return (
        <Card
            sx={{
                width: '450px',
                height: '600px',
                textAlign: 'center'
            }}
        >
            <Form action={`/play/friend/${friend_username}`} method='POST'>
                <Flex align="center" direction="column" justify="center" gap="xs" my="lg">
                    <Title order={2}>Play vs {friend_username}</Title>
                    <Avatar mt="lg" color='lime' size="100px">{friend_username[0].toUpperCase()}</Avatar>
                    <Text>{friend_username}</Text>
                </Flex>
                <Select label="Time limit" placeholder='Time limit' name='time_limit' defaultValue='10' data={['5', '10', '15', '30']} />
                <Select defaultValue='w' my="20px" color='lime' name='color' label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                    { value: 'w', label: 'White' },
                    { value: 'b', label: 'Black' },
                    { value: 'RANDOM', label: 'Random' }
                ]} />
                <Button color='lime' type='submit' >Challenge</Button>
            </Form>
        </Card>
    )
}

export const playFriendAction = async ({ request, params }) => {
    const data = await request.formData();
    let color = data.get('color');
    let timeLimit = data.get('time_limit');
    console.log(params);
    let roomID = Math.floor(Math.random() * 1_000_000_000).toString();
    localStorage.setItem('roomID', roomID);
    localStorage.setItem('opponent', params.friend_username);
    localStorage.setItem('my_color', color);
    localStorage.setItem('time_limit', timeLimit);
    return redirect(`/game/friend/${roomID}`);
}

export default ChallengeFriend;