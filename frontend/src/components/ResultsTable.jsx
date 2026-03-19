import { useState, useMemo } from "react";

/**
 * Generic sortable data table.
 *
 * Props:
 *   columns – [{ key, label, render? }]
 *   data    – array of row objects
 *   emptyMessage – shown when data is empty
 */
export default function ResultsTable({
  columns = [],
  data = [],
  emptyMessage = "No data available",
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [data, sortKey, sortDir]);

  if (!data.length) {
    return (
      <div className="results-table__empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="results-table__wrapper">
      <table className="results-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="results-table__th"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="results-table__sort-arrow">
                    {sortDir === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={row.id ?? i} className="results-table__row">
              {columns.map((col) => (
                <td key={col.key} className="results-table__td">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
