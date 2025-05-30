import React, { useEffect, useState } from 'react'
import { IoMdStopwatch } from 'react-icons/io';
import type QuizModel from '../../models/quiz.model';
import { capitalize } from 'lodash';
import AnswerCard from './AnswerCard';
import { useAuth } from '../../context/AuthContext';
import { findQuiz } from '../../services';
import { useQuiz } from '../../context/QuizContext';
import Button from '../../components/Button';
import NavButton from './NavButton';
import type { UserModel } from '../../models/user.model';
import { useNavigate, useParams } from 'react-router-dom';
import type { UserAnswer } from '../../models/quiz.model';
import he from 'he';
import Modal from '../../components/Modal/index.';
import { MdClose } from 'react-icons/md';
import { IoCheckmark } from 'react-icons/io5';
import { CgClose, CgMenu } from 'react-icons/cg';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz: React.FC = ({ }) => {
    const { user, loading, setUser } = useAuth();
    const { quizzes, setQuizzes } = useQuiz();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
    const [quiz, setQuiz] = useState<QuizModel | undefined>(undefined);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const params = useParams();
    const id = parseInt(params.id!);

    useEffect(() => {
        if (!user?.endAt) return;
        let newUser = { ...user, currentQuizIndex: id } as UserModel;
        if (user && !user.sessionStarted) {
            newUser = { ...newUser, sessionStarted: true };
        }

        setUser(newUser);

        const interval = setInterval(() => {
            const remaining = user.endAt - Date.now();
            setTimeLeft(Math.max(remaining, 0));
            if (remaining <= 0) {
                clearInterval(interval);
                attemptSubmit();
                navigate('/result');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!user || !quizzes) return;
        try {
            const quiz = findQuiz(quizzes, id);
            setProgress(user.currentProgress);
            setQuiz(quiz);
            if (quiz?.userAnswer) {
                setSelectedAnswer(quiz.userAnswer.letterIndex);
            } else {
                setSelectedAnswer(undefined);
            }
        } catch (e) {
            console.error('Failed to load quiz:', e);
        }
    }, [user, quizzes, id]);

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

        if (id < quizzes!.length) navigate(`/quiz/${id + 1}`);
    }

    const undoAnswer = (index: number) => {
        const selected = quizzes?.[index - 1]?.userAnswer;

        if (selected) {
            setSelectedAnswer(undefined);
            setQuizzes(prev =>
                prev!.map((quiz: QuizModel, i: number) => {
                    return i === index - 1
                        ? {
                            ...quiz, userAnswer: undefined
                        } as QuizModel
                        : quiz;
                })
            );
            const answeredCount = quizzes!.filter(q => q.userAnswer !== undefined).length - 1;
            setUser({ ...user, currentProgress: answeredCount / quizzes!.length * 100 } as UserModel);
        }
    }

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const attemptSubmit = () => {
        const userCorrectAnswers = quizzes?.filter((quiz) => quiz.userAnswer?.isCorrect == true).length ?? 0;
        setUser({ ...user, score: userCorrectAnswers / quizzes!.length * 100, endAt: -1 } as UserModel);
        navigate('/result');
        if (isShowModal) setIsShowModal(false);
    }

    if (loading || !user) return null;

    return (
        <div className="h-screen select-none flex flex-col">
            <Modal isOpen={isShowModal} onClose={() => setIsShowModal(false)}>
                <div className="flex flex-col gap-4 pt-4">
                    <p className='text-black'>Apakah anda yakin untuk submit quiz?</p>
                    <div className="flex justify-between">
                        <Button modifiedClass='bg-red-600 hover:bg-red-700 border-2 border-red-600 px-5 rounded-xl' onClick={() => { setIsShowModal(false) }}><MdClose /></Button>
                        <Button modifiedClass='bg-green-600 hover:bg-green-700 border-2 border-green-600 px-5 rounded-xl' onClick={attemptSubmit}><IoCheckmark /></Button>
                    </div>
                </div>
            </Modal>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="z-20 w-screen h-screen absolute top-0 left-0 flex lg:hidden bg-black justify-center items-center">
                        <button className='absolute top-5 right-5' onClick={() => setIsMenuOpen(false)}>
                            <CgClose size={20} />
                        </button>
                        <div className=" bg-[#27272A]/70 p-4 rounded-lg border-white/15 border flex flex-col gap-5 h-fit">
                            <div className="">
                                <h2 className='font-bold mb-1'>Question List</h2>
                                <div className="text-red-400 rounded-full flex items-center gap-1 text-sm"><IoMdStopwatch /> <p>{formatTime(timeLeft)}</p></div>
                            </div>
                            <div className="grid grid-cols-5 gap-5">
                                {quizzes?.map((quiz, i) => {
                                    return <NavButton
                                        answered={quiz.userAnswer != null}
                                        selected={id == i + 1}
                                        key={i}
                                        onClick={() => {
                                            navigate(`/quiz/${i + 1}`);
                                            setIsMenuOpen(false);
                                        }}
                                        index={i + 1}
                                    />
                                })}
                            </div>
                            <Button modifiedClass='border-2 px-5 box-border border-[#27272A]/70 w-fit flex items-center hover:border-white/30 rounded-xl' onClick={() => undoAnswer(id!)}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.16699 11.6667C4.94586 10.9032 5.99302 10.4756 7.08366 10.4756C8.1743 10.4756 9.22146 10.9032 10.0003 11.6667C10.7792 12.4301 11.8264 12.8577 12.917 12.8577C14.0076 12.8577 15.0548 12.4301 15.8337 11.6667V4.16666C15.0548 4.9301 14.0076 5.35773 12.917 5.35773C11.8264 5.35773 10.7792 4.9301 10.0003 4.16666C9.22146 3.40321 8.1743 2.97559 7.08366 2.97559C5.99302 2.97559 4.94586 3.40321 4.16699 4.16666V11.6667ZM4.16699 11.6667V17.5" stroke="#717171" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Reset</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <nav className='w-full bg-black relative flex justify-end px-12 py-4 md:py-8 border-b border-white/15'>
                <h1 className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>MyQuiz</h1>
                <button className='lg:hidden' onClick={() => setIsMenuOpen(true)}><CgMenu size={20} /></button>
            </nav>
            <div className="p-6 md:p-12 flex justify-between gap-12 flex-grow">
                <div className="w-full lg:w-[70%] flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
                        <div className="flex flex-col gap-2 px-1">
                            <div className="flex justify-between text-[0.6rem]">
                                <p className='text-[#A1A1AA]'>Question {id} of {quizzes?.length}</p>
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
                                <div className="flex justify-between text-[0.4rem] md:text-[0.6rem]">
                                    <div className="bg-[#9823F5] px-3 py-1 rounded-full">{capitalize(quiz.type.toString())}</div>
                                    <div className="bg-[#212123] px-3 py-1 rounded-full">{capitalize(quiz.difficulty)}</div>
                                </div>
                                <h2 className='text-sm md:text-base font-medium'>{he.decode(quiz.question)}</h2>
                            </div>
                            {quiz?.allAnswers.map((answer, index) => <AnswerCard onClick={() => attemptAnswer(id!, index, answer)} key={index} index={index} answer={answer} selected={selectedAnswer == index} />)}
                        </div>)}
                    </div>
                    <div className={`flex ${id > 1 ? 'justify-between' : 'justify-end'} w-full items-center mt-4`}>
                        {id > 1 && (
                            <Button modifiedClass='border-purple-600 hover:bg-white/10 border-2 text-purple-600 px-5 rounded-xl' onClick={() => {
                                navigate(`/quiz/${id - 1}`);
                            }}>Previous</Button>
                        )}
                        {id < quizzes!.length ? <Button modifiedClass='bg-purple-600 hover:bg-purple-700 border-2 border-purple-600 px-5 rounded-xl' onClick={() => {
                            navigate(`/quiz/${id + 1}`);
                        }}>Next</Button> : <Button modifiedClass='bg-green-600 hover:bg-green-700 border-2 border-green-600 px-5 rounded-xl' onClick={() => { setIsShowModal(true); }}>Submit</Button>}
                    </div>
                </div>
                <div className="hidden bg-[#27272A]/70 p-4 rounded-lg border-white/15 border lg:flex flex-col gap-5 h-fit">
                    <div className="">
                        <h2 className='font-bold mb-1'>Question List</h2>
                        <div className="text-red-400 rounded-full flex items-center gap-1 text-sm"><IoMdStopwatch /> <p>{formatTime(timeLeft)}</p></div>
                    </div>
                    <div className="grid grid-cols-5 gap-5">
                        {quizzes?.map((quiz, i) => {
                            return <NavButton
                                answered={quiz.userAnswer != null}
                                selected={id == i + 1}
                                key={i}
                                onClick={() => {
                                    navigate(`/quiz/${i + 1}`);
                                }}
                                index={i + 1}
                            />
                        })}
                    </div>
                    <Button modifiedClass='border-2 px-5 box-border border-[#27272A]/70 w-fit flex items-center hover:border-white/30 rounded-xl' onClick={() => undoAnswer(id!)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16699 11.6667C4.94586 10.9032 5.99302 10.4756 7.08366 10.4756C8.1743 10.4756 9.22146 10.9032 10.0003 11.6667C10.7792 12.4301 11.8264 12.8577 12.917 12.8577C14.0076 12.8577 15.0548 12.4301 15.8337 11.6667V4.16666C15.0548 4.9301 14.0076 5.35773 12.917 5.35773C11.8264 5.35773 10.7792 4.9301 10.0003 4.16666C9.22146 3.40321 8.1743 2.97559 7.08366 2.97559C5.99302 2.97559 4.94586 3.40321 4.16699 4.16666V11.6667ZM4.16699 11.6667V17.5" stroke="#717171" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Reset</Button>
                </div>
            </div>
        </div>
    );
}
export default Quiz;