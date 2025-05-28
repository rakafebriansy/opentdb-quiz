export interface UserModel {
    email: string;
    currentQuizIndex: number;
    currentProgress: number;
    sessionStarted: boolean;
    endAt: number;
    score?: number;
}