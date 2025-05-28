import React, { type MouseEventHandler } from 'react'

interface ButtonProps {
    children: React.ReactNode;
    modifiedClass?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ children, modifiedClass, onClick }) => {

    return (
        <button onClick={onClick} className={`py-2 gap-2 cursor-pointer active:scale-95 transition transform duration-100 ${modifiedClass}`}>{children}</button>
    );
}
export default Button;