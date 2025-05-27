import React from 'react'
import { Link } from 'react-router-dom';

interface ButtonLinkProps {
    children: React.ReactNode;
    modifiedClass?: string;
    link: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, modifiedClass, link }) => {

    return (
        <Link to={link} className={`rounded-xl py-2 gap-2 cursor-pointer active:scale-95 transition transform duration-100 ${modifiedClass}`}>{children}</Link>
    );
}
export default ButtonLink;