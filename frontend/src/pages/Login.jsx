import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { useEffect } from 'react';

// Zod schema for login validation
const loginSchema = z.object({
    emailId: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth)
    const navigate = useNavigate()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema) });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated])

    const onSubmit = (data) => {
        dispatch(loginUser(data));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                        <h1 className="text-xl font-mono font-bold text-green-400 flex items-center">
                            <span className="mr-2">{'</>'}</span> CodeDrilin
                        </h1>
                    </div>

                    <div className="p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Welcome Back</h2>
                            <p className="text-gray-400 mt-2">Log in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <div className="form-control">
                                <label htmlFor="emailId" className="label">
                                    <span className="label-text text-gray-300">Email</span>
                                </label>
                                <input
                                    type="email"
                                    id="emailId"
                                    {...register("emailId")}
                                    className={`input input-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-green-400 focus:border-transparent ${errors.emailId ? 'border-red-500' : ''}`}
                                    placeholder="your@email.com"
                                />
                                {errors.emailId && (
                                    <label className="label">
                                        <span className="label-text-alt text-red-500">
                                            {errors.emailId.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Password */}
                            <div className="form-control">
                                <label htmlFor="password" className="label">
                                    <span className="label-text text-gray-300">Password</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register("password")}
                                    className={`input input-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-green-400 focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="••••••••"
                                />
                                <label className="label">
                                    <span className={`label-text-alt ${errors.password ? 'text-red-500' : 'text-gray-500'}`}>
                                        {errors.password ? errors.password.message : 'Minimum 8 characters'}
                                    </span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-success w-full mt-2 bg-green-600 hover:bg-green-700 border-none text-white"
                            >
                                Log In
                            </button>
                        </form>

                        <div className="divider text-gray-500 text-xs my-6">OR</div>

                        <div className="text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="link text-green-400 hover:text-green-300">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-750 text-center border-t border-gray-700">
                        <p className="text-xs text-gray-500">
                            Forgot your password? <a href="#" className="link text-gray-400">Reset it here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
