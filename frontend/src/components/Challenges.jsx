import { Button, Group, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
    const navigate = useNavigate();
    const dummyChallenges = [
        { challenger: 'moonpatel', roomID: 'sgnkjsdbnojsnvjsdnkl' },
        { challenger: 'user1', roomID: 'sgnkjsdbnojsnvjsdnkl' }
    ]
    const [challenges, setChallenges] = useState(dummyChallenges);

    useEffect(() => {
        const abortController = new AbortController();
        let response = null;

        const fetchData = async () => {
            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/challenges`;
            try {
                response = await fetch(url, { signal: abortController.signal })
                const data = await response.json();
                if (data.success) {
                    setChallenges(data.challenges);
                } else {
                    throw data.error;
                }
            } catch (error) {
                if (error.message === 'The user aborted a request.');
                else {
                    console.log('Error fetching data');
                    throw error;
                }
            }
        }
    })

    if (!challenges || challenges.length === 0) {
        return (
            <>
                <Title mt="20px" mb="10px" order={3}>Challenges</Title>
                <Text>No challenges found</Text>
            </>
        )
    }

    return (
        <div>
            <Title mt="20px" mb="10px" order={3}>Challenges</Title>
            <Stack>
                {
                    challenges.map(({ challenger, roomID }) => {
                        return (
                            <Group position='apart'>
                                <Text>Challenge by {challenger}</Text>
                                <Group position='center'>
                                    <Button color='lime' onClick={() => navigate(`/game/friend/${roomID}`)}>Accept</Button>
                                    <Button color='gray'>Decline</Button>
                                </Group>
                            </Group>
                        )
                    })
                }
            </Stack>
        </div>
    )
}



export default Challenges