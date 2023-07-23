import React, { useState } from 'react'
import { Button, Flex, Modal, Text, Title } from '@mantine/core'
import { Form, redirect, useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'

const Logout = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const logoutHandler = async (evt) => {
        try {
            evt.preventDefault();
            console.log('Logging out')
            setIsLoading(true);
            let logoutUrl = `${import.meta.env.VITE_BACKEND_HOST}/api/auth/logout`
            const response = await fetch(logoutUrl, {
                method: 'DELETE', credentials: 'include'
            });
            const resData = await response.json();
            setIsLoading(false);
            if (response.ok) {
                console.log('Logged out')
                localStorage.removeItem('user');
                close();
                return navigate('/login');
            } else {
                return setErrorMsg(resData.userMessage || "Something went wrong")
            }
        } catch (err) {
            setIsLoading(false)
            console.log(err)
            setErrorMsg("Something went wrong");
        }
    }

    return (
        <>
            <Modal opened={isOpen} onClose={close} title={<Title order={3}>Logout</Title>} centered>
                <Text>Are you sure you want to logout?</Text>
                <Flex gap={'sm'} my="20px">
                    <form onClick={logoutHandler}>
                        <Button loading={isLoading} type="submit" color='red' px='xl'>Logout</Button>
                    </form>
                    <Button disabled={isLoading} color='gray'>Cancel</Button>
                </Flex>
                <Text style={{ color: 'red', fontWeight: '800' }}>
                    {errorMsg}
                </Text>
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