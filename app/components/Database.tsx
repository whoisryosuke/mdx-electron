import React from 'react';
import fs from 'fs';
import path from 'path';
import MDX from '@mdx-js/runtime';
import matter from 'gray-matter';
import { useTable } from 'react-table';
import { UIComponents } from './MDXProvider';
import { useCurrentFile } from '../context/CurrentFileContext';

interface Props {
  name: string;
}

const Table = ({ columns, data }) => {
  const tableInstance = useTable({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {
                      // Render the header
                      column.render('Header')
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render('Cell')
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export const Database = ({ name }: Props) => {
  if (name && name !== '') {
    const filePath = path.join(__dirname, `./content/db/${name}.json`);
    const rawDB = fs.readFileSync(filePath, 'utf8');
    // Parse JSON
    const parsedDB = JSON.parse(rawDB);
    const columns = Object.keys(parsedDB[0]).map((key) => ({
      Header: key,
      accessor: key,
    }));
    return <Table columns={columns} data={parsedDB} />;
  }
  return <div>Select a file from the sidebar</div>;
};

export default Database;
