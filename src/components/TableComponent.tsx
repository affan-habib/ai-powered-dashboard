import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

interface TableComponentProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
}

const TableComponent = <T,>({ data, columns, title }: TableComponentProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full">
      {/* Modern Chart Title */}
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
            {title}
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
        </div>
      )}
      
      {/* Table Container */}
      <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200/50">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50/80 to-blue-50/80 first:rounded-l-xl last:rounded-r-xl"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr 
                  key={row.id} 
                  className={`border-b border-gray-100/50 hover:bg-blue-50/30 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white/20' : 'bg-gray-50/20'
                  }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className="px-6 py-4 text-sm text-gray-700 font-medium"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer Info */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Showing {table.getRowModel().rows.length} entries
          </p>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;