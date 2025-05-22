import React from 'react'
import LoginPattern from '../../assets/images/login-pattern.png'
import TextInput from './TextInput';
import { CiMail, CiLock } from 'react-icons/ci';
import Button from './Button';

const Login: React.FC = ({ }) => {
    return (
        <div className="h-screen w-full grid grid-cols-2 font-[Geist]">
            <div className="bg-black relative flex flex-col justify-between h-full">
                <img src={LoginPattern} alt="login-pattern" className='w-full absolute top-0' />
                <img src={LoginPattern} alt="login-pattern" className='w-full absolute bottom-0 rotate-180' />
                <h1 className="absolute text-5xl font-bold bg-gradient-to-r from-[#5813C1] from-40% to-[#C45037] bg-clip-text text-transparent top-1/2 left-1/2 -translate-1/2 -translate-y-1/2">
                    MyQuiz
                </h1>
            </div>
            <div className="p-32 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <p className='font-bold text-3xl'>Welcome Back</p>
                    <p className='text-slate-500 text-lg font-medium'>Enter your credentials to access your account</p>
                </div>
                <hr className='border-slate-200' />
                <form className='flex flex-col gap-3'>
                    <TextInput placeholder='Enter your email address...' title='Email' icon={<CiMail className='text-slate-500 size-5' style={{ strokeWidth: 1 }} />} />
                    <TextInput placeholder='Enter your password...' title='Password' icon={<CiLock className='text-slate-500 size-5' style={{ strokeWidth: 1 }} />} />
                    <Button modifiedClass='text-white bg-purple-600 hover:bg-purple-700 mt-2'>Sign in</Button>
                </form>
            </div>
        </div>
    );
}
export default Login;