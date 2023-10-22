import { useDisclosure } from '@mantine/hooks';
import React, { useContext, useEffect } from 'react'
import { ChessGameContext } from '../../context/chess-game-context';
import { socketBot as socket } from '../../socket';
import { getUserData } from '../../utils/auth';
import { Avatar, Button, Flex, MediaQuery, Modal, NavLink, Text, Title } from '@mantine/core';
import ChessBoard from '../Chess/ChessBoard';
import GameHistory from '../../components/GameHistory';
import { useNavigate } from 'react-router-dom';
import { SOCKET_EVENTS } from '../../constants';
const { CHESS_MOVE, GAME_END } = SOCKET_EVENTS

const ChessGameComputer = () => {
    const { hasGameEnded, gameEndedReason, handleOpponentMove } = useContext(ChessGameContext);
    const [gameEndedModalOpen, modalFunctions] = useDisclosure(true);
    const navigate = useNavigate();
    const user = getUserData();
    let username = user.username;
    let color = localStorage.getItem('myColor') || 'w';
    const roomID = localStorage.getItem('roomID');


    useEffect(() => {
        socket.connect();
        socket.emit('INIT', {color});

        // socket.onAny(evt => {
        //     console.log("event", evt);
        // })

        socket.on("CHESS_BOT_MOVE", (data) => {
            handleOpponentMove(data, () => {
                socket.emit(GAME_END, roomID);
            })
        });

        return () => {
            socket.offAny();
            socket.disconnect();
        }
    }, []);

    const exitGame = () => {
        console.log("Ending game");
        socket.disconnect();
        localStorage.removeItem('myColor');
        navigate("/play/computer");
    }

    const pieceDropCallback = (moveData) => {
        socket.emit(CHESS_MOVE, roomID, moveData);
    }
    const pieceClickCallback = (moveData) => {
        // moveData contains fen string, from, to squares of the move
        socket.emit(CHESS_MOVE, roomID, moveData);
    }

    // const resign = () => {
    //     socket.emit(USER_RESIGNED);
    //     endGame('RESIGN');
    //     exitGame();
    // }


    return (
        <React.Fragment>
            <Modal onClose={modalFunctions.close} opened={hasGameEnded && gameEndedModalOpen} centered>
                <Text>Game ended due to {gameEndedReason}</Text>
                <Button color='lime' onClick={exitGame}>Go back</Button>
                <Button mx='md' color='lime' onClick={modalFunctions.close}>OK</Button>
            </Modal>
            <Flex gap="xl" miw={360} justify='center' align='center' wrap='nowrap' mt={{ base: '50px', sm: '0px' }} direction={{ base: 'column', lg: 'row' }}>
                <Flex gap="xs" justify='center' h='100vh' align='start' wrap='nowrap' direction='column' >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink
                            style={{ width: "500px" }}
                            p="2px"
                            // label={isWaiting ? "Waiting for opponent..." : opponent}
                            // icon={<Avatar radius="3px" style={{ minWidth: "4.374rem" }} >
                            //     Computer
                            // </Avatar>}
                            icon = { <img src="https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg" alt="computer-icon" style={{height:"38px" , width:"38px" ,borderRadius:"3px"}} /> }

                            description={"description"}
                        />
                    </div>
                    {
                        // TODO: handle isWaiting state
                        // false ?
                        //     <>
                        //         <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                        //             <Image width={600} miw={480} src="/src/assets/images/chess_board.png" />
                        //         </MediaQuery>
                        //         <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        //             <Image width="100%" maw={540} src="/src/assets/images/chess_board.png" />
                        //         </MediaQuery>
                        //     </>
                        //     :
                            <ChessBoard callbacks={{ pieceDropCallback, pieceClickCallback }} />
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink
                            style={{ width: "500px" }}
                            p="2px"
                            label={username}
                            icon={<Avatar radius="3px" >
                                {username?.at(0).toUpperCase()}
                            </Avatar>}
                            description={"description"}
                        />
                    </div>
                </Flex>
                <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                    <Flex maw={600} sx={{
                        width: '100%',
                        height: '840px',
                        textAlign: 'center',
                        borderRadius: '10px',
                        backgroundColor: '#272623'
                    }} bg='gray' justify='start' py='md' align='center' direction='column' h="600px">
                        <Title my='20px'>Game Data</Title>
                        <Flex direction='column' w='100%'>
                            <GameHistory />
                        </Flex>
                        <Flex>
                            <Button onClick={exitGame} color='red'>Exit </Button>
                        </Flex>
                    </Flex>
                </MediaQuery>
            </Flex>
        </React.Fragment>
    )
}

export default ChessGameComputer