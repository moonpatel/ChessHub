import { Avatar, Button, Flex, Group, Image, Loader, MediaQuery, Modal, NavLink, Text, Title } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import ChessBoard from '../Chess/ChessBoard'
import { useNavigate, useParams } from 'react-router-dom'
import { socket } from '../../socket'
import { getUserData } from '../../../utils/auth'
import { ChessGameContext } from '../../context/chess-game-context'
import GameHistory from '../../components/GameHistory'
import Timer from './Timer'
import { useDisclosure } from '@mantine/hooks'
import { SOCKET_EVENTS } from '../../constants'
const { CONNECT, DISCONNECT, CHESS_MOVE, CHESS_OPPONENT_MOVE, CONNECTION, JOIN_ROOM, JOIN_ROOM_ERROR, JOIN_ROOM_SUCCESS, ROOM_FULL, USER_JOINED_ROOM } = SOCKET_EVENTS;

const ChessGame = () => {
    const { setGameHistory, isTimerOn, setIsTimerOn, hasGameEnded, gameEndedReason } = useContext(ChessGameContext);
    const [gameEndedModalOpen, modalFunctions] = useDisclosure(true);

    const user = getUserData();
    let username = user.username;
    let color = localStorage.getItem('myColor')
    const [hasJoinedRoom, setHasJoinedRoom] = useState(localStorage.getItem('socketid'));
    const [isWaiting, setIsWaiting] = useState(true);
    const roomID = localStorage.getItem('roomID');
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
        socket.on(CONNECT, () => {
            console.log('Connected');
        });

        socket.on(JOIN_ROOM_SUCCESS, (fetchedGameHistory) => {
            console.log('Room joined:', roomID);
            setGameHistory(fetchedGameHistory);
            setHasJoinedRoom(true);
        });

        socket.on(ROOM_FULL, () => {
            console.log('Room is full');
        })

        socket.on(JOIN_ROOM_ERROR, (err) => {
            console.error("Error:", err);
        })

        console.log('JOINING ROOM')
        socket.emit(JOIN_ROOM, roomID, { username, color })

        socket.on(DISCONNECT, (reason) => {
            console.log('Socket disconnected due to', reason);
        });

        socket.on(CHESS_OPPONENT_MOVE, (data) => {
            console.log(data);
            // setIsTimerOn(true);
        })

        socket.on(USER_JOINED_ROOM, () => {
            setIsWaiting(false);
        });

    }, []);

    if (!hasJoinedRoom) return (
        <Loader variant='bars' />
    )

    return (
        <>
            <Modal onClose={modalFunctions.close} opened={hasGameEnded && gameEndedModalOpen} centered>
                <Text>Game ended due to {gameEndedReason}</Text>
                <Button color='lime' onClick={exitGame}>Go back</Button>
                <Button mx='md' color='lime' onClick={modalFunctions.close}>OK</Button>
            </Modal>
            <Flex gap="xl" miw={360} justify='center' align='center' wrap='nowrap' mt={{ base: '50px', sm: '0px' }} direction={{ base: 'column', lg: 'row' }}>
                <Flex gap="xs" justify='center' align='start' wrap='nowrap' direction='column' >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink
                            style={{ width: "500px" }}
                            p="2px"
                            label={isWaiting ? "Waiting for opponent..." : opponent}
                            icon={<Avatar radius="3px" children={opponent[0].toUpperCase()} />}
                            description={"description"}
                        />
                        {/* <Timer on={!isTimerOn} /> */}
                    </div>
                    {
                        // TODO: handle isWaiting state
                        false ?
                            <>
                                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                                    <Image width={600} miw={480} src="/src/assets/chess_board.png" />
                                </MediaQuery>
                                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                    <Image width="100%" maw={540} src="/src/assets/chess_board.png" />
                                </MediaQuery>
                            </>
                            :
                            <ChessBoard />
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink
                            style={{ width: "500px" }}
                            p="2px"
                            label={username}
                            icon={<Avatar radius="3px" children={username[0].toUpperCase()} />}
                            description={"description"}
                        />
                        {/* <Timer on={isTimerOn} /> */}
                    </div>
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
        </>
    )
}

export default ChessGame