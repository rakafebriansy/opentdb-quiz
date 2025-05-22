import React from 'react'

interface TextInputProps {
    title: string;
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}
const TextInput: React.FC<TextInputProps> = ({ title, icon, placeholder, value, onChange }) => {
    const id = title.toLowerCase();
    return (
        <div className="flex flex-col justify-start">
            <label htmlFor={id} className='font-medium'>{title}</label>
            <div className="flex border-slate-300 hover:border-slate-400 border-2 rounded-md px-3 py-2 gap-2 items-center mt-2 text-lg">
                {icon}
                <input value={value} onChange={(e) => onChange(e.target.value)} type="text" name={id} id={id} placeholder={placeholder} className='w-full outline-none text-base' />
            </div>
        </div>
    );
}
export default TextInput;