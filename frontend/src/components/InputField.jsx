import React from 'react'
import { User } from "lucide-react";
const InputField = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    Icon
}) => {
    return (
        <div>
            <label htmlFor={id} className='block text-sm font-medium text-gray-300'>
                {label}
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Icon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                    id={id}
                    type={type}
                    required
                    value={value  ?? ""}
                    onChange={onChange}
                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                                     placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}

export default InputField  