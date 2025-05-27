import React, { createContext, useContext, useEffect, useState } from 'react';
import QuizModel from '../models/quiz.model';

interface QuizContextType {
    quizzes: QuizModel[] | null;
    setQuizzes: React.Dispatch<React.SetStateAction<QuizModel[] | null>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
    children: React.ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
    const [quizzes, setQuizzes] = useState<QuizModel[] | null>(null);

    useEffect(() => {
        const storedQuizzes = localStorage.getItem('quizzes');
        if (storedQuizzes) {
            try {
                const quizzesRaw: object[] = JSON.parse(storedQuizzes);
                const quizModels: QuizModel[] = quizzesRaw as QuizModel[];
                setQuizzes(quizModels);
            } catch (e) {
                console.error('Error while parsing quizzes:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (quizzes) {
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
        } else {
            localStorage.removeItem('quizzes');
        }
    }, [quizzes]);

    return (
        <QuizContext.Provider value={{ quizzes, setQuizzes }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = (): QuizContextType => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used inside QuizProvider');
    }
    return context;
};
