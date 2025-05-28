import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import type { UserModel } from '../../models/user.model';
import { fetchQuizFromApi } from '../../repositories';
import { refreshUser } from '../../services';
import QuizModel from '../../models/quiz.model';
import Button from '../Button';
import { useEffect, useState } from 'react';

const ResumeModal: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, isResumed, setIsResumed } = useAuth();
  const { setQuizzes } = useQuiz();
  const [isResume, setIsResume] = useState<boolean>(false);

  useEffect(() => {
    if (isResumed && user?.sessionStarted) {
      setIsResume(true);
    }
  }, [isResumed, user]);

  const handleContinue = () => {
    const userModel = JSON.parse(localStorage.getItem('user')!) as UserModel;
    setUser(userModel);
    navigate(`/quiz/${userModel.currentQuizIndex}`);
    setIsResume(false);
    setIsResumed(false);
  };

  const handleRestart = async () => {
    try {
      const quizzesRaw: object[] = await fetchQuizFromApi(20);
      const newUser: UserModel = await refreshUser();

      setQuizzes(QuizModel.jsonToQuizList(quizzesRaw));
      setUser(newUser);

      navigate(`/quiz/${newUser.currentQuizIndex}`);
      setIsResume(false);
      setIsResumed(false);
    } catch (e) {
      console.error('Failed to play again:', e);
    }
  };

  if (!isResume) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 text-black">
      <div className="p-6 text-center bg-white rounded-2xl  shadow-xl px-6 py-4 w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">Continue the Quiz?</h2>
        <p className="mb-6">We detected a previous session. Would you like to continue or start over?</p>
        <div className="flex justify-between">
          <Button modifiedClass="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 outline-none text-white rounded-xl" onClick={handleContinue}>Continue</Button>
          <Button modifiedClass="px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 outline-none text-white rounded-xl" onClick={handleRestart}>Restart</Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
