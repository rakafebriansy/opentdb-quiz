import { EMAIL, PASSWORD } from "../constants";
import QuizModel from "../models/quiz.model";
import type { UserModel } from "../models/user.model";
import { fetchQuizFromApi } from "../repositories";
import type { LoginRequest } from "../requests"
import { loginSchema } from "../validations";

export const login = async (request: LoginRequest): Promise<UserModel> => {
    const data: LoginRequest = loginSchema.parse(request);

    if (data.email !== EMAIL || data.password !== PASSWORD) {
        localStorage.removeItem('user');
        throw new Error('Invalid credentials');
    }

    const userModel = {email: data.email, currentQuizIndex: 1} as UserModel;
    const quizzes: object[] = await fetchQuizFromApi(20);
    localStorage.setItem('user', JSON.stringify(userModel));
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    return userModel;
}

export const getStoredQuiz = (): QuizModel[] => {
    try {
        const quizzes = JSON.parse(localStorage.getItem('quizzes')!);
        const quizModels: QuizModel[] = QuizModel.jsonToQuizList(quizzes);
        return quizModels;
    } catch (e) {
        throw new Error('There\'s no quiz stored');
    }
}

export const getSingleQuiz = (index: number): QuizModel | undefined => {
    const quizModels: QuizModel[] = getStoredQuiz();
    const quizModel: QuizModel | undefined = quizModels.find((_, i) => i == index - 1)
    return quizModel;
}