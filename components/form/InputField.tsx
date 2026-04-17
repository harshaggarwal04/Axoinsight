import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

const InputField = ({name, label, placeholder, type = "text" , register, error, validation, disabled, value} : FormInputProps) => {
  return (
    <div className="space-y-2">
  <Label htmlFor={name} className="text-sm font-medium text-gray-300">
    {label}
  </Label>

  <Input
    type={type}
    id={name}
    placeholder={placeholder}
    disabled={disabled}
    value={value}
    className={cn(
      // base
      "w-full rounded-xl border border-gray-700 bg-gray-950 text-gray-200 placeholder:text-gray-500",

      // responsive sizing
      "h-10 sm:h-11 md:h-12",
      "text-sm sm:text-base",

      // interactions
      "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
      "hover:border-green-400/50 transition-all duration-200",

      // states
      {
        "opacity-50 cursor-not-allowed bg-gray-900": disabled,
        "border-red-500 focus:ring-red-500 focus:border-red-500": error,
      }
    )}
    {...register(name, validation)}
  />

  {error && (
    <p className="text-sm text-red-400 mt-1">
      {error.message}
    </p>
  )}
</div>
  )
}

export default InputField