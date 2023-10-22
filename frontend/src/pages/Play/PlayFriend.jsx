import React from 'react'

import { useDisclosure } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { Button, Card, Flex, Image, Modal, NativeSelect, Text, TextInput, Title } from '@mantine/core'

import FriendsList from '../../components/FriendsList'
import Challenges from '../../components/Challenges'

const PlayFriend = () => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal zIndex={10} opened={opened} onClose={close} title={<Text mx="auto" size="xl">Create Challenge Link</Text>} centered>
                <Text>Start a game with anyone</Text>
                <div>
                    <NativeSelect my="20px" label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                        { value: 'W', label: 'White' },
                        { value: 'B', label: 'Black' },
                        { value: 'RANDOM', label: 'Random' }
                    ]} />
                </div>
            </Modal>
            <Card
                sx={{
                    width: '600px',
                    height: '90%',
                    textAlign: 'center',
                    backgroundColor: '#262523'
                }}
                px='30px'
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

// const friends = [
//     { avatar: <IconUserCircle />, username: "friend", rating: 100 },
//     { avatar: <IconUserCircle />, username: "friend", rating: 100 },
//     { avatar: <IconUserCircle />, username: "friend", rating: 100 },
//     { avatar: <IconUserCircle />, username: "friend", rating: 100 },
// ]

export default PlayFriend