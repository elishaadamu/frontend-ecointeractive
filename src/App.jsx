import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import MapView from "./components/MapView";
import AdminLogin from "./components/AdminLogin";
import CommentsTable from "./components/CommentsTable";
import ProjectsTable from "./components/ProjectsTable";
import ProjectsTableIndex from "./components/ProjectsTableIndex";

function App() {
  const [comments, setComments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  ); // New state for admin status
  const navigate = useNavigate(); // For redirection after login
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState("All");
  const [selectedYearProgrammed, setSelectedYearProgrammed] = useState("All");
  const [selectedFundingSource, setSelectedFundingSource] = useState("All");
  const [selectedFundingLayer, setSelectedFundingLayer] = useState("All");
  const [fundingSources, setFundingSources] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeProjectLayers, setActiveProjectLayers] = useState([
    "Roadway",
    "Transit",
    "Bike/Ped",
  ]);
  const [openPopupId, setOpenPopupId] = useState(null); // State to track which popup is open

  const handleClosePopup = () => {
    setOpenPopupId(null);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "https://ecointeractive.onrender.com/api/comments"
        );
        setComments(response.data);
        console.log("Fetched comments:", response.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();

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

        const yearsProgrammed = [
          ...new Set(
            data.features
              .map((feature) => feature.properties.year)
              .filter(Boolean) // Filter out null, undefined, 0, false, ""
              .map(String)
          ),
        ].sort();
        setYears(["All", ...yearsProgrammed]);
      })
      .catch((err) => console.error("Failed to fetch project data:", err));
  }, []);

  const addComment = async (comment) => {
    try {
      const response = await axios.post(
        "https://ecointeractive.onrender.com/api/comments",
        comment
      );
      console.log("Comment added:", response);
      setComments([...comments, response.data]);
      Swal.fire({
        icon: "success",
        title: "Comment Added!",
        text: "Your comment has been successfully submitted.",
        timer: 1500,
        showConfirmButton: false,
      });
      Swal.fire({
        icon: "success",
        title: "Comment Added!",
        text: "Your comment has been successfully submitted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to add comment:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your comment. Please try again.",
      });
    }
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

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const [years, setYears] = useState([]);

  const filteredGeoData = geoData
    ? {
        ...geoData,
        features: geoData.features.filter((feature) => {
          const matchesProjectType =
            selectedProjectType === "All" ||
            feature.properties.project_type === selectedProjectType;
          const matchesYearProgrammed =
            selectedYearProgrammed === "All" ||
            String(feature.properties.year) === selectedYearProgrammed;
          const matchesFundingSource =
            selectedFundingSource === "All" ||
            feature.properties.product === selectedFundingSource;
          const matchesFundingLayer =
            selectedFundingLayer === "All" ||
            feature.properties.product === selectedFundingLayer;

          return (
            matchesProjectType &&
            matchesYearProgrammed &&
            matchesFundingSource &&
            matchesFundingLayer
          );
        }),
      }
    : null;

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
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: "none",
              "@media (max-width: 768px)": {
                display: "block",
                background: "none",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                marginRight: "10px",
              },
            }}
          >
            <div
              style={{
                width: "25px",
                height: "3px",
                background: "#333",
                marginBottom: "5px",
                transition: "0.3s",
              }}
            />
            <div
              style={{
                width: "25px",
                height: "3px",
                background: "#333",
                marginBottom: "5px",
                transition: "0.3s",
              }}
            />
            <div
              style={{
                width: "25px",
                height: "3px",
                background: "#333",
                transition: "0.3s",
              }}
            />
          </button>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
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
                "@media (max-width: 768px)": {
                  fontSize: "1em",
                  marginRight: "10px",
                },
              }}
            >
              Tri cities area mpo tip/plan2050 projects
            </span>
          </Link>
        </div>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            "@media (max-width: 768px)": {
              display: isMobileMenuOpen ? "flex" : "none",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#f8f9fa",
              flexDirection: "column",
              padding: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              zIndex: 1000,
            },
          }}
        >
          {isAdmin ? (
            <button
              onClick={handleLogout}
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#333",
                marginRight: "15px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1em",
                "@media (max-width: 768px)": {
                  margin: "10px 0",
                },
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#333",
                marginRight: "15px",
                "@media (max-width: 768px)": {
                  margin: "10px 0",
                },
              }}
            >
              Login as admin
            </Link>
          )}
          {isAdmin && (
            <>
              <Link
                to="/comments"
                style={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "#333",
                  marginRight: "15px",
                  "@media (max-width: 768px)": {
                    margin: "10px 0",
                  },
                }}
              >
                View Comments
              </Link>
              <Link
                to="/projects"
                style={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "#333",
                  "@media (max-width: 768px)": {
                    margin: "10px 0",
                  },
                }}
              >
                View Projects
              </Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route
          path="/login"
          element={<AdminLogin setIsAdmin={setIsAdmin} navigate={navigate} />}
        />
        <Route
          path="/comments"
          element={
            isAdmin ? (
              <CommentsTable comments={comments} setComments={setComments} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isAdmin ? (
              <ProjectsTable geoData={geoData} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            <div style={{ display: "flex", flex: 1, position: "relative" }}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                  display: "none",
                  "@media (max-width: 768px)": {
                    display: "block",
                    position: "absolute",
                    top: "10px",
                    left: isSidebarOpen ? "310px" : "10px",
                    zIndex: 1000,
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                    cursor: "pointer",
                    transition: "left 0.3s",
                  },
                }}
              >
                {isSidebarOpen ? "✕" : "☰"}
              </button>
              <aside
                style={{
                  width: "450px",
                  padding: "20px",
                  borderRight: "1px solid #e7e7e7",
                  overflowY: "auto",
                  background: "white",
                  "@media (max-width: 768px)": {
                    position: "absolute",
                    left: isSidebarOpen ? "0" : "-100%",
                    top: 0,
                    bottom: 0,
                    width: "300px",
                    padding: "15px",
                    zIndex: 999,
                    transition: "left 0.3s ease",
                    boxShadow: isSidebarOpen
                      ? "2px 0 5px rgba(0,0,0,0.1)"
                      : "none",
                  },
                }}
              >
                <div
                  onClick={() => setIsLayersOpen(!isLayersOpen)}
                  style={{
                    display: "none",
                    "@media (max-width: 768px)": {
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    },
                  }}
                >
                  <h3 style={{ margin: 0, marginRight: "10px" }}>
                    Project Layers
                  </h3>
                  <span
                    style={{
                      fontSize: "1.2em",
                      transform: isLayersOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s",
                    }}
                  >
                    ▸
                  </span>
                </div>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    "@media (max-width: 768px)": {
                      display: "none",
                    },
                  }}
                >
                  Funding Sources
                </h3>
                <div
                  style={{
                    marginBottom: "20px",
                    "@media (max-width: 768px)": {
                      maxHeight: isLayersOpen ? "1000px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease-in-out",
                    },
                  }}
                >
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      key="all"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontSize: "0.9em",
                      }}
                    >
                      <input
                        type="radio"
                        id="all-funding"
                        name="funding-source"
                        value="All"
                        checked={selectedFundingLayer === "All"}
                        onChange={(e) =>
                          setSelectedFundingLayer(e.target.value)
                        }
                        style={{
                          marginRight: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <label htmlFor="all-funding">All</label>
                    </div>
                    {fundingSources
                      .filter((source) => source !== "All")
                      .map((source) => (
                        <div
                          key={source}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            fontSize: "0.9em",
                          }}
                        >
                          <input
                            type="radio"
                            id={`funding-${source}`}
                            name="funding-source"
                            value={source}
                            checked={selectedFundingLayer === source}
                            onChange={(e) =>
                              setSelectedFundingLayer(e.target.value)
                            }
                            style={{
                              marginRight: "10px",
                              width: "20px",
                              height: "20px",
                            }}
                          />

                          <label htmlFor={`funding-${source}`}>{source}</label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="section-header">
                  <div
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    style={{
                      display: "none",
                      "@media (max-width: 768px)": {
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      },
                    }}
                  >
                    <h3 style={{ margin: 0, marginRight: "10px" }}>
                      Project Filters
                    </h3>
                    <span
                      style={{
                        fontSize: "1.2em",
                        transform: isFiltersOpen ? "rotate(90deg)" : "none",
                        transition: "transform 0.3s",
                      }}
                    >
                      ▸
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      "@media (max-width: 768px)": {
                        display: "none",
                      },
                    }}
                  >
                    Project Filters
                  </h3>
                </div>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    "@media (max-width: 768px)": {
                      flexDirection: "column",
                      maxHeight: isFiltersOpen ? "1000px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease-in-out",
                    },
                  }}
                >
                  <div
                    style={{
                      width: "30%",
                      marginBottom: "10px",
                      "@media (max-width: 768px)": {
                        width: "100%",
                        marginBottom: "15px",
                      },
                    }}
                  >
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
                  <div
                    style={{
                      width: "30%",
                      marginBottom: "10px",
                      "@media (max-width: 768px)": {
                        width: "100%",
                        marginBottom: "15px",
                      },
                    }}
                  >
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
                  <div
                    style={{
                      width: "30%",
                      marginBottom: "10px",
                      "@media (max-width: 768px)": {
                        width: "100%",
                        marginBottom: "15px",
                      },
                    }}
                  >
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
                {isAdmin && (
                  <div>
                    <ProjectsTableIndex
                      geoData={filteredGeoData}
                      selectedProjectType={selectedProjectType}
                      selectedYearProgrammed={selectedYearProgrammed}
                      selectedFundingSource={selectedFundingSource}
                    />
                  </div>
                )}
              </aside>

              <main
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  "@media (max-width: 768px)": {
                    marginLeft: isSidebarOpen ? "300px" : 0,
                    width: isSidebarOpen ? "calc(100% - 300px)" : "100%",
                    transition: "margin-left 0.3s ease, width 0.3s ease",
                  },
                }}
              >
                <div style={{ flex: 1 }}>
                  <MapView
                    addComment={addComment}
                    comments={comments}
                    selectedProjectType={selectedProjectType}
                    geoData={filteredGeoData}
                    activeProjectLayers={activeProjectLayers}
                    selectedYearProgrammed={selectedYearProgrammed}
                    selectedFundingSource={selectedFundingSource}
                    selectedFundingLayer={selectedFundingLayer}
                    isAdmin={isAdmin} // Pass isAdmin prop
                  />
                </div>
              </main>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
