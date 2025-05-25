import React, { useEffect, useState } from 'react'
import { FaLessThan } from 'react-icons/fa6';
import { IoMdStopwatch } from 'react-icons/io';
import type QuizModel from '../../models/quiz.model';
import { capitalize } from 'lodash';
import AnswerCard from '../../components/AnswerCard';
import { useAuth } from '../../context/AuthContext';
import { getSingleQuiz, getStoredQuiz } from '../../services';

const Quiz: React.FC = ({ }) => {
    const [progress, setProgress] = useState<number>(40);
    const [quiz, setQuiz] = useState<QuizModel | undefined>(undefined);
    const {user} = useAuth();

    useEffect(() => {
        const quiz = getSingleQuiz(user?.currentQuizIndex!);
        setQuiz(quiz);
    }, []);

    if (!quiz) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="h-screen select-none">
            <nav className='w-full bg-black relative flex px-12 py-4 border-b border-white/15'>
                <div className="p-3 border border-white/15 rounded-lg">
                    <FaLessThan size='12' />
                </div>
                <h1 className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>Science & Technology Quiz</h1>
            </nav>
            <div className="p-12 flex gap-12">
                <div className="w-[70%]">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[0.6rem]">
                                <p className='text-[#A1A1AA]'>Question 1 of 10</p>
                                <p>{progress}% Complete</p>
                            </div>
                            <div className="w-full h-2 bg-[#27272A]/70 rounded-xl overflow-hidden">
                                <div
                                    className="h-full bg-[#9823F5] text-center transition-all ease-in-out duration-300"
                                    style={{ width: `${progress}%` }}
                                >
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#27272A]/70 p-4 rounded-lg border-white/15 border flex flex-col gap-2">
                            <div className="flex justify-between text-[0.6rem]">
                                <div className="bg-[#9823F5] px-3 py-1 rounded-full">{capitalize(quiz.type.toString())}</div>
                                <div className="text-red-400 rounded-full flex items-center gap-1"><IoMdStopwatch /> <p>00:00</p></div>
                                <div className="bg-[#212123] px-3 py-1 rounded-full">{capitalize(quiz.difficulty)}</div>
                            </div>
                            <h2 className='text-base font-medium'>Which of the following energy sources cannot be replenished naturally on a human timescale, making it an example of a non-renewable resource?</h2>
                        </div>
                        {quiz.allAnswers.map((answer, index) => <AnswerCard key={index} index={index} answer={answer}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Quiz;