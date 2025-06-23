import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../authSlice';
import { useEffect } from 'react';

// Zod schema for validation
const userSchema = z.object({
    firstName: z.string().min(1, "Username is required"),
    emailId: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const Signup = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(userSchema) });


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated])

    const onSubmit = (data) => {
        dispatch(registerUser(data));
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
                            <h2 className="text-2xl font-bold">Create Your Account</h2>
                            <p className="text-gray-400 mt-2">Start your coding journey today</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Username */}
                            <div className="form-control">
                                <label htmlFor="firstName" className="label">
                                    <span className="label-text text-gray-300">Username</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    {...register("firstName")}
                                    className={`input input-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-green-400 focus:border-transparent ${errors.firstName ? 'border-red-500' : ''}`}
                                    placeholder="coder123"
                                />
                                {errors.firstName && (
                                    <label className="label">
                                        <span className="label-text-alt text-red-500">
                                            {errors.firstName.message}
                                        </span>
                                    </label>
                                )}
                            </div>

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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-success w-full mt-2 bg-green-600 hover:bg-green-700 border-none text-white"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="divider text-gray-500 text-xs my-6">OR</div>

                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="link text-green-400 hover:text-green-300">
                                Log in
                            </Link>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-750 text-center border-t border-gray-700">
                        <p className="text-xs text-gray-500">
                            By signing up, you agree to our <a href="#" className="link text-gray-400">Terms</a> and <a href="#" className="link text-gray-400">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
