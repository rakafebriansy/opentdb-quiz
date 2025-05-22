import { ValidationErrorEnum } from "../enums/validation-error.enum";

const validationErrorMessages: Record<ValidationErrorEnum, string> = {
    [ValidationErrorEnum.REQUIRED]: '{field} cannot be null',
    [ValidationErrorEnum.EMAIL]: 'Invalid email',
    [ValidationErrorEnum.MINCHAR]: '{field} must be at least {value} characters',
};

export default class ValidationHelper {
    static setErrorMessage(validationErrorEnum: ValidationErrorEnum, fieldName: string, value?: any): string {
        const template = validationErrorMessages[validationErrorEnum];
        return template
            .replace('{field}', fieldName)
            .replace('{value}', value?.toString() ?? 'N/A');
    }
}