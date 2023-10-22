import React from 'react'

import { Form, redirect, useActionData, useParams } from 'react-router-dom'
import { Avatar, Button, Card, Flex, Select, Text, Title } from '@mantine/core'

import { getUserData } from '../../utils/auth'

const ChallengeFriend = () => {
    const params = useParams();
    let friend_username = params["friend_username"];
    const res = useActionData();
    console.log(res);

    return (
        <Card
            sx={{
                width: '600px',
                height: '80%',
                textAlign: 'center',
                backgroundColor: '#262523'
            }}
            px='20px'
        >
            <Form action={`/play/friend/${friend_username}`} method='POST'>
                <Flex align="center" direction="column" justify="center" gap="xs" my="lg">
                    <Title order={2}>Play vs {friend_username}</Title>
                    <Avatar mt="lg" color='lime' size="100px">{friend_username[0].toUpperCase()}</Avatar>
                    <Text>{friend_username}</Text>
                </Flex>
                <Select label="Time limit" placeholder='Time limit' name='timeLimit' defaultValue='10' data={['5', '10', '15', '30']} />
                <Select defaultValue='w' my="20px" color='lime' name='color' label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                    { value: 'w', label: 'White' },
                    { value: 'b', label: 'Black' },
                    { value: 'RANDOM', label: 'Random' }
                ]} />
                <Button color='lime' type='submit' >Challenge</Button>
                <Text style={{ color: 'red' }}>
                    {res?.message}
                </Text>
            </Form>
        </Card>
    )
}


// TESTED
export const playFriendAction = async ({ request, params }) => {
    const formData = await request.formData();
    let color = formData.get('color');
    let timeLimit = formData.get('timeLimit');
    let username = getUserData().username;
    let challenged = params.friend_username;

    let roomIDURL = `${import.meta.env.VITE_BACKEND_HOST}/api/room`;
    let reqBody = { challenger: username, challenged, timeLimit, color }

    try {
        const response = await fetch(roomIDURL, {
            method: 'POST', body: JSON.stringify(reqBody), headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        console.log(response.status);
        if (response.ok) {

            const resJSON = await response.json();
            const { roomID } = resJSON;
            console.log('Room ID:', roomID);

            // set properties of the game
            localStorage.setItem('roomID', roomID);
            localStorage.setItem('myColor', color);
            localStorage.setItem('timeLimit', timeLimit);
            localStorage.setItem('opponent', challenged);

            return redirect(`/game/friend/${roomID}`);
        } else {
            return response;
        }
    } catch (err) {
        console.log(err)
        return err;
    }
}

export default ChallengeFriend;