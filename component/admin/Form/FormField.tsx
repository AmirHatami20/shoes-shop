import React from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

export default function FormField(
    {
        label,
        name,
        type = 'text',
        value,
        placeholder,
        onChange,
        error,
        required,
    }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="admin-input"
                autoComplete="new-password"
            />
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
}
