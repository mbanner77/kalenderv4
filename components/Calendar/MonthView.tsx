"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface MonthViewProps {
  date: Date;
}

export function MonthView({ date }: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
        <div key={day} className="p-2 text-center font-semibold">
          {day}
        </div>
      ))}
      {days.map(day => (
        <div 
          key={day.toISOString()}
          className="p-2 border rounded min-h-[100px] hover:bg-gray-50"
        >
          <span className="text-sm">{format(day, 'd')}</span>
        </div>
      ))}
    </div>
  );
}