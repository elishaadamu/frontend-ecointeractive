import React, { useState } from "react";

const CommentsTable = ({ comments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const exportToCsv = (data, filename) => {
    const csvRows = [];
    // Get headers
    const headers = Object.keys(data[0] || {});
    csvRows.push(headers.join(","));

    // Loop over the rows
    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
  };

  const handleExportAll = () => {
    exportToCsv(comments, "all_comments.csv");
  };

  const handleExportRow = (comment) => {
    exportToCsv([comment], `comment_${comment.id || new Date().getTime()}.csv`);
  };

  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Comments</h2>
      <button
        onClick={handleExportAll}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Export All Comments
      </button>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                Project ID
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "200px",
                }}
              >
                Comment
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                User
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "150px",
                }}
              >
                Timestamp
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentComments.map((comment) => (
              <tr key={comment.id || comment.timestamp}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {comment.projectId}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {comment.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {comment.comment}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(comment.timestamp).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    onClick={() => handleExportRow(comment)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "8px 15px",
            margin: "0 5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              padding: "8px 15px",
              margin: "0 5px",
              backgroundColor:
                currentPage === index + 1 ? "#0056b3" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 15px",
            margin: "0 5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentsTable;
