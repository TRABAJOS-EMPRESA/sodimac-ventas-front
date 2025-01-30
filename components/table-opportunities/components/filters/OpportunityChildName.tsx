import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/interfaces/table-settings/filter-state-table.interface";

interface Props {
  filterState: FilterState;
  setFilterState: (value: React.SetStateAction<FilterState>) => void;
  inputOppHija: boolean;
  setInputOppHija: (value: React.SetStateAction<boolean>) => void;
}

function OpportunityChildFilter({
  filterState,
  setFilterState,
  inputOppHija,
  setInputOppHija,
}: Props) {
  return (
    <>
      {inputOppHija ? (
        <div className="relative flex items-center gap-2 justify-center">
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm pr-8 w-full fade-in"
            placeholder="Op. Hija"
            value={filterState.oportunidadHija}
            onChange={(e) =>
              setFilterState((prev) => ({
                ...prev,
                oportunidadHija: e.target.value,
              }))
            }
          />
          <button
            className="absolute right-2 text-gray-500 hover:text-gray-800"
            onClick={() => {
              setFilterState((prev) => ({
                ...prev,
                oportunidadHija: "",
              }));
              setInputOppHija(false);
            }}
          >
            X
          </button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInputOppHija(true)}
        >
          <Filter className="text-muted-foreground" />
        </Button>
      )}
    </>
  );
}

export default OpportunityChildFilter;