import { supabase } from '@/lib/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import styles from '../styles/Auth.module.css'



const Login = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setIsError] = useState(null);


    const handleUserName = (e) => {
        setIsError(null);
        setUsername(e.target.value);
    }
    const handlePassword = (e) => {
        setIsError(null);
        setPassword(e.target.value);
    }

    async function handleSubmit() {

        let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
        console.log(data, error);

        if (!data || data.length === 0 || error) {
            setIsError('Invalid username or password');
            return;
        }

        // save user in cache
        localStorage.setItem('user', JSON.stringify({ username: username, password: password }));
        router.push('/dashboard');

    }


    return (
        <div className={styles['page']}>
            <div className={styles['auth-box']}>
                <h1 className={styles['title']}>Login</h1>
                <h3 className={styles['label']}>Username</h3>
                <input type="text" value={username} onChange={handleUserName} placeholder='username'></input>
                <h3 className={styles['label']}>Password</h3>
                <input type="text" value={password} onChange={handlePassword} placeholder='password'></input>
                {
                    error &&
                    <p className={styles['error']}>{error}</p>
                }
                <button onClick={() => { handleSubmit() }}>Login</button>
            </div>
        </div>
    )
}

export default Login;