export const ValidationErrorEnum = {
    REQUIRED: 1,
    EMAIL: 2,
    MINCHAR: 3,
} as const;

export type ValidationErrorEnum = typeof ValidationErrorEnum[keyof typeof ValidationErrorEnum];