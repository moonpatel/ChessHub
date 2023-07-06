import { Button, Group, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getUserData } from '../../utils/auth'

const Challenges = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const { id: userid } = getUserData();
    const [error, setError] = useState(null);


    useEffect(() => {
        const abortController = new AbortController();
        let response = null;

        const fetchData = async () => {
            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/${userid}/challenges`;
            try {
                response = await fetch(url, {
                    signal: abortController.signal, headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                })
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

        fetchData();

        return () => {
            if (!response) {
                abortController.abort();
            }
        }
    }, [])

    const acceptChallengeHandler = async ({ challenger, roomID, color, timeLimit }) => {
        return async () => {
            const res = await deleteChallenge(roomID, 'accept');
            if (res?.success) {
                localStorage.setItem('myColor', color === 'b' ? 'w' : 'b');
                localStorage.setItem('roomID', roomID);
                localStorage.setItem('opponent', challenger);
                localStorage.setItem('timeLimit', timeLimit);
                navigate(`/game/friend/${roomID}`);
            }
        }
    }

    const declineChallengeHandler = async ({ challenger, roomID, color, timeLimit }) => {
        return async () => {
            const res = await deleteChallenge(roomID, 'decline');
        }
    }

    const deleteChallenge = async (challengeID, response) => {
        try {
            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/${userid}/challenges/${challengeID}?response=${response}`
            let response = await fetch(url, {
                method: 'DELETE', headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                }
            })
            const resData = await response.json();
            return resData;
        } catch (err) {
            setError(err)
        }
    }

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
                    challenges.map(({ challenger, roomID, color, timeLimit }) => {
                        console.log(challenger, roomID, color, timeLimit);
                        return (
                            <Group position='apart'>
                                <Text>Challenge by {challenger}</Text>
                                <Group position='center'>
                                    <Button color='lime' onClick={acceptChallengeHandler({ challenger, roomID, color, timeLimit })}>Accept</Button>
                                    <Button color='gray' onClick={declineChallengeHandler({ challenger, roomID, color, timeLimit })}>Decline</Button>
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