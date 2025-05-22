import { z } from 'zod';
import { ValidationErrorEnum as Type } from '../enums/validation-error.enum';
import VEMH from '../helpers/validation.helper';

export const loginSchema = z.object({
  email: z.string().email(VEMH.setErrorMessage(Type.EMAIL, 'Email')),
  password: z.string().min(6, VEMH.setErrorMessage(Type.MINCHAR, 'Password', 6),),
});