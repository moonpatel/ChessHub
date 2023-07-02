import React, { useState } from 'react'
import { Button, Card, CopyButton, Flex, Group, Image, Modal, NativeSelect, NavLink, Select, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSearch, IconUserCircle } from '@tabler/icons-react'
import FriendsList from '../../components/FriendsList'
import { Form } from 'react-router-dom'
import Challenges from '../../components/Challenges'

const createChallengeLink = (color) => {
    let challengeLink = Math.floor(Math.random() * 100_000_000).toString();
    if (color === 'RANDOM') {
        challengeLink = challengeLink.concat(Math.random() < 0.5 ? 'W' : 'B');
    } else {
        challengeLink = challengeLink.concat(color);
    }
    return challengeLink;
}

const PlayFriend = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [joinChallengeModalState, modalFunctions] = useDisclosure(false);
    return (
        <>
            <Modal zIndex={10} opened={opened} onClose={close} title={<Text mx="auto" size="xl">Create Challenge Link</Text>} centered>
                <Text>Start a game with anyone</Text>
                <div>
                    <NativeSelect onChange={(evt) => setColor(evt.target.value)} my="20px" label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                        { value: 'W', label: 'White' },
                        { value: 'B', label: 'Black' },
                        { value: 'RANDOM', label: 'Random' }
                    ]} />
                </div>
                {/* TODO: update createChallengeLink function */}
                {/* <CopyButton>
                    {
                        ({ copied, copy }) => <Button disabled onClick={copy} color={copied ? 'gray' : 'lime'}> {copied ? 'Copied' : 'Copy Link'} </Button>
                    }
                </CopyButton> */}
            </Modal>
            <Card
                sx={{
                    width: '450px',
                    height: '600px',
                    textAlign: 'center'
                }}
            >
                <Flex align="center" justify="center" gap="xs" my="lg">
                    <Image width="30px" src="https://www.chess.com/bundles/web/images/color-icons/handshake.fb30f50b.svg" />
                    <Title order={2}>Play a Friend</Title>
                </Flex>
                <TextInput my="5px" placeholder="Search by email or username" icon={<IconSearch />} />
                <FriendsList />
                <Flex direction='column' gap='10px'>
                    <Button color='lime' onClick={open}>Create Challenge Link</Button>
                    <Button color='lime'>Join using Challenge Link</Button>
                </Flex>
                <Challenges />
            </Card>
        </>
    )
}

const friends = [
    { avatar: <IconUserCircle />, username: "friend", rating: 100 },
    { avatar: <IconUserCircle />, username: "friend", rating: 100 },
    { avatar: <IconUserCircle />, username: "friend", rating: 100 },
    { avatar: <IconUserCircle />, username: "friend", rating: 100 },
]

export default PlayFriend