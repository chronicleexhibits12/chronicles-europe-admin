import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Select date', className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize with the selected date or today
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setCurrentDate(date);
      }
    }
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => handleMonthChange('prev')}
        className="h-7 w-7"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-sm font-medium">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => handleMonthChange('next')}
        className="h-7 w-7"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isSelected = value && isSameDay(day, new Date(value));
        
        days.push(
          <div
            key={day.toString()}
            className={`p-1 text-center text-sm cursor-pointer rounded-md hover:bg-accent ${
              isSelected 
                ? 'bg-primary text-primary-foreground' 
                : isCurrentMonth 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
            }`}
            onClick={() => handleDateSelect(day)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  const displayValue = value ? format(new Date(value), 'PPP') : placeholder;

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="mr-2 h-4 w-4" />
        <span>{displayValue}</span>
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 rounded-md border bg-popover p-3 text-popover-foreground shadow-md w-[280px]">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div className="pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
              }}
            >
              Today
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}