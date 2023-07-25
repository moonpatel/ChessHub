import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { Button, Group, Stack, Text, Title } from '@mantine/core';

const Challenges = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (error) return;
        const fetchData = async () => {
            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/challenges`;
            try {
                const response = await fetch(url, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setChallenges(data);
                } else {
                    setError('Cannot fetch challenges')
                }
            } catch (error) {
                console.log(error);
                setError("Something went wrong")
            }
        }

        fetchData();
    }, [error])

    if (!challenges || challenges.length === 0) {
        return (
            <React.Fragment>
                <Title mt="20px" mb="10px" order={3}>Challenges</Title>
                <Text>No challenges found</Text>
            </React.Fragment>
        )
    }

    if (error) {
        return (
            <>
                <Title mt="20px" mb="10px" order={3}>Challenges</Title>
                <Text>{error}</Text><Text onClick={() => setError(null)} fw={800} sx={{ cursor: 'pointer' }}>Retry</Text>
            </>
        )
    }



    return (
        <div>
            <Title mt="20px" mb="10px" order={3}>Challenges</Title>
            <Stack>
                {
                    challenges.map(({ id, challenger, roomID, color, timeLimit }, index) => {
                        console.log(challenger, roomID, color, timeLimit);
                        return (
                            <Group position='apart' key={id}>
                                <Text>Challenge by {challenger}</Text>
                                <Group position='center'>
                                    <Button color='lime' onClick={async () => {
                                        try {
                                            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/challenges/${id}`
                                            const response = await fetch(url, { method: 'DELETE', credentials: 'include' });
                                            console.log(id, challenger);
                                            const resData = await response.json();
                                            if (response.ok) {
                                                localStorage.setItem('myColor', color === 'b' ? 'w' : 'b');
                                                localStorage.setItem('roomID', roomID);
                                                localStorage.setItem('opponent', challenger);
                                                localStorage.setItem('timeLimit', timeLimit);
                                                navigate(`/game/friend/${roomID}`);
                                            } else {
                                                console.log(resData)
                                            }
                                        } catch (err) {
                                            setError("Something went wrong");
                                            console.log(err);
                                        }
                                    }}>Accept</Button>
                                    <Button color='gray' onClick={async () => {
                                        try {
                                            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/challenges/${id}`
                                            const response = await fetch(url, { method: 'DELETE', credentials: 'include' });
                                            console.log(id, challenger);
                                            if (response.ok) {
                                                challenges.splice(index, 1);
                                                setChallenges(challenges);
                                            } else {
                                                const resData = await response.json();
                                                console.log(resData)
                                            }
                                        } catch (err) {
                                            setError("Something went wrong");
                                            console.log(err);
                                        }
                                    }}>Decline</Button>
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