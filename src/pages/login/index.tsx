import React, { useState } from 'react'
import LoginPattern from '../../assets/images/login-pattern.png'
import TextInput from './TextInput';
import { CiMail, CiLock } from 'react-icons/ci';
import Button from '../../components/Button';
import { login } from '../../services';
import type { LoginRequest } from '../../requests';
import AlertError from '../../components/AlertError';
import { useNavigate } from "react-router-dom";
import type { UserModel } from '../../models/user.model';
import { useAuth } from '../../context/AuthContext';
import { fetchQuizFromApi } from '../../repositories';
import { useQuiz } from '../../context/QuizContext';
import QuizModel from '../../models/quiz.model';

const Login: React.FC = ({ }) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { quizzes, setQuizzes } = useQuiz();

    const attemptLogin = async () => {
        try {
            const userModel: UserModel = await login({ email, password } as LoginRequest);

            if (!quizzes) {
                const quizzesRaw: object[] = await fetchQuizFromApi(20);
                const quizModels: QuizModel[] = QuizModel.jsonToQuizList(quizzesRaw);
                setQuizzes(quizModels);
            }

            setUser(userModel);
            navigate(`/quiz/${userModel.currentQuizIndex}`);
        } catch (err) {
            if (err instanceof Object) {
                setError((err as any).errors[0].message);
            } else {
                setError((err as Error).message);
            }
            setTimeout(() => setError(null), 3000);
        }
    }

    return (
        <div className='h-screen w-full relative'>
            <AlertError message={error} />
            <div className="h-full w-full grid grid-cols-2">
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
                    <div className='flex flex-col gap-3'>
                        <TextInput onChange={(value) => { setEmail(value) }} value={email} placeholder='Enter your email address...' title='Email' icon={<CiMail className='text-slate-500 size-5' style={{ strokeWidth: 1 }} />} />
                        <TextInput onChange={(value) => { setPassword(value) }} value={password} placeholder='Enter your password...' title='Password' icon={<CiLock className='text-slate-500 size-5' style={{ strokeWidth: 1 }} />} />
                        <Button onClick={attemptLogin} modifiedClass='text-white bg-purple-600 hover:bg-purple-700 mt-2 rounded-xl'>Sign in</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;