import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Card, Container, Text, TextInput, Title } from '@mantine/core';
import { useForm } from 'react-hook-form'
import { ZodError, z } from 'zod';

import { UserDataContext } from '../../context/user-data-context';

let host = import.meta.env.VITE_BACKEND_HOST;

const loginSchema = z.object({
    username: z.string().min(5, { message: 'Username should not be less than 5 characters' }).max(15, { message: 'Username should not be more than 15 characters' }),
    password: z.string().min(8, { message: 'Password should not be less than 8 characters' }).max(15, { message: 'Password should not be more than 15 characters' })
}).required();

const signupSchema = z.object({
    username: z.string().min(5, { message: 'Username should not be less than 5 characters' }).max(15, { message: 'Username should not be more than 15 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password should not be less than 8 characters' }).max(15, { message: 'Password should not be more than 15 characters' }),
}).required();

const AuthenticationPage = (props) => {
    const navigate = useNavigate();
    const { isLogin } = props;

    return (
        <Container maw="100%" sx={(theme) => ({ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: theme.fn.gradient({ from: 'blue', to: 'teal' }) })}>
            <Card shadow="md" p="lg" style={{ maxWidth: 400, width: '100%' }}>
                <Title align="center" variant="h4" order={1} style={{ marginBottom: 20 }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Title>
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

AuthenticationPage.propTypes = {
    isLogin: PropTypes.bool
}

const LoginForm = () => {
    const { setIsLoggedIn } = useContext(UserDataContext)
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (data) => {
        setIsLoading(true);
        try {
            loginSchema.parse(data);
            let loginUrl = `${host}/api/auth/login`
            const response = await fetch(loginUrl, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
            const resData = await response.json();
            setIsLoading(false);
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(resData.user))
                localStorage.setItem('loggedIn', true);
                setIsLoggedIn(true);
                return navigate('/');
            } else {
                setErrorMsg(resData.message || "Something went wrong");
            }
        } catch (err) {
            setIsLoading(false);
            if (err instanceof ZodError) {
                let formattedError = err.format();
                formattedError.username && setError('username', { message: formattedError.username._errors[0] });
                formattedError.password && setError('password', { message: formattedError.password._errors[0] });
            } else {
                console.error(err);
                setErrorMsg("Something went wrong")
            }
        }
    }
    return (
        <form onSubmit={handleSubmit(loginHandler)}>
            <TextInput error={errors?.username?.message} name="username" type="text" placeholder="username" {...register('username')} style={{ marginBottom: 10, padding: '10px' }} />
            <TextInput error={errors?.password?.message} type="password" placeholder="Password" {...register('password')} style={{ marginBottom: 10, padding: '10px' }} />
            <Button loading={isLoading} type="submit" fullWidth variant="filled" color="lime" style={{ marginBottom: 10 }}>
                Login
            </Button>
            <Text style={{ color: 'red', textAlign: 'center', fontSize: '150%' }}>
                {errorMsg}
            </Text>
        </form>
    );
};

const SignupForm = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(UserDataContext)
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const signupHandler = async (data) => {
        setIsLoading(true)
        try {
            signupSchema.parse(data)
            let signupUrl = `${host}/api/auth/signup`;
            const response = await fetch(signupUrl, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
            const resData = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(resData.user))
                localStorage.setItem('loggedIn', true);
                setIsLoggedIn(true);
                return navigate('/');
            } else {
                setIsLoading(false);
                setErrorMsg(resData.message);
                resData?.error?.username && setError('username', { message: resData.error.username });
                resData?.error?.email && setError('email', { message: resData.error.email });
            }
        } catch (err) {
            setIsLoading(false);
            if (err instanceof ZodError) {
                let formattedError = err.format();
                formattedError.username && setError('username', { message: formattedError.username._errors[0] });
                formattedError.email && setError('email', { message: formattedError.email._errors[0] });
                formattedError.password && setError('password', { message: formattedError.password._errors[0] });
            } else {
                console.error(err)
                setErrorMsg("Something went wrong")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(signupHandler)}>
            <TextInput {...register('username')} error={errors?.username?.message} type="text" placeholder="Username" style={{ marginBottom: 10, padding: '10px' }} />
            <TextInput {...register('email')} error={errors?.email?.message} type="email" placeholder="Email" style={{ marginBottom: 10, padding: '10px' }} />
            <TextInput {...register('password')} error={errors?.password?.message} type="password" placeholder="Password" style={{ marginBottom: 10, padding: '10px' }} />
            <Button loading={isLoading} type="submit" fullWidth variant="filled" color="lime" style={{ marginBottom: 10 }}>
                Sign Up
            </Button>
            <Text style={{ color: 'red', textAlign: 'center', fontSize: '150%' }}>
                {errorMsg}
            </Text>
        </form>
    );
};

export default AuthenticationPage;
