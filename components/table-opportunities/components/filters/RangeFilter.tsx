// components/filters/RangeFilter.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  column: string;
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  openPopover: Record<string, boolean>;
  setOpenPopover: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const RangeFilter = (props: Props) => {
  const { column, min, max, onChange, openPopover, setOpenPopover } = props;
  const [localMin, setLocalMin] = useState<string>(min?.toString() || "");
  const [localMax, setLocalMax] = useState<string>(max?.toString() || "");
  const isFilterActive = min !== null || max !== null;

  useEffect(() => {
    setLocalMin(min?.toString() || "");
    setLocalMax(max?.toString() || "");
  }, [min, max]);

  const parseFormattedNumber = (value: string): number => {
    return Number(value.replace(/\./g, "").replace(",", "."));
  };

  const handleApply = () => {
    const minValue = localMin ? parseFormattedNumber(localMin) : null;
    const maxValue = localMax ? parseFormattedNumber(localMax) : null;

    onChange(minValue, maxValue);
    setOpenPopover((prev) => ({ ...prev, [column]: false }));
  };

  const formatNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Popover
      open={openPopover[column]}
      onOpenChange={(open) => {
        setOpenPopover((prev) => ({ ...prev, [column]: open }));
        if (!open) {
          setLocalMin(min?.toString() || "");
          setLocalMax(max?.toString() || "");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Filter
          className={cn(
            "transition-colors",
            isFilterActive ? 
              "text-blue-500 fill-blue-500" : 
              "text-muted-foreground"
          )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="start">
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label>Mínimo</Label>
            <Input
              type="text"
              value={localMin}
              onChange={(e) => {
                const formatted = formatNumber(e.target.value);
                setLocalMin(formatted);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="grid gap-2">
            <Label>Máximo</Label>
            <Input
              type="text"
              value={localMax}
              onChange={(e) => {
                const formatted = formatNumber(e.target.value);
                setLocalMax(formatted);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleApply} className="text-blue-500">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
