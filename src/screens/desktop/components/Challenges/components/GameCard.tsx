import React, { useState } from 'react';

export default function GameCard({ className }:{className: string}) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div onClick={handleCheckboxChange} className={`${className} bg-[#363636] h-36 relative rounded flex`}>
            <label className="inline-flex items-center justify-center w-6 h-6 ml-2 mt-2 relative">
                <input 
                    type="checkbox" 
                    className="sr-only" // Hide checkbox visually but remain accessible
                    checked={isChecked}
                />

                {/* Custom Checkbox */}
                <div className={`w-5 h-5 absolute border bg-[#363636] border-gray-300`}>
                    {/* Checkmark Icon */}
                    {isChecked && (
                        <svg className="fill-current absolute -top-[2px] text-white h-5 w-5 pointer-events-none" viewBox="0 0 20 20">
                            <path d="M7.629 14.571L3.357 10.3a1 1 0 00-1.414 1.414l4.95 4.95a1 1 0 001.414 0l8.607-8.607a1 1 0 10-1.414-1.414L7.629 14.571z" />
                        </svg>
                    )}
                </div>
            </label>
            <img src='/images/image 95.png' className='absolute bottom-0 right-0' alt=''/>
        </div>
    );
}