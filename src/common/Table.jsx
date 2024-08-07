// CommonTable.js
import React from "react";

const Table = ({ columns, data, isFooter, tableRef }) => {
  console.log("inSidetable", columns);
  console.log("inSidetableRow", data);
  return (
    <table className="custom-table" ref={tableRef}>
      <thead className="table-header">
        <tr>
          {columns?.map((column) => (
            <th key={column}>{column?.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>
                {column?.isHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: row[column?.name] }} />
                ) : column?.isAction  && Array.isArray(row[column?.name]) ? (
                  row[column?.name].map((action, index) => (
                    action?.type == 'img' ? <img 
                    key={index}
                    src={action?.props?.src}
                    className={action?.props.className}
                    style={action?.props.style}
                    
                    /> :
                    <button
                      key={index}
                      onClick={action?.props?.onClick}
                      className={action?.props.className}
                      style={action?.props.style}
                    >
                      {action.props.children}
                    </button>
                  ))
                ) : (
                  row[column?.name]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {isFooter && (
        <tfoot>
          <tr>
            <td colSpan= {columns?.length} className="table-border-bottom"></td>
          </tr>
          <tr></tr>
        </tfoot>
      )}
    </table>
  );
};

export default Table;
