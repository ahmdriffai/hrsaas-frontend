import clsx from 'clsx';
import { useState } from 'react';

type Props = {
    label?: string;
    value: string;
    onChange: (val: string) => void;
    maxLength?: number;
    placeholder?: string;
};

export default function Textarea({ label, value, onChange, maxLength = 500, placeholder }: Props) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full space-y-2">
            {label && <p className="text-lg font-semibold text-gray-800">{label}</p>}

            <div
                className={clsx('rounded-2xl border p-4 transition-all', {
                    'border-gray-300': !isFocused,
                    'border-black': isFocused,
                })}
            >
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    rows={6}
                    className="w-full resize-none bg-transparent text-base outline-none placeholder:text-gray-400"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>

            {/* Counter */}
            <div className="text-sm text-gray-500">
                {value.length}/{maxLength}
            </div>
        </div>
    );
}
