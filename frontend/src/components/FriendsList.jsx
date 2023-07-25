import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { Avatar, Flex, Loader, NavLink, Text, Title } from '@mantine/core';

import { UserDataContext } from '../context/user-data-context';

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
                    friends.map((friend, index) => <NavLink key={index} component={Link} to={`/play/friend/${friend.username}`} p='5px' icon={<Avatar size='sm' color='blue' >{friend.username[0].toUpperCase()}</Avatar>} label={<Text fw={700}>{friend.username}</Text>} />)
            }
        </Flex>
    )
}

export default FriendsList