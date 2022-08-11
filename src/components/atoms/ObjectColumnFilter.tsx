import { useContext, useMemo } from 'react';

import { ColorContext } from '@/contexts/ColorContext';
import { Select } from '@chakra-ui/react';

export interface ObjectColumnFilterProps {
  column: { filterValue: any; setFilter: any; preFilteredRows: any[]; id: any };
}

// This is a custom filter UI for selecting
// a unique option from a list
export function ObjectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: ObjectColumnFilterProps) {
  const { green } = useContext(ColorContext);
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row: any) =>
      row.values[id].edges.map(({ node }: { node: any }) =>
        node.item.refItem
          ? options.add(node.item.refItem.name)
          : options.add(node.item.name),
      ),
    );
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Select
      size="xs"
      fontFamily={'Lato'}
      focusBorderColor={green}
      rounded="3xl"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Todos</option>
      {options.map((option, i) => {
        return (
          <option key={i} value={String(option)}>
            {String(option)}
          </option>
        );
      })}
    </Select>
  );
}
