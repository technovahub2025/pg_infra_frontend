export function DataTable({
  columns = [],
  rows = [],
  rowKey = (row, index) => row.id || index,
  emptyMessage = 'No records found.',
  scrollClassName = '',
  stickyHeader = false,
}) {
  return (
    <div className={`overflow-x-auto ${scrollClassName}`.trim()}>
      <table className="min-w-full text-left text-sm">
        <thead className={`border-b border-[rgb(var(--line)/0.12)] text-[10px] uppercase tracking-[0.2em] text-slate-500 ${stickyHeader ? 'sticky top-0 z-10 bg-[rgb(var(--panel)/0.98)] backdrop-blur' : ''}`}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.className || ''} ${stickyHeader ? 'bg-inherit' : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={rowKey(row, index)} className="border-b border-[rgb(var(--line)/0.06)] transition hover:bg-[rgb(var(--panel-2)/0.7)]">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 align-top ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.className || ''}`}
                  >
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-400" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
