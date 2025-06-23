import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../admin/components/Navbar';
import AdminDashboard from '../admin/components/AdminDashboard';

const AdminPanel = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user?.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Navbar user={user} />
            <Outlet />

        </div>
    );
};

export default AdminPanel;