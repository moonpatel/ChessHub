import { Avatar, Button, Flex, Image, Loader, MediaQuery, NavLink, Text, Title } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import ChessBoard from '../Chess/ChessBoard'
import { useNavigate, useParams } from 'react-router-dom'
import { socket } from '../../socket'
import { getUserData } from '../../../utils/auth'
import { ChessGameContext } from '../../context/chess-game-context'
import GameHistory from '../../components/GameHistory'

const ChessGame = () => {
    const { gameHistory,setGameHistory } = useContext(ChessGameContext);
    const user = getUserData();
    let username = user.username;
    let color = localStorage.getItem('myColor')
    const [hasJoinedRoom, setHasJoinedRoom] = useState(localStorage.getItem('socketid'));
    const [isWaiting, setIsWaiting] = useState(true);
    const roomID = localStorage.getItem('roomID')
    const navigate = useNavigate();
    const opponent = localStorage.getItem('opponent');

    const exitGame = () => {
        localStorage.removeItem('socketid');
        localStorage.removeItem('roomID');
        localStorage.removeItem('opponent');
        localStorage.removeItem('myColor');
        localStorage.removeItem('timeLimit');
        socket.disconnect();
        navigate('/play/friend');
    }

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected');
        });

        socket.on('join-room-success', (fetchedGameHistory) => {
            console.log('Room joined:', roomID);
            setGameHistory(fetchedGameHistory);
            setHasJoinedRoom(true);
        });

        socket.on('room-full', () => {
            console.log('Room is full');
        })

        socket.on("join-room-error", (err) => {
            console.error("Error:", err);
        })

        console.log('JOINING ROOM')
        socket.emit("join-room", roomID, { username, color })

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected due to', reason);
        })

        socket.on('opponent-move', (data) => {
            console.log(data)
        })

    }, []);

    if (!hasJoinedRoom) return (
        <Loader variant='bars' />
    )

    return (
        <Flex gap="xl" miw={360} justify='center' align='center' wrap='nowrap' mt={{ base: '50px', sm: '0px' }} direction={{ base: 'column', lg: 'row' }}>
            <Flex gap="xs" justify='center' align='start' wrap='nowrap' direction='column' >
                <NavLink
                    p="2px"
                    label={opponent}
                    icon={<Avatar radius="3px" children={opponent[0].toUpperCase()} />}
                    description={"description"}
                />
                <ChessBoard />
                <NavLink
                    p="2px"
                    label={username}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
            </Flex>
            <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                <Flex maw={450} sx={{
                    width: '100%',
                    height: '600px',
                    textAlign: 'center',
                    borderRadius: '10px'
                }} bg='gray' p="10px" justify='start' align='center' direction='column' h="600px">
                    <Title>Game Data</Title>
                    <Flex direction='column'>
                        <GameHistory />
                    </Flex>
                    <Flex>
                        <Button onClick={exitGame} color='red'>Exit Game</Button>
                    </Flex>
                </Flex>
            </MediaQuery>
        </Flex>
    )
}

export default ChessGame