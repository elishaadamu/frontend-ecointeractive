import React, { useState } from "react";

const ProjectsTable = ({ geoData, selectedProjectType, selectedYearProgrammed, selectedFundingSource, selectedProjectTitle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const exportToCsv = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }

    const csvRows = [];
    // Get headers from the properties of the first feature
    const headers = Object.keys(data[0].properties);
    csvRows.push(headers.join(","));

    // Loop over the features (rows)
    for (const feature of data) {
      const values = headers.map((header) => {
        const escaped = ("" + feature.properties[header]).replace(/"/g, '"');
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

  const handleExportAllProjects = () => {
    if (geoData && geoData.features) {
      exportToCsv(geoData.features, "all_projects.csv");
    } else {
      alert("No project data available to export.");
    }
  };

  const projects = geoData ? geoData.features : [];

  const filteredProjects = projects.filter((project) => {
    const projectTypeMatch = selectedProjectType === "All" || project.properties.project_type === selectedProjectType;
    const yearProgrammedMatch = selectedYearProgrammed === "All" || String(project.properties.year) === selectedYearProgrammed;
    const fundingSourceMatch = selectedFundingSource === "All" || project.properties.product === selectedFundingSource;
    const projectTitleMatch =
      selectedProjectTitle.length === 0 ||
      selectedProjectTitle.some(
        (selected) => selected.value === "All" || project.properties.project_title === selected.value
      );
    return projectTypeMatch && yearProgrammedMatch && fundingSourceMatch && projectTitleMatch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        padding: "0px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
          style={{
            padding: "0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>{geoData?.name || "Projects"}</h2>
          <button
            onClick={handleExportAllProjects}
            style={{
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Export All Projects
          </button>
        </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "100px", // Added minWidth for better mobile display
                }}
              >
                Project ID
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "150px", // Added minWidth for better mobile display
                }}
              >
                Project Name
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "120px", // Added minWidth for better mobile display
                }}
              >
                Project Type
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "120px", // Added minWidth for better mobile display
                }}
              >
                Product
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  minWidth: "150px", // Added minWidth for better mobile display
                }}
              >
                Year Programmed
              </th>
              {/* Add more headers as needed based on your geoData properties */}
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((feature) => (
              <tr key={feature.properties.projectid}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feature.properties.project_id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feature.properties.project_title}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feature.properties.project_type}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feature.properties.product}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feature.properties.year}
                </td>
                {/* Add more data cells as needed */}
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
              backgroundColor: currentPage === index + 1 ? "#0056b3" : "#007bff",
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

export default ProjectsTable;
