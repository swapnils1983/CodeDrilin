import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../authSlice';

function Navbar({ user }) {
    const dispatch = useDispatch();

    return (
        <div>
            <div className="navbar bg-gray-800 border-b border-gray-700 px-6">
                <div className="flex-1">
                    <h1 className="text-green-400 font-bold font-mono text-xl">{'</>'} CodeDrilin</h1>
                    <span className="ml-4 badge badge-warning">Admin Panel</span>
                </div>
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost text-white normal-case text-sm hover:bg-gray-700">
                            Welcome, <span className="text-green-400 ml-1">{user?.firstName} ▾</span>
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-gray-800 border border-gray-700 rounded-box w-40 mt-2 z-[1]"
                        >
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