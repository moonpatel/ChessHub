import React from 'react'
import { Button, Flex, Modal, Text, Title } from '@mantine/core'
import { Form, redirect } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'

const Logout = () => {
    const [isOpen, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={isOpen} onClose={close} title={<Title order={3}>Logout</Title>} centered>
                <Text>Are you sure you want to logout?</Text>
                <Flex gap={'sm'} my="20px">
                    <Form action='/logout' method='POST'>
                        <Button type="submit" color='red' px='xl'>Logout</Button>
                    </Form>
                    <Button color='gray'>Cancel</Button>
                </Flex>
            </Modal>
            <Button onClick={open} type="submit" color='red' size='md' px='xl'>Logout</Button>
        </>
    )
}

export const logoutAction = ({ request }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return redirect('/login');
}

export default Logout