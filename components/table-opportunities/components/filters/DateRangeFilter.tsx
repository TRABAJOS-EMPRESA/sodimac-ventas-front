// components/filters/DateRangeFilter.tsx
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

export interface PopoverState {
  [key: string]: boolean;
}

interface Props {
  column: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  title: string;
  openPopover: PopoverState;
  setOpenPopover: React.Dispatch<React.SetStateAction<PopoverState>>;
}

export const DateRangeFilter = (props: Props) => {
  const {
    column,
    startDate,
    endDate,
    onChange,
    title,
    openPopover,
    setOpenPopover,
  } = props;
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Popover
      open={openPopover[column] || false}
      onOpenChange={(open) =>
        setOpenPopover((prev) => ({ ...prev, [column]: open }))
      }
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Filter
            className={
              startDate !== null || endDate !== null
                ? "text-primary"
                : "text-muted-foreground"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{title}</h4>
            <div className="text-sm text-muted-foreground">
              {startDate && <p>Desde: {formatDate(startDate)}</p>}
              {endDate && <p>Hasta: {formatDate(endDate)}</p>}
            </div>
          </div>

          <Calendar
            mode="range"
            selected={{
              from: startDate || undefined,
              to: endDate || undefined,
            }}
            onSelect={(range) => {
              onChange(range?.from || null, range?.to || null);
            }}
            className="rounded-md border"
          />

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onChange(null, null);
                setOpenPopover((prev) => ({ ...prev, [column]: false }));
              }}
              className="text-red-500"
            >
              Limpiar
            </Button>
            <Button
              onClick={() => {
                setOpenPopover((prev) => ({ ...prev, [column]: false }));
              }}
              className="text-blue-500"
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
