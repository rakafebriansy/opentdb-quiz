import React, { type MouseEventHandler } from 'react'

interface NavButtonProps {
    index: number;
    selected: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
}
const NavButton: React.FC<NavButtonProps> = ({ index, onClick, selected }) => {

    return (
        <button onClick={onClick} className={`w-10 h-10 cursor-pointer active:bg-[#AC63E6]/30 flex justify-center items-center rounded-lg border border-white/15 ${selected ? 'outline-[#7C3AED] bg-[#AC63E6]/40 outline-2' : 'hover:outline-[#7C3AED] hover:bg-[#AC63E6]/20 hover:outline-1'}`}>{index}</button>
    );
}
export default NavButton;