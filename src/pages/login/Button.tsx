import React from 'react'

interface ButtonProps {
    children: React.ReactNode;
    modifiedClass: string;
}

const Button: React.FC<ButtonProps> = ({ children, modifiedClass }) => {

    return (
        <button className={`w-full rounded-xl py-2 gap-2 cursor-pointer ${modifiedClass}`}>{children}</button>
    );
}
export default Button;