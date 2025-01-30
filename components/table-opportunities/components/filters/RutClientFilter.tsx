import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/interfaces/table-settings/filter-state-table.interface";

interface Props {
  filterState: FilterState;
  setFilterState: (value: React.SetStateAction<FilterState>) => void;
  inputRut: boolean;
  setInputRut: (value: React.SetStateAction<boolean>) => void;
}

function RutClientFilter({
  filterState,
  setFilterState,
  inputRut,
  setInputRut,
}: Props) {
  return (
    <>
      {inputRut ? (
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm pr-8 ml-2 w-full fade-in"
            placeholder="Buscar RUT"
            value={filterState.rut}
            onChange={(e) =>
              setFilterState((prev) => ({
                ...prev,
                rut: e.target.value,
              }))
            }
          />
          <button
            className="absolute right-2 text-gray-500 hover:text-gray-800"
            onClick={() => {
              setFilterState((prev) => ({
                ...prev,
                rut: "",
              }));
              setInputRut(false);
            }}
          >
            X
          </button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInputRut(true)}
        >
          <Filter className="text-muted-foreground" />
        </Button>
      )}
    </>
  );
}

export default RutClientFilter;