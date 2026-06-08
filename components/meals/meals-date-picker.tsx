"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  addDays,
  formatDateLabel,
  formatShortDate,
  isToday,
} from "@/lib/meals/dates";
import { cn } from "@/lib/utils";
import { MealsCalendar } from "@/components/meals/meals-calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MealsDatePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  className?: string;
}

export function MealsDatePicker({
  selectedDate,
  onSelectDate,
  className,
}: MealsDatePickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  function handleSelectDate(date: Date) {
    onSelectDate(date);
    setCalendarOpen(false);
  }

  return (
    <>
      <div
        className={cn(
          "surface-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Dia anterior"
            onClick={() => onSelectDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 sm:max-w-md">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Data selecionada
              </p>
              <p className="truncate text-sm font-semibold capitalize">
                {isToday(selectedDate) ? "Hoje" : formatShortDate(selectedDate)}
                {!isToday(selectedDate) ? (
                  <span className="font-normal text-muted-foreground">
                    {" · "}
                    {formatDateLabel(selectedDate)}
                  </span>
                ) : null}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Abrir calendário"
              aria-expanded={calendarOpen}
              onClick={() => setCalendarOpen(true)}
            >
              <CalendarDays className="size-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Próximo dia"
            disabled={isToday(selectedDate)}
            onClick={() => onSelectDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          disabled={isToday(selectedDate)}
          onClick={() => onSelectDate(new Date())}
        >
          Ir para hoje
        </Button>
      </div>

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Escolher data</DialogTitle>
            <DialogDescription>
              Selecione um dia para ver as refeições registradas.
            </DialogDescription>
          </DialogHeader>
          <MealsCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            className="border-0 p-0 shadow-none"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
