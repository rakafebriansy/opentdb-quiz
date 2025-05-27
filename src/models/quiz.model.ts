import type { QuizTypeEnum } from "../enums/quiz-type.enum";
import shuffle from 'lodash/shuffle';

export interface UserAnswer {
    answer: string;
    letterIndex: number;
    isCorrect: boolean;
}

class QuizModel {
    category: string;
    incorrectAnswers: string[];
    correctAnswer: string;
    allAnswers: string[];
    difficulty: string;
    question: string;
    type: QuizTypeEnum;
    userAnswer?: UserAnswer;
    
    constructor(
        category: string,
        incorrectAnswers: string[],
        correctAnswer: string,
        allAnswers: string[],
        difficulty: string,
        question: string,
        type: QuizTypeEnum,
        userAnswer?: UserAnswer
    ) {
        this.category = category;
        this.incorrectAnswers = incorrectAnswers;
        this.correctAnswer = correctAnswer;
        this.allAnswers = allAnswers;
        this.difficulty = difficulty;
        this.question = question;
        this.type = type;
        this.userAnswer = userAnswer;
    }

    static jsonToQuiz(quiz: any): QuizModel {
        const allAnswers = shuffle([...quiz.incorrect_answers, quiz.correct_answer]);

        return new QuizModel(
            quiz.category,
            quiz.incorrect_answers,
            quiz.correct_answer,
            allAnswers,
            quiz.difficulty,
            quiz.question,
            quiz.type as QuizTypeEnum,
            quiz.userAnswer
        );
    }

    static jsonToQuizList(quizList: any): QuizModel[] {
        return quizList.map((item: any) => QuizModel.jsonToQuiz(item));
    }
}

export default QuizModel