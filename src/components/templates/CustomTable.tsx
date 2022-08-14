import {
  Alert,
  AlertIcon,
  Box,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  Column,
  FilterTypes,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useTable,
} from 'react-table';
import { CustomIconButton, DefaultColumnFilter } from '@/components/atoms';
import { MdNavigateBefore, MdNavigateNext, MdRefresh } from 'react-icons/md';
import { useContext, useMemo, useState } from 'react';

import { ColorContext } from '@/contexts/ColorContext';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const { green } = useContext(ColorContext);
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Text>
      Buscar:{' '}
      <Input
        size="sm"
        maxW="xs"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} resultados...`}
        rounded="3xl"
        focusBorderColor={green}
      />
    </Text>
  );
}

export interface CustomTableProps {
  data: any[];
  columns: Column<any>[];
  loading: boolean;
  refetch?: () => void;
  globalFilter?: boolean;
}

export function CustomTable({
  data,
  columns,
  loading,
  refetch,
  globalFilter = false,
}: CustomTableProps) {
  const { green } = useContext(ColorContext);
  const filterTypes: FilterTypes<any> = useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id as any];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
            : true;
        });
      },
      object: (rows, id, filterValue) => {
        const filteredRows = rows.filter((row) => {
          const rowValue = row.values[id as any];
          return rowValue.edges.some(
            ({ node }: { node: any }) =>
              node.item.refItem?.name === filterValue ||
              node.item.name === filterValue,
          );
        });
        return filteredRows;
      },
    }),
    [],
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // start Pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    // end Pagination

    // start Filters
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    // end Filters

    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 20,
      },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination,
  );

  return (
    <TableContainer>
      <CustomIconButton
        aria-label="refresh"
        icon={<MdRefresh size="25px" />}
        onClick={refetch}
      />
      <Alert status={loading ? 'info' : 'success'} variant="left-accent" mb={4}>
        <AlertIcon />
        {loading ? 'Sincronizando dados...' : 'Os dados estão sincronizados!'}
      </Alert>
      <Table {...getTableProps()} size={'sm'} variant="simple">
        <Thead>
          {globalFilter && (
            <Tr>
              <Th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: 'left',
                }}
              >
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </Th>
            </Tr>
          )}
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                  <Box>{column.canFilter ? column.render('Filter') : null}</Box>
                </Th>
              ))}
              <Th />
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, i) => (
                  <Td {...cell.getCellProps()} key={i}>
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <HStack w="full" justify={'center'}>
        <CustomIconButton
          visibility={canPreviousPage ? 'visible' : 'hidden'}
          aria-label="prev-page"
          icon={<MdNavigateBefore size="20px" />}
          onClick={previousPage}
          colorScheme="gray"
        />
        <Text fontFamily={'AACHENN'} textColor={green}>
          {pageIndex + 1} de {pageOptions.length}
        </Text>
        <CustomIconButton
          visibility={canNextPage ? 'visible' : 'hidden'}
          aria-label="next-page"
          icon={<MdNavigateNext size="20px" />}
          onClick={nextPage}
          colorScheme="gray"
        />
      </HStack>
    </TableContainer>
  );
}
