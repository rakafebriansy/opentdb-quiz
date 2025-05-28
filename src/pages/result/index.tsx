import React from 'react'
import ResultPattern from '../../assets/images/result-pattern.png'
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { refreshUser } from '../../services';
import type { UserModel } from '../../models/user.model';
import QuizModel from '../../models/quiz.model';
import { fetchQuizFromApi } from '../../repositories';


const Result: React.FC = ({ }) => {
    const { user, setUser } = useAuth();
    const { setQuizzes } = useQuiz();
    const navigate = useNavigate();

    const attemptLogout = (): void => {
        setUser(null);
        setQuizzes(null);
        navigate('/login');
    }

    const attemptPlayAgain = async (): Promise<void> => {
        try {
            const quizzesRaw: object[] = await fetchQuizFromApi(20);
            const newUser: UserModel = await refreshUser();

            setQuizzes(QuizModel.jsonToQuizList(quizzesRaw));
            setUser(newUser);
            
            navigate(`/quiz/${newUser.currentQuizIndex}`)
        } catch (e) {
            console.error('Failed to play again:', e);
        }
    }

    return (
        <div className="w-screen h-screen relative flex justify-center items-center">
            <div className="absolute inset-0">
                <img src={ResultPattern} alt="result-pattern" className='w-full h-full object-fill' />
            </div>
            <div className="z-10 flex flex-col gap-4 w-1/2 items-center">
                <h1 className='text-4xl'>Your score is</h1>
                <h1 className='text-6xl font-[Alata] bg-[linear-gradient(to_right,_#F09FFD_36%,_#1494F1_100%)] bg-clip-text text-transparent font-bold'>{user!.score ?? '-'}</h1>
                <div className="relative flex items-center w-3/4">
                    <div className="w-1 h-1 bg-[#A6AAB2] rounded-full"></div>
                    <div className="flex-grow h-px bg-[#A6AAB2]"></div>
                    <div className="w-1 h-1 bg-[#A6AAB2] rounded-full"></div>
                </div>
                <p className='text-center text-[#A6AAB2] text-sm'>Where Every Question Unveils a World of Wisdom, Sparking the Flames of Learning and Illuminating the Path to Intellectual Brilliance!"</p>
                <div className="flex gap-6 font-medium">
                    <Button modifiedClass='border-purple-600 border-[#1494F1] w-32 border-2 text-white hover:bg-white/10 text-purple-600 px-5 rounded-full' onClick={attemptLogout}>Logout</Button>
                    <Button modifiedClass='w-32 box-border px-5 rounded-full shadow-[0_0_1rem_#0A7CFF] bg-[linear-gradient(to_right,_#F09FFD_0%,_#1494F1_100%)] hover:bg-purple-700 hover:shadow-[0_0_1.5rem_#8B5CF6]' onClick={attemptPlayAgain}>Play Again</Button>
                </div>
            </div>
        </div>
    );
}
export default Result;