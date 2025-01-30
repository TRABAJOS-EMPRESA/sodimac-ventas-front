import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/interfaces/table-settings/filter-state-table.interface";
import { cn } from "@/lib/utils"; 

interface Props {
  filterState: FilterState;
  setFilterState: (value: React.SetStateAction<FilterState>) => void;
  inputOppPadre: boolean;
  setInputOppPadre: (value: React.SetStateAction<boolean>) => void;
}

function OpportunityParentFilter({
  filterState,
  setFilterState,
  inputOppPadre,
  setInputOppPadre,
}: Props) {

    const isFilterActive = filterState.oportunidadPadre.trim() !== "";
  return (
    <>
      {inputOppPadre ? (
        <div className="relative flex items-center gap-2 justify-center">
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm pr-8 w-full fade-in"
            placeholder="Op. Padre"
            value={filterState.oportunidadPadre}
            onChange={(e) =>
              setFilterState((prev) => ({
                ...prev,
                oportunidadPadre: e.target.value,
              }))
            }
          />
          <button
            className="absolute right-2 text-gray-500 hover:text-gray-800"
            onClick={() => {
              setFilterState((prev) => ({
                ...prev,
                oportunidadPadre: "",
              }));
              setInputOppPadre(false);
            }}
          >
            X
          </button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInputOppPadre(true)}
        >
           <Filter 
            className={cn(
              "transition-colors",
              isFilterActive ? 
                "text-blue-500 fill-blue-500" : 
                "text-muted-foreground"
            )}
          />
        </Button>
      )}
    </>
  );
}

export default OpportunityParentFilter;