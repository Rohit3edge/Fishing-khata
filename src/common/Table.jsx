import React from "react";

const Table = ({ columns, data, isFooter, tableRef }) => {
  return (
    <div className="row mt-3">
      <div className="col-md-12">
        <div className="card custom-card">
          <div className="card-body">
            <table className="table table-bordered border-bottom" ref={tableRef} id="example1">
              <thead className="table-header">
                <tr>
                  {columns?.map((column) => (
                    <th key={column?.name}>{column?.name}</th>
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
                        ) : column?.isAction && Array.isArray(row[column?.name]) ? (
                          row[column?.name].map((action, index) => (
                            action?.type === 'img' ? (
                              <img 
                                key={index}
                                src={action?.props?.src}
                                className={action?.props.className}
                                style={action?.props.style}
                                alt="action-icon"
                              />
                            ) : (
                              <button
                                key={index}
                                onClick={action?.props?.onClick}
                                className={action?.props.className}
                                style={action?.props.style}
                              >
                                {action.props.children}
                              </button>
                            )
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
                    <td colSpan={columns?.length} className="table-border-bottom"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
