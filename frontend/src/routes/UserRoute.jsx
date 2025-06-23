import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet, useNavigate } from 'react-router'
import { useSelector } from 'react-redux';

function UserRoute() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default UserRoute

