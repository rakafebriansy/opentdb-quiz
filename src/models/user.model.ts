export interface UserModel {
    email: string;
    currentQuizIndex: number;
    currentProgress: number;
    endAt: number;
    score?: number;
}