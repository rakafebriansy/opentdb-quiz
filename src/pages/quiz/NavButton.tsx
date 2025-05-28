import React, { type MouseEventHandler } from 'react'

interface NavButtonProps {
    index: number;
    selected: boolean;
    answered: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
}
const NavButton: React.FC<NavButtonProps> = ({ index, onClick, selected, answered }) => {

    return (
        <button onClick={onClick} className={`w-10 h-10 cursor-pointer ${answered && !selected ? 'active:bg-[#32CD32]/30': 'active:bg-[#AC63E6]/30'} flex justify-center items-center rounded-lg border border-white/15 ${selected ? 'outline-[#7C3AED] bg-[#AC63E6]/40 outline-2' : answered ? 'outline-[#6BBF59] bg-[#32CD32]/40 outline-2' : 'hover:outline-[#7C3AED] hover:bg-[#AC63E6]/20 hover:outline-1'}`}>{index}</button>
    );
}
export default NavButton;