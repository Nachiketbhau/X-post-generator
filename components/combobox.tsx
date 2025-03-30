"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ComboboxItem = {
  value: string
  label: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Combobox({ items, value, onChange, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue)
    setOpen(false)
  }

  // Filter items based on input value
  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
        >
          {value || placeholder || "Select an option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700">
        <Command className="bg-gray-900">
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            onInput={handleInputChange}
            className="h-9 bg-gray-900 text-white"
          />
          <CommandList className="bg-gray-900 text-white">
            <CommandEmpty className="text-gray-400">No matching topics found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                  className="aria-selected:bg-gray-800 text-gray-300"
                >
                  <Check
                    className={cn("mr-2 h-4 w-4 text-blue-500", value === item.value ? "opacity-100" : "opacity-0")}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

