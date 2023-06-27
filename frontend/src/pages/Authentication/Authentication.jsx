import React, { useState } from 'react';
import { Button, Card, Container, Text, TextInput } from '@mantine/core';
import { Form, redirect, useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../../utils/auth';

const AuthenticationPage = (props) => {
    const navigate = useNavigate();
    const { isLogin } = props;

    return (
        <Container maw="100%" bg="gray" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card shadow="md" p="lg" style={{ maxWidth: 400, width: '100%' }}>
                <Text align="center" variant="h4" style={{ marginBottom: 20 }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Text>
                <div>
                    {isLogin ? <LoginForm /> : <SignupForm />}

                    {/* Toggle between login and signup */}
                    <Text align="center" style={{ marginBottom: 10 }}>
                        {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                        <Button
                            variant="link"
                            color="lime"
                            size="md"
                            p="10px"
                            onClick={() => { navigate(isLogin ? '/signup' : '/login', { replace: true }) }}
                        >
                            <Text color='lime'>
                                {isLogin ? 'Sign Up' : 'Login'}
                            </Text>
                        </Button>
                    </Text>
                </div>
            </Card>
        </Container>
    );
};

const LoginForm = () => {
    return (
        <Form action='/login' method='POST'>
            <TextInput name="username" type="text" placeholder="username" style={{ marginBottom: 10, padding: '10px' }} />
            <TextInput name="password" type="password" placeholder="Password" style={{ marginBottom: 10, padding: '10px' }} />
            <Button type="submit" fullWidth variant="filled" color="lime" style={{ marginBottom: 10 }}>
                Login
            </Button>
        </Form>
    );
};

const SignupForm = () => {
    return (
        <Form action='/signup' method='POST'>
            <TextInput name="username" type="text" placeholder="Username" style={{ marginBottom: 10, padding: '10px' }} />
            <TextInput name="email" type="email" placeholder="Email" style={{ marginBottom: 10, padding: '10px' }} />
            <TextInput name="password" type="password" placeholder="Password" style={{ marginBottom: 10, padding: '10px' }} />
            <Button type="submit" fullWidth variant="filled" color="lime" style={{ marginBottom: 10 }}>
                Sign Up
            </Button>
        </Form>
    );
};

export const loginAction = async ({ request }) => {
    const data = await request.formData();
    let url = `${import.meta.env.VITE_BACKEND_HOST}/api/auth/login`;

    const authData = {
        username: data.get('username'),
        password: data.get('password')
    }

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(authData),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.status >= 400) return response;
    else {
        const responseBody = await response.json();
        localStorage.setItem('token', responseBody.token);
        return redirect('/home');
    }
}

export const signupAction = async ({ request }) => {
    const data = await request.formData();
    let url = `${import.meta.env.VITE_BACKEND_HOST}/api/auth/signup`;

    const authData = {
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password')
    }

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(authData),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.status >= 400) return response;
    else {
        const responseBody = await response.json();
        localStorage.setItem('token', responseBody.token);
        return redirect('/home');
    }
}

export default AuthenticationPage;
