import type { QuizTypeEnum } from "../enums/quiz-type.enum";
import shuffle from 'lodash/shuffle';

class QuizModel {
    category: string;
    incorrectAnswers: string[];
    correctAnswer: string;
    allAnswers: string[];
    difficulty: string;
    question: string;
    type: QuizTypeEnum;

    constructor(
        category: string,
        incorrectAnswers: string[],
        correctAnswer: string,
        allAnswers: string[],
        difficulty: string,
        question: string,
        type: QuizTypeEnum
    ) {
        this.category = category;
        this.incorrectAnswers = incorrectAnswers;
        this.correctAnswer = correctAnswer;
        this.allAnswers = allAnswers;
        this.difficulty = difficulty;
        this.question = question;
        this.type = type;
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
            quiz.type as QuizTypeEnum
        );
    }

    static jsonToQuizList(quizList: any): QuizModel[] {
        return quizList.map((item: any) => QuizModel.jsonToQuiz(item));
    }
}


export default QuizModel