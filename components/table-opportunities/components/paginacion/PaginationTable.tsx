import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react'

interface Props {

    currentPage: number;
    totalPages: number
    handlePageChange: (newPage: number) => void;
}

function PaginationTable(props: Props) {

    const { 
        currentPage,
        totalPages,
        handlePageChange
    } = props
  return (
    <div className="flex justify-between items-center py-4">
              <Button
                disabled={currentPage === 1}
                className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeftIcon /> Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente <ChevronRightIcon />
              </Button>
            </div>
  )
}

export default PaginationTable