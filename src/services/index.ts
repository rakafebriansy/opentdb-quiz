import { EMAIL, PASSWORD, QUIZ_DURATION } from "../constants";
import QuizModel from "../models/quiz.model";
import type { UserModel } from "../models/user.model";
import type { LoginRequest } from "../requests"
import { loginSchema } from "../validations";

export const login = async (request: LoginRequest): Promise<UserModel> => {
    const data: LoginRequest = loginSchema.parse(request);

    if (data.email !== EMAIL || data.password !== PASSWORD) {
        localStorage.removeItem('user');
        throw new Error('Invalid credentials');
    }

    const userModel = { email: data.email, currentQuizIndex: 1, answers: [], currentProgress: 0, endAt: Date.now() + QUIZ_DURATION } as UserModel;
    return userModel;
}

export const findQuiz = (quizzes: QuizModel[], currentIndex: number): QuizModel | undefined => {
    const quiz: QuizModel | undefined = quizzes.find((_, i) => i == currentIndex - 1);
    return quiz;
}

export const refreshUser = async (): Promise<UserModel> => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        throw Error('There\'s no user stored');
    }
    const user = JSON.parse(storedUser) as UserModel;
    const newUser = { email: user.email, currentQuizIndex: 1, answers: [], currentProgress: 0, endAt: Date.now() + QUIZ_DURATION } as UserModel;
    return newUser;
}