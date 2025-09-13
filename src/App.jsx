import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";

function App() {
  const [comments, setComments] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState("All");
  const [selectedYearProgrammed, setSelectedYearProgrammed] = useState("All");
  const [selectedFundingSource, setSelectedFundingSource] = useState("All");
  const [fundingSources, setFundingSources] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [activeProjectLayers, setActiveProjectLayers] = useState([
    "Roadway",
    "Transit",
    "Bike/Ped",
  ]);

  useEffect(() => {
    fetch("http://localhost:3001/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Failed to fetch comments:", err));

    fetch(`${window.location.origin}/projects.geojson`)
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data); // Set geoData here
        const types = [
          ...new Set(
            data.features.map((feature) => feature.properties.project_type)
          ),
        ];
        setProjectTypes(["All", ...types]);

        const sources = [
          ...new Set(
            data.features.map((feature) => feature.properties.product)
          ),
        ];
        setFundingSources(["All", ...sources.filter(Boolean)]); // filter out null/undefined
      })
      .catch((err) => console.error("Failed to fetch project data:", err));
  }, []);

  const addComment = (comment) => {
    fetch("http://localhost:3001/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    })
      .then((res) => res.json())
      .then((newComment) => {
        setComments([...comments, newComment]);
      })
      .catch((err) => console.error("Failed to add comment:", err));
  };

  const handleProjectTypeChange = (event) => {
    setSelectedProjectType(event.target.value);
  };

  const handleYearProgrammedChange = (event) => {
    setSelectedYearProgrammed(event.target.value);
  };

  const handleFundingSourceChange = (event) => {
    setSelectedFundingSource(event.target.value);
  };

  const years = ["All"];
  for (let i = 2015; i <= 2025; i++) {
    years.push(String(i));
  }

  return (
    <div
      className="app-container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <header
        style={{
          background: "#f8f9fa",
          padding: "10px 20px",
          borderBottom: "1px solid #e7e7e7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/vite.svg"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.2em",
              marginRight: "20px",
            }}
          >
            OAHU Metropolitan Planning Organization
          </span>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <aside
          style={{
            width: "450px",
            padding: "20px",
            borderRight: "1px solid #e7e7e7",
            overflowY: "auto",
          }}
        >
          <h3>Project Layers</h3>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={activeProjectLayers.includes("Roadway")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActiveProjectLayers([...activeProjectLayers, "Roadway"]);
                  } else {
                    setActiveProjectLayers(
                      activeProjectLayers.filter((layer) => layer !== "Roadway")
                    );
                  }
                }}
                style={{ marginRight: "10px", width: "20px", height: "20px" }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background: "#FF6B6B",
                  marginRight: "5px",
                }}
              ></span>
              Roadway
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={activeProjectLayers.includes("Transit")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActiveProjectLayers([...activeProjectLayers, "Transit"]);
                  } else {
                    setActiveProjectLayers(
                      activeProjectLayers.filter((layer) => layer !== "Transit")
                    );
                  }
                }}
                style={{ marginRight: "10px", width: "20px", height: "20px" }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background: "#4ECDC4",
                  marginRight: "5px",
                }}
              ></span>
              Transit
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={activeProjectLayers.includes("Bike/Ped")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActiveProjectLayers([
                      ...activeProjectLayers,
                      "Bike/Ped",
                    ]);
                  } else {
                    setActiveProjectLayers(
                      activeProjectLayers.filter(
                        (layer) => layer !== "Bike/Ped"
                      )
                    );
                  }
                }}
                style={{ marginRight: "10px", width: "20px", height: "20px" }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background: "#ccd145ff",
                  marginRight: "5px",
                }}
              ></span>
              Bike/Ped
            </div>
          </div>

          <h3>Project Filters</h3>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: "30%", marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                  color: "#555",
                }}
              >
                Project Type
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={selectedProjectType}
                onChange={handleProjectTypeChange}
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ width: "30%", marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                  color: "#555",
                }}
              >
                Funding Source
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={selectedFundingSource}
                onChange={handleFundingSourceChange}
              >
                {fundingSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ width: "30%", marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                  color: "#555",
                }}
              >
                Year Programmed
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={selectedYearProgrammed}
                onChange={handleYearProgrammedChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #e7e7e7",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "10px", color: "#888" }}>🔍</span>{" "}
            {/* Placeholder for search icon */}
            <input
              type="text"
              placeholder="Search"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <MapView
              addComment={addComment}
              comments={comments}
              selectedProjectType={selectedProjectType}
              geoData={geoData}
              activeProjectLayers={activeProjectLayers}
              selectedYearProgrammed={selectedYearProgrammed}
              selectedFundingSource={selectedFundingSource}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;