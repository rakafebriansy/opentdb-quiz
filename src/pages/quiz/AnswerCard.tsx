import React, { type MouseEventHandler } from 'react'
import he from 'he';

interface AnswerCardProps {
    answer: string;
    index: number;
    selected: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
}
const AnswerCard: React.FC<AnswerCardProps> = ({ answer, index, onClick, selected }) => {
    return (
        <div onClick={onClick} className={`bg-[#27272A]/70 p-4 rounded-lg border-white/15 active:bg-[#AC63E6]/30 border flex gap-4 cursor-pointer ${selected ? 'outline-[#7C3AED] bg-[#AC63E6]/40 outline-2' : 'hover:outline-[#7C3AED] hover:bg-[#AC63E6]/20 hover:outline-1'}`}>
            <div className="flex items-center">
                <div className="rounded-full bg-[#27272A]/70 w-6 h-6 flex justify-center items-center">
                    <p className='text-xs'>{String.fromCharCode(65 + index)}</p>
                </div>
            </div>
            <div className="">
                <h2 className='text-sm'>{he.decode(answer)}</h2>
            </div>
        </div>
    );
}
export default AnswerCard;