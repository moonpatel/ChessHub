import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Button, Flex, Modal, Text, Title } from '@mantine/core'
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
                localStorage.removeItem('user');
                localStorage.removeItem('loggedIn');
                close();
                return navigate('/login');
            } else {
                return setErrorMsg(resData.message || "Something went wrong")
            }
        } catch (err) {
            setIsLoading(false)
            console.error(err)
            setErrorMsg("Something went wrong");
        }
    }

    return (
        <>
            <Modal opened={isOpen} onClose={close} title={<Title order={3}>Logout</Title>} centered>
                <Text>Are you sure you want to logout?</Text>
                <Flex gap={'sm'} my="20px">
                    <form onSubmit={logoutHandler}>
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
export default Logout