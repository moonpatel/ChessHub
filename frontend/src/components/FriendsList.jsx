import { Avatar, Flex, Image, Loader, NavLink, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getAuthToken, getUserData } from '../../utils/auth'

const FriendsList = () => {
    const [friends, setFriends] = useState(null);
    const user = getUserData();
    let { username } = user;
    useEffect(() => {
        let response = null;

        const fetchData = async () => {
            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/${username}/friends`;
            try {
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setFriends(data.friends);
                } else {
                    throw data.error;
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchData();

    }, []);

    if (!friends) {
        return (
            <Loader m="20px" variant='dots' color='lime' />
        )
    }

    return (
        <Flex sx={{ flexGrow: '1' }} height="100%" justify="start" my="md" align="start" direction="column">
            <Title px="sm" pt="md" order={3}>Friends</Title>
            {
                friends.map((friend, index) => <NavLink key={index} component={Link} to={`/play/friend/${friend.username}`} p='5px' icon={<Avatar size='sm' color='blue' children={friend.username[0].toUpperCase()} />} label={<Text fw={700}>{friend.username}</Text>} />)
            }
        </Flex>
    )
}

export default FriendsList