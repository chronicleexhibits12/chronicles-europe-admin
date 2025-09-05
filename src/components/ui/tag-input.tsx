import { useState, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ tags = [], onChange, placeholder = 'Type and press Enter to add keywords...', className = '' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onChange([...tags, tag.trim()])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      e.preventDefault()
      removeTag(tags[tags.length - 1])
    } else if (e.key === ',' || e.key === ';') {
      // Allow comma or semicolon as separators
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    }
  }

  const handleBlur = () => {
    // Add tag when input loses focus and has content
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  return (
    <div className={`border rounded-md p-2 min-h-[40px] ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              type="button"
              className="ml-2 rounded-full hover:bg-blue-200 focus:outline-none"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 border-0 p-0 focus-visible:ring-0 min-w-[120px]"
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Press Enter, comma, or semicolon to add keywords. Backspace to remove last keyword.
      </div>
    </div>
  )
}