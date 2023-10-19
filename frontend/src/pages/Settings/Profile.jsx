import React, { useContext } from 'react'

import { useForm } from '@mantine/form'
import { Form } from 'react-router-dom'
import { Avatar, Button, Flex, Grid, Group, Stack, Text, TextInput, Title } from '@mantine/core'

import { getUserData } from '../../utils/auth'
import { UserDataContext } from '../../context/user-data-context'
import MainLoader from '../../components/MainLoader'

const Profile = () => {
    let { user } = useContext(UserDataContext);

    if (!user) {
        return <MainLoader />
    }

    let { username, email, fname, lname, country, location } = user;
    const form = useForm({
        initialValues: {
            username, fname, email, lname, country, location
        },
    })

    let fullName = (fname && lname) ? fname + ' ' + lname : null;

    return (
        <Stack>
            <Flex gap="md" sx={{ display: 'flex', backgroundColor: '#272623', borderRadius: '5px' }} bg='gray' w="100%" p="30px">
                <Avatar size={180} color='lime' variant='gradient' gradient={{ from: 'blue', to: 'green', deg: 100 }}>
                    <Text sx={{ fontSize: '120px' }}>
                        {username[0].toUpperCase()}
                    </Text>
                </Avatar>
                <div>
                    <Title>{username}</Title>
                    <Group position='left'>
                        <Text>{fullName || '-------'},</Text>
                        <Text>{location || '-----'}</Text>
                    </Group>
                </div>
            </Flex>
            <Form action='/settings/profile' method='patch' >
                <Flex gap="md" sx={{ display: 'flex', backgroundColor: '#272623', borderRadius: '5px', textAlign: 'left' }} bg='gray' w="100%" p="30px">
                    <Grid w='100%' gutter={30} columns={12}>
                        <Grid.Col span={6}>
                            <TextInput name='username' label='Username' readOnly value={form.values.username} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput name='email' label='Email address' readOnly value={form.values.email} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput name='fname' label='First Name' {...form.getInputProps('fname')} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput name='lname' label='Last Name' {...form.getInputProps('lname')} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput name='location' label='City' {...form.getInputProps('location')} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput name='country' label='Country' {...form.getInputProps('country')} />
                        </Grid.Col>
                    </Grid>
                    <Group>
                        <Button onClick={form.reset} color='dark'>Cancel</Button>
                        <Button type='submit' color='lime'>Save</Button>
                    </Group>
                </Flex>
            </Form>
        </Stack>
    )
}

export const action = async ({ request }) => {
    const data = await request.formData();
    let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user`

    const reqBody = {
        fname: data.get('fname'), lname: data.get('lname'), country: data.get('country'), location: data.get('location')
    }
    console.log(reqBody)

    const response = await fetch(url, {
        body: JSON.stringify(reqBody),
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const resData = await response.json();
    console.log(resData)
    if (response.ok) {
        return null;
    } else {
        let resData = await response.json();
        return resData;
    } 
}


export default Profile