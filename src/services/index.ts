import { EMAIL, PASSWORD } from "../constants";
import type { LoginRequest } from "../requests"
import { loginSchema } from "../validations";

export const login = (request: LoginRequest): void => {
    const data: LoginRequest = loginSchema.parse(request);

    if (data.email !== EMAIL || data.password !== PASSWORD) {
        throw new Error('Invalid credentials');
    }

    localStorage.setItem("user", JSON.stringify({ email: data.email }));
}