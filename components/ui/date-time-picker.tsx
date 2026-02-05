"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Time states
  const [hours, setHours] = React.useState(date ? format(date, "HH") : "12");
  const [minutes, setMinutes] = React.useState(
    date ? format(date, "mm") : "00",
  );

  // Update time when date changes externally
  React.useEffect(() => {
    if (date) {
      setHours(format(date, "HH"));
      setMinutes(format(date, "mm"));
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Combine selected date with current time
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours) || 0);
      newDate.setMinutes(parseInt(minutes) || 0);
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours) || 0;
    const m = parseInt(newMinutes) || 0;

    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      setHours(newHours.padStart(2, "0"));
      setMinutes(newMinutes.padStart(2, "0"));

      if (date) {
        const newDate = new Date(date);
        newDate.setHours(h);
        newDate.setMinutes(m);
        setDate(newDate);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP 'at' HH:mm")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="border-t pt-3 space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (parseInt(value) >= 0 && parseInt(value) <= 23)
                    ) {
                      handleTimeChange(value, minutes);
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    handleTimeChange(value.padStart(2, "0"), minutes);
                  }}
                  className="text-center"
                  placeholder="HH"
                />
              </div>
              <span className="text-xl font-semibold">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (parseInt(value) >= 0 && parseInt(value) <= 59)
                    ) {
                      handleTimeChange(hours, value);
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    handleTimeChange(hours, value.padStart(2, "0"));
                  }}
                  className="text-center"
                  placeholder="MM"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              24-hour format
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setDate(undefined);
                setIsOpen(false);
              }}
            >
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
