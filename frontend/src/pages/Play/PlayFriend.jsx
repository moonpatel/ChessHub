import React, { useState } from 'react'
import { Button, Card, CopyButton, Flex, Group, Image, Modal, NativeSelect, NavLink, Select, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { PersonIcon } from '@radix-ui/react-icons'

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
    const [color, setColor] = useState('W');
    return (
        <>
            <Modal zIndex={10} opened={opened} onClose={close} title={<Text mx="auto" size="xl">Create Challenge Link</Text>} centered>
                <Text>Start a game with anyone</Text>
                <div>
                    <NativeSelect value={color} onChange={(evt) => setColor(evt.target.value)} my="20px" label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                        { value: 'W', label: 'White' },
                        { value: 'B', label: 'Black' },
                        { value: 'RANDOM', label: 'Random' }
                    ]} />
                </div>
                <CopyButton value={createChallengeLink(color)} timeout={1000000}>
                    {
                        ({ copied, copy }) => <Button onClick={copy} color={copied ? 'gray' : 'lime'}> {copied ? 'Copied' : 'Copy Link'} </Button>
                    }
                </CopyButton>
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
                <Flex sx={{ flexGrow: '1' }} height="100%" justify="start" align="start" direction="column">
                    <Title px="md" pt="md" order={3}>Friends</Title>
                    {friends.map((friend, index) => <NavLink key={index} icon={friend.avatar} label={<Text fw={700}>{friend.username}</Text>} />)}
                </Flex>
                <Flex direction='column' gap='10px'>
                    <Button color='lime' onClick={open}>Create Challenge Link</Button>
                    <Button color='lime'>Join using Challenge Link</Button>
                </Flex>
            </Card>
        </>
    )
}

const friends = [
    { avatar: <PersonIcon />, username: "friend", rating: 100 },
    { avatar: <PersonIcon />, username: "friend", rating: 100 },
    { avatar: <PersonIcon />, username: "friend", rating: 100 },
    { avatar: <PersonIcon />, username: "friend", rating: 100 },
]

export default PlayFriend