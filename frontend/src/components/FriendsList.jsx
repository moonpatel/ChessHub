import { Avatar, Flex, Image, Loader, NavLink, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const FriendsList = () => {
    const [friends, setFriends] = useState(null);
    useEffect(() => {
        const abortController = new AbortController();
        let response = null;

        const fetchData = async () => {
            let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/user1/friends`;
            try {
                response = await fetch(url, { signal: abortController.signal });
                const data = await response.json();
                if (data.success) {
                    setFriends(data.friends);
                } else {
                    throw data;
                }
            } catch (error) {
                if (error.message === 'The user aborted a request.');
                else {
                    console.log('Error fetching data');
                    throw error;
                }
            }
        }

        fetchData();

        return () => {
            if (!response) {
                abortController.abort();
            }
        }
    }, []);

    return (
        <Flex sx={{ flexGrow: '1' }} height="100%" justify="start" my="md" align="start" direction="column">
            <Title px="sm" pt="md" order={3}>Friends</Title>

            {
                friends ?
                    friends.map((friend, index) => <NavLink key={index} component={Link} to="/play/friend/moonpatel" p='5px' icon={<Avatar size='sm' color='blue' children="M" />} label={<Text fw={700}>{friend}</Text>} />)
                    :
                    <Loader m="20px" variant='dots' color='lime' />
            }
        </Flex>
    )
}

export default FriendsList