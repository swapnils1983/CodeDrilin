import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router'
import { logoutUser } from '../authSlice';

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    return (
        <div>
            <div className="navbar bg-gray-800 border-b border-gray-700 px-6">
                <div className="flex-1">
                    <div className="flex items-center">
                        <h1
                            className="text-green-400 font-bold font-mono text-xl cursor-pointer hover:text-green-300 transition-colors"
                            onClick={() => navigate('/')}
                        >
                            {'</>'} CodeDrilin
                        </h1>
                    </div>
                </div>
                <div className="flex-none gap-4">
                    {/* Contests Button */}
                    <button
                        className="btn btn-ghost text-white normal-case text-sm hover:bg-gray-700"
                        onClick={() => navigate('/contests')}
                    >
                        Contests
                    </button>

                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost text-white normal-case text-sm hover:bg-gray-700">
                            Welcome, <span className="text-green-400 ml-1">{user?.firstName} ▾</span>
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-gray-800 border border-gray-700 rounded-box w-40 mt-2 z-[1]"
                        >
                            {user?.role === 'admin' && (
                                <li>
                                    <button
                                        className="text-blue-400 hover:bg-blue-500 hover:text-white w-full text-left"
                                        onClick={() => navigate('/admin/admin-panel')}
                                    >
                                        Admin Panel
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    className="text-red-400 hover:bg-red-500 hover:text-white w-full text-left"
                                    onClick={() => dispatch(logoutUser())}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar