import { Flex, Loader } from '@mantine/core'
import React, { useEffect } from 'react'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import { socket } from '../socket';

const JoinChallenge = () => {
    const navigate = useNavigate();
    const params = useParams();
    console.log(params)
    const roomID = params['roomID'];
    const opponent = params['challenger']
    const username = JSON.parse(localStorage.getItem('user')).username;

    useEffect(() => {
        if (!localStorage.getItem('roomID')) {
            localStorage.setItem('opponent', opponent);
            localStorage.setItem('roomID', roomID);
            socket.connect();
            socket.on('connect', () => {
                localStorage.setItem('socketid', socket.id);
            })
            socket.emit('join-room', roomID, username);
            socket.on('joined-room', (gameData) => {
                let { color, timeLimit } = gameData;
                console.log('Joined room')
                console.log(gameData);
                localStorage.setItem('my_color', color);
                localStorage.setItem('time_limit', timeLimit);
                navigate(`/game/friend/${roomID}`);
            });
        } else {
            navigate(`/game/friend/${roomID}`);
        }
        return () => {
        }
    }, []);

    return (
        <Flex>
            <Loader variant='bars' />
        </Flex>
    )
}

export default JoinChallenge