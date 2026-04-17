import React from 'react'
import { Label } from '../ui/label'
import { Controller } from 'react-hook-form'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectField = ({ name, label, placeholder, options, control, error, required = false }: SelectFieldProps) => {
    return (
        <div className="space-y-2">
            <Label
                htmlFor={name}
                className="text-sm font-medium text-gray-300"
            >
                {label}
            </Label>

            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `Please select ${label.toLowerCase()}` : false,
                }}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>

                        {/* Trigger */}
                        <SelectTrigger
                            className="h-11 w-full rounded-xl border border-gray-700 bg-gray-900 text-gray-200 
          placeholder:text-gray-500 
          focus:ring-2 focus:ring-green-500 focus:border-green-500 
          transition-all duration-200"
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>

                        {/* Dropdown */}
                        <SelectContent
                            className="rounded-xl border border-gray-700 bg-gray-900 text-gray-200 shadow-xl"
                        >
                            <SelectGroup>
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="cursor-pointer rounded-md px-3 py-2 
                focus:bg-green-500/20 focus:text-green-400 
                hover:bg-gray-800 transition-colors"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />

            {/* Error */}
            {error && (
                <p className="text-sm text-red-400 mt-1">
                    {error.message}
                </p>
            )}
        </div>
    )
}

export default SelectField