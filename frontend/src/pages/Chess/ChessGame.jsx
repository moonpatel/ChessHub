import React, { useContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Avatar, Button, Flex, Image, MediaQuery, Modal, NavLink, Text, Title } from '@mantine/core'

import { socket, socketBot } from '../../socket'
import { getUserData } from '../../utils/auth'
import { ChessGameContext } from '../../context/chess-game-context'
import ChessBoard from '../Chess/ChessBoard'
import GameHistory from '../../components/GameHistory'
import MainLoader from '../../components/MainLoader'
import { SOCKET_EVENTS } from '../../constants'
import Timer from './Timer'
const { CONNECT, DISCONNECT, CHESS_OPPONENT_MOVE, USER_RESIGNED, JOIN_ROOM, JOIN_ROOM_ERROR, JOIN_ROOM_SUCCESS, ROOM_FULL, USER_JOINED_ROOM } = SOCKET_EVENTS;

const ChessGame = () => {
    const { setGameHistory, hasGameEnded, gameEndedReason, endGame, handleOpponentMove, isTimerOn } = useContext(ChessGameContext);
    const [gameEndedModalOpen, modalFunctions] = useDisclosure(true);

    const user = getUserData();
    let username = user.username;
    let userid = user.id;
    let color = localStorage.getItem('myColor');
    const [hasJoinedRoom, setHasJoinedRoom] = useState(localStorage.getItem('socketid'));
    const [isWaiting, setIsWaiting] = useState(true);
    const roomID = localStorage.getItem('roomID');
    const navigate = useNavigate();
    const opponent = localStorage.getItem('opponent');

    const exitGame = () => {
        // cleanup game related data
        localStorage.removeItem('socketid');
        localStorage.removeItem('roomID');
        localStorage.removeItem('opponent');
        localStorage.removeItem('myColor');
        localStorage.removeItem('timeLimit');
        socket.disconnect();
        navigate('/play/friend');
    }

    const resign = () => {
        socket.emit(USER_RESIGNED, roomID, username);
        endGame('RESIGN');
        exitGame();
    }
    const pieceDropCallback = (moveData) => {
        socket.emit(CHESS_MOVE, roomID, moveData);
    }

    const pieceClickCallback = (moveData) => {
        // moveData contains fen string, from, to squares of the move
        socket.emit(CHESS_MOVE, roomID, moveData);
    }

    useEffect(() => {
        socket.connect();
        socket.on(CONNECT, () => {
            console.log('Connected');
        });

        socket.on(JOIN_ROOM_SUCCESS, (fetchedGameHistory) => {
            setGameHistory(fetchedGameHistory);
            setHasJoinedRoom(true);
        });

        socket.on(ROOM_FULL, () => {
            console.log('Room is full');
        })

        socket.on(JOIN_ROOM_ERROR, (err) => {
            console.error("Error:", err);
        })

        socket.emit(JOIN_ROOM, roomID, { username, color, userid })

        socket.on(DISCONNECT, (reason) => {
            console.log('Socket disconnected due to', reason);
        });

        socket.on(CHESS_OPPONENT_MOVE, (data) => {
            handleOpponentMove(data, () => {
                socket.emit(GAME_END, roomID);
            })
        })

        socket.on(USER_JOINED_ROOM, () => {
            setIsWaiting(false);
        });

        socket.on(USER_RESIGNED, () => {
            endGame('RESIGN');
        });

        return () => {
            socket.offAny();
            socket.disconnect();
        }
    }, []);

    if (!hasJoinedRoom) return (
        <MainLoader />
    )

    return (
        <React.Fragment>
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
                            icon={<Avatar radius="3px" >
                                {opponent?.at(0)?.toUpperCase}
                            </Avatar>}
                            description={"description"}
                        />
                        <Timer on={!isTimerOn} />
                    </div>
                    {
                        // TODO: handle isWaiting state
                        false ?
                            <>
                                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                                    <Image width={600} miw={480} src="/assets/images/chess_board.png" />
                                </MediaQuery>
                                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                    <Image width="100%" maw={540} src="/assets/images/chess_board.png" />
                                </MediaQuery>
                            </>
                            :
                            <ChessBoard callbacks={{ pieceDropCallback, pieceClickCallback }} />
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink
                            style={{ width: "500px" }}
                            p="2px"
                            label={username}
                            icon={<Avatar radius="3px" >
                                {username[0].toUpperCase()}
                            </Avatar>}
                            description={"description"}
                        />
                        <Timer on={isTimerOn} />
                    </div>
                </Flex>
                <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                    <Flex maw={450} sx={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        borderRadius: '10px',
                        backgroundColor: '#272623'
                    }} bg='gray' justify='start' py='md' align='center' direction='column' h="600px">
                        <Title my='20px'>Game Data</Title>
                        <Flex direction='column' w='100%'>
                            <GameHistory />
                        </Flex>
                        <Flex>
                            <Button onClick={resign} color='red'>Exit Game</Button>
                        </Flex>
                    </Flex>
                </MediaQuery>
            </Flex>
        </React.Fragment>
    )
}

export default ChessGame