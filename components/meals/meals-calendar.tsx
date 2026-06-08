"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  formatMonthYear,
  getCalendarDays,
  isFutureDate,
  isSameDay,
  isToday,
  startOfMonth,
} from "@/lib/meals/dates";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

interface MealsCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  className?: string;
}

export function MealsCalendar({
  selectedDate,
  onSelectDate,
  className,
}: MealsCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectedDate),
  );

  useEffect(() => {
    setVisibleMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );

  function handleSelectDay(day: Date) {
    if (isFutureDate(day)) return;
    onSelectDate(day);
    setVisibleMonth(startOfMonth(day));
  }

  function goToPreviousMonth() {
    setVisibleMonth((current) => addMonths(current, -1));
  }

  function goToNextMonth() {
    setVisibleMonth((current) => addMonths(current, 1));
  }

  const nextMonthIsFuture =
    startOfMonth(addMonths(visibleMonth, 1)).getTime() >
    startOfMonth(new Date()).getTime();

  return (
    <div className={cn("surface-card p-4", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Mês anterior"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <p className="text-sm font-semibold capitalize">
          {formatMonthYear(visibleMonth)}
        </p>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Próximo mês"
          disabled={nextMonthIsFuture}
          onClick={goToNextMonth}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            {label}
          </span>
        ))}

        {calendarDays.map((day) => {
          const inCurrentMonth = day.getMonth() === visibleMonth.getMonth();
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const future = isFutureDate(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={future}
              aria-label={day.toLocaleDateString("pt-BR")}
              aria-pressed={selected}
              onClick={() => handleSelectDay(day)}
              className={cn(
                "action-link flex size-9 items-center justify-center rounded-lg text-sm tabular-nums transition-colors",
                !inCurrentMonth && "text-muted-foreground/50",
                inCurrentMonth && !selected && !future && "hover:bg-muted",
                today && !selected && "ring-1 ring-primary/30",
                selected &&
                  "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                future && "cursor-not-allowed opacity-40",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
