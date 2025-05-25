export const QuizTypeEnum = {
    MULTIPLE: 1,
    BOOLEAN: 2,
} as const;

export type QuizTypeEnum = typeof QuizTypeEnum[keyof typeof QuizTypeEnum];