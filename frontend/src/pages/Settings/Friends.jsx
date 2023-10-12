import React from 'react'

import { useForm } from '@mantine/form'
import { Button, Card, Flex, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import FriendsList from '../../components/FriendsList'

const Friends = () => {
    const form = useForm({ initialValues: { username: '' }, })

    const addFriend = async () => {
        console.log(form.values);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/user/friends/${form.values.username}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ username: form.values.username })
        });
        if (!response.ok) {
            const resData = await response.json();
            form.setErrors({ username: resData.error.message })
        } else {
            console.log("Friend added");
        }
    }

    return (
        <Card sx={{ backgroundColor: '#272623', textAlign: 'left' }} p='30px'>
            <Title>Friends</Title>
            <Flex direction='row' gap='lg' my='20px'>
                <TextInput w='300px' sx={{ backgroundColor: '#272623' }} placeholder='Search username' icon={<IconSearch />} {...form.getInputProps('username')} />
                <Button color='gray' onClick={addFriend}>Add friend</Button>
            </Flex>
            <FriendsList />
        </Card>
    )
}

export default Friends