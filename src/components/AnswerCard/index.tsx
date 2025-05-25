import React from 'react'
import he from 'he';

interface AnswerCardProps {
    answer: string;
    index: number;
}
const AnswerCard: React.FC<AnswerCardProps> = ({ answer, index }) => {
    return (
        <div className="bg-[#27272A]/70 p-4 rounded-lg border-white/15 border flex gap-4">
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