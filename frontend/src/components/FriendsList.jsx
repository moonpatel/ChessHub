import { Avatar, Flex, Loader, NavLink, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/user-data-context';
import React, { useContext } from 'react';

const FriendsList = () => {
    const { friends } = useContext(UserDataContext)

    if (!friends) {
        return (
            <Loader m="20px" variant='dots' color='lime' />
        )
    }

    return (
        <Flex sx={{ flexGrow: '1' }} height="100%" justify="start" my="md" align="start" direction="column">
            <Title px="sm" pt="md" order={3}>Friends</Title>
            {
                friends.length === 0 ?
                    <Text>
                        No friends
                    </Text>
                    :
                    friends.map((friend, index) => <NavLink key={index} component={Link} to={`/play/friend/${friend.username}`} p='5px' icon={<Avatar size='sm' color='blue' children={friend.username[0].toUpperCase()} />} label={<Text fw={700}>{friend.username}</Text>} />)
            }
        </Flex>
    )
}

export default FriendsList