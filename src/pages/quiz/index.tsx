import React, { useEffect, useState } from 'react'
import { FaLessThan } from 'react-icons/fa6';
import { IoMdStopwatch } from 'react-icons/io';
import type QuizModel from '../../models/quiz.model';
import { capitalize } from 'lodash';
import AnswerCard from './AnswerCard';
import { useAuth } from '../../context/AuthContext';
import { findQuiz } from '../../services';
import { useQuiz } from '../../context/QuizContext';
import Button from '../../components/Button';
import NavButton from './NavButton';
import ButtonLink from '../../components/ButtonLink';
import type { UserModel } from '../../models/user.model';
import { useNavigate } from 'react-router-dom';
import type { UserAnswer } from '../../models/quiz.model';

const Quiz: React.FC = ({ }) => {
    const [progress, setProgress] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
    const [quiz, setQuiz] = useState<QuizModel | undefined>(undefined);
    const { user, setUser } = useAuth();
    const { quizzes, setQuizzes } = useQuiz();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !quizzes) return;
        try {
            const quiz = findQuiz(quizzes, user.currentQuizIndex);
            setProgress(user.currentProgress);
            setQuiz(quiz);
            if (quiz?.userAnswer) {
                setSelectedAnswer(quiz.userAnswer.letterIndex);
            }
        } catch (e) {
            console.error('Failed to load quiz:', e);
        }
    }, [user, quizzes]);

    const attemptAnswer = (index: number, letterIndex: number, answer: string) => {
        const isFirstAttempt = !quizzes?.[index - 1]?.userAnswer;
        setSelectedAnswer(letterIndex);
        setQuizzes(prev =>
            prev!.map((quiz: QuizModel, i: number) => {
                return i === index - 1
                    ? {
                        ...quiz, userAnswer: {
                            answer,
                            letterIndex,
                            isCorrect: answer === quiz.correctAnswer,
                        } as UserAnswer
                    } as QuizModel
                    : quiz;
            })
        );

        if (isFirstAttempt) {
            const answeredCount = quizzes!.filter(q => q.userAnswer !== undefined).length + 1;
            setUser({ ...user, currentProgress: answeredCount / quizzes!.length * 100 } as UserModel);
        }
    }

    return (
        <div className="h-screen select-none flex flex-col">
            <nav className='w-full bg-black relative flex px-12 py-4 border-b border-white/15'>
                <div className="p-3 border border-white/15 rounded-lg">
                    <FaLessThan size='12' />
                </div>
                <h1 className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>Science & Technology Quiz</h1>
            </nav>
            <div className="p-12 flex justify-between gap-12 flex-grow">
                <div className="w-[70%] flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
                        <div className="flex flex-col gap-2 px-1">
                            <div className="flex justify-between text-[0.6rem]">
                                <p className='text-[#A1A1AA]'>Question {user?.currentQuizIndex} of {quizzes?.length}</p>
                                <p>{Math.min(progress, 100)}% Complete</p>
                            </div>
                            <div className="w-full h-2 bg-[#27272A]/70 rounded-xl overflow-hidden">
                                <div
                                    className="h-full bg-[#9823F5] text-center transition-all ease-in-out duration-300"
                                    style={{ width: `${progress}%` }}
                                >
                                </div>
                            </div>
                        </div>
                        {quiz && (<div className="flex flex-col gap-4 p-1">
                            <div className="bg-[#27272A]/70 p-4 rounded-lg border-white/15 border flex flex-col gap-2">
                                <div className="flex justify-between text-[0.6rem]">
                                    <div className="bg-[#9823F5] px-3 py-1 rounded-full">{capitalize(quiz.type.toString())}</div>
                                    <div className="text-red-400 rounded-full flex items-center gap-1"><IoMdStopwatch /> <p>00:00</p></div>
                                    <div className="bg-[#212123] px-3 py-1 rounded-full">{capitalize(quiz.difficulty)}</div>
                                </div>
                                <h2 className='text-base font-medium'>Which of the following energy sources cannot be replenished naturally on a human timescale, making it an example of a non-renewable resource?</h2>
                            </div>
                            {quiz?.allAnswers.map((answer, index) => <AnswerCard onClick={() => attemptAnswer(user?.currentQuizIndex!, index, answer)} key={index} index={index} answer={answer} selected={selectedAnswer == index} />)}
                        </div>)}
                    </div>
                    <div className={`flex ${user!.currentQuizIndex > 1 ? 'justify-between' : 'justify-end'} w-full items-center mt-4`}>
                        {user!.currentQuizIndex > 1 && (
                            <Button modifiedClass='border-purple-600 hover:bg-white/10 border-2 text-purple-600 px-5' onClick={() => {
                                const newIndex = user!.currentQuizIndex - 1;
                                setUser({ ...user, currentQuizIndex: newIndex } as UserModel);
                                navigate(`/quiz/${newIndex}`);
                            }}>Previous</Button>
                        )}
                        <Button modifiedClass='bg-purple-600 hover:bg-purple-700 px-5' onClick={() => {
                            const newIndex = user!.currentQuizIndex + 1;
                            setUser({ ...user, currentQuizIndex: newIndex } as UserModel);
                            navigate(`/quiz/${newIndex}`);
                        }}>Next</Button>
                    </div>
                </div>
                <div className="bg-[#27272A]/70 p-4 rounded-lg border-white/15 border flex flex-col gap-5 h-fit">
                    <h2 className='font-bold'>Question List</h2>
                    <div className="grid grid-cols-5 gap-5">
                        {Array.from({ length: quizzes?.length ?? 0 }, (_, i) => (
                            <NavButton
                                selected={user?.currentQuizIndex == i + 1}
                                key={i}
                                onClick={() => {
                                    setUser({ ...user!, currentQuizIndex: i + 1 });
                                    navigate(`/quiz/${i + 1}`);
                                }}
                                index={i + 1}
                            />
                        ))}
                    </div>
                    <ButtonLink modifiedClass='border-2 px-5 box-border border-[#27272A]/70 w-fit flex items-center hover:border-white/30' link={`/quiz/${user?.currentQuizIndex! + 1}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16699 11.6667C4.94586 10.9032 5.99302 10.4756 7.08366 10.4756C8.1743 10.4756 9.22146 10.9032 10.0003 11.6667C10.7792 12.4301 11.8264 12.8577 12.917 12.8577C14.0076 12.8577 15.0548 12.4301 15.8337 11.6667V4.16666C15.0548 4.9301 14.0076 5.35773 12.917 5.35773C11.8264 5.35773 10.7792 4.9301 10.0003 4.16666C9.22146 3.40321 8.1743 2.97559 7.08366 2.97559C5.99302 2.97559 4.94586 3.40321 4.16699 4.16666V11.6667ZM4.16699 11.6667V17.5" stroke="#717171" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Skip</ButtonLink>
                </div>
            </div>
        </div>
    );
}
export default Quiz;