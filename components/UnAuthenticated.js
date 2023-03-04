import { useRouter } from 'next/router'
import React from 'react'
import styles from '../styles/Unauthenticated.module.css'


const UnAuthenticated = () => {
    const router = useRouter();
    return (
        <div className={styles['page']}>
            {/* <p className={styles['prompt']}>
                Oops, you are not logged in!
            </p> */}
            <button onClick={() => { router.push('/') }}>Go To Login Page</button>
        </div>
    )
}

export default UnAuthenticated