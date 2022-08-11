import { ColorContext } from '@/contexts/ColorContext';
import { Input } from '@chakra-ui/react';
import { useContext } from 'react';

export interface DefaultColumnFilterProps {
  column: { filterValue: any; preFilteredRows: any; setFilter: any };
}

// Define a default UI for filtering
export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: DefaultColumnFilterProps) {
  const { green } = useContext(ColorContext);
  const count = preFilteredRows.length;

  return (
    <Input
      size="xs"
      fontFamily={'Lato'}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Buscar ${count} resultados...`}
      rounded="3xl"
      focusBorderColor={green}
    />
  );
}
