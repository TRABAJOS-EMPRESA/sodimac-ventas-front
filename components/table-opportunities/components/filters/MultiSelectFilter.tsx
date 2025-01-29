// components/filters/MultiSelectFilter.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  column: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  openPopover: Record<string, boolean>;
  setOpenPopover: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const MultiSelectFilter = (props: Props) => {
  const { column, options, values, onChange, openPopover, setOpenPopover } =
    props;
  const [localValues, setLocalValues] = useState<string[]>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleApply = () => {
    onChange(localValues);
    setOpenPopover((prev) => ({ ...prev, [column]: false }));
  };

  return (
    <Popover
      open={openPopover[column]}
      onOpenChange={(open) =>
        setOpenPopover((prev) => ({ ...prev, [column]: open }))
      }
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Filter
            className={
              values.length > 0 ? "text-primary" : "text-muted-foreground"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="start">
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                checked={localValues.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setLocalValues([...localValues, option]);
                  } else {
                    setLocalValues(
                      localValues.filter((value) => value !== option)
                    );
                  }
                }}
              />
              <Label className="text-sm">{option}</Label>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setLocalValues([]);
              onChange([]);
              setOpenPopover((prev) => ({ ...prev, [column]: false }));
            }}
            className="text-red-500"
          >
            Limpiar
          </Button>
          <Button onClick={handleApply} className="text-blue-500">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
