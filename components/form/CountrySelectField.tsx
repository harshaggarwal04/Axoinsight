/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import countryList from 'react-select-country-list';

type CountrySelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: FieldError;
  required?: boolean;
};

const CountrySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const countries = countryList().getData();

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const selected = countries.find((c) => c.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="
                        w-full h-12 px-4 flex items-center justify-between
                        bg-gray-900 border border-gray-700
                        text-gray-200 text-sm font-medium
                        rounded-lg
                        hover:bg-gray-800 hover:border-gray-600
                        focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500
                        transition-all duration-200
                    "
        >
          {value ? (
            <span className="flex items-center gap-2">
              <span>{getFlagEmoji(value)}</span>
              <span>{selected?.label}</span>
            </span>
          ) : (
            <span className="text-gray-500">Select your country...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="
                    w-full p-0
                    bg-gray-900 border border-gray-700
                    rounded-lg shadow-xl
                "
        align="start"
      >
        <Command className="bg-gray-900 text-gray-200">
          <CommandInput
            placeholder="Search countries..."
            className="
                            h-11 px-3
                            bg-transparent border-b border-gray-700
                            text-gray-200 placeholder:text-gray-500
                            focus:outline-none focus:ring-0
                        "
          />

          <CommandEmpty className="py-6 text-center text-sm text-gray-500">
            No country found.
          </CommandEmpty>

          <CommandList className="max-h-60 overflow-y-auto scrollbar-hide-default">
            <CommandGroup className="p-1">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="
                                        flex items-center gap-2 px-3 py-2 rounded-md
                                        cursor-pointer
                                        hover:bg-gray-800
                                        data-[selected=true]:bg-gray-800
                                        transition-all duration-150
                                    "
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-green-400",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <span>{getFlagEmoji(country.value)}</span>
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CountrySelectField = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps<T>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm text-gray-300">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect value={field.value || ""} onChange={field.onChange} />
        )}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <p className="text-xs text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
};

export default CountrySelectField;