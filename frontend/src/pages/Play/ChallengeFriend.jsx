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
            <Flex align="center" direction="column" justify="center" gap="xs" my="lg">
                <Title order={2}>Play vs {friend_username}</Title>
                <Avatar mt="lg" color='lime' size="100px">{friend_username[0].toUpperCase()}</Avatar>
                <Text>{friend_username}</Text>
            </Flex>
            <Select label="Time limit" placeholder='Time limit' value='10' data={['5', '10', '15', '30']} />
            <Select value='W' onChange={(evt) => setColor(evt.target.value)} my="20px" label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                { value: 'W', label: 'White' },
                { value: 'B', label: 'Black' },
                { value: 'RANDOM', label: 'Random' }
            ]} />
            <Form action={`/play/friend/${friend_username}`} method='POST'>
                <Button color='lime' type='submit' >Challenge</Button>
            </Form>
        </Card>
    )
}

export const playFriendAction = ({ request, params }) => {
    let roomID = Math.floor(Math.random() * 1_000_000_000).toString();
    // const req = new URL(request);
    socket.connect();
    socket.emit('join-room', roomID, 'user1', params.friend_username);

    // socket.on('pending-challenge', () => {
    // })
    return redirect(`/game/friend/${roomID}`);
}

export default ChallengeFriend;