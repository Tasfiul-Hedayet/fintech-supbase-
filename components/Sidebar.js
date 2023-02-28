import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../styles/Sidebar.module.css'



const Sidebar = () => {

    const router = useRouter();

    async function logout() {
        localStorage.setItem('user', JSON.stringify(null));
        router.push('/');
    }

    let [isToggled, setToggled] = useState(false);
    function toggle() {
        setToggled((current) => !current);
    }

    if (!isToggled) {
        return (
            <div onClick={() => { toggle() }} className={styles['open-sidebar']}>
                Open
            </div>
        )
    }
    else {
        return (
            <div className={styles['sidebar']}>
                <div onClick={() => { toggle() }}>
                    close
                </div>
                <div className={styles['title-link']}>
                    Company
                </div>

                <div className={styles['link']} onClick={() => { router.push('/supplier') }}>
                    Suppplier
                </div>

                <div className={styles['link']} onClick={() => { router.push('/product') }}>
                    Product
                </div>

                <div className={styles['link']} onClick={() => { router.push('/purchase') }}>
                    Purchase Invoice
                </div>

                <div className={styles['link']} onClick={() => { router.push('/payment') }}>
                    Suppplier Payment
                </div>

                <div className={styles['link']} onClick={() => { router.push('/customer') }}>
                    Customer
                </div>

                <div className={styles['link']} onClick={() => { router.push('/sales') }}>
                    Sales Invoice
                </div>

                <div className={styles['link']} onClick={() => { router.push('/system') }}>
                    System
                </div>

                <div className={styles['link']} onClick={logout}>
                    Logout
                </div>

            </div>
        )
    }


}

export default Sidebar;