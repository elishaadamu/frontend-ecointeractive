import React, { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
import ProjectPopup from "./ProjectPopup";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const projectTypeColors = {
  Roadway: "#FF6B6B", // Coral Red
  Transit: "#4ECDC4", // Teal
  "Bike/Ped": "#45B7D1", // Sky Blue
};

function MapView({
  addComment,
  comments,
  selectedProjectType,
  geoData,
  activeProjectLayers = [],
}) {
  const [filteredData, setFilteredData] = useState(null);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (geoData && geoData.features) {
      // Filter features based on selectedProjectType and activeProjectLayers
      const filtered = {
        ...geoData,
        features: geoData.features.filter((feature) => {
          const matchesProjectType =
            selectedProjectType === "All" ||
            feature.properties.project_type === selectedProjectType;
          const isLayerActive = activeProjectLayers.includes(
            feature.properties.project_type
          );
          return matchesProjectType && isLayerActive;
        }),
      };

      setFilteredData(filtered);

      if (filtered.features.length > 0) {
        const allCoords = filtered.features.map((f) => f.geometry.coordinates);
        const minLat = Math.min(...allCoords.map((c) => c[1]));
        const maxLat = Math.max(...allCoords.map((c) => c[1]));
        const minLng = Math.min(...allCoords.map((c) => c[0]));
        const maxLng = Math.max(...allCoords.map((c) => c[0]));
        setBounds([
          [minLat, minLng],
          [maxLat, maxLng],
        ]);
      }
    }
  }, [geoData, selectedProjectType, activeProjectLayers]);

  const downloadAllProjectsData = () => {
    if (!geoData || !geoData.features || geoData.features.length === 0) {
      toast.error("No project data available to download.");
      return;
    }

    const dataToDownload = geoData.features.map(
      (feature) => feature.properties
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AllProjects");
    XLSX.writeFile(workbook, `all_projects_data.xlsx`);
    toast.success("All project data downloaded successfully!");
  };

  if (!bounds) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer bounds={bounds} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <button
        onClick={downloadAllProjectsData}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "8px 12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Download All Projects
      </button>
      {filteredData &&
        filteredData.features.map((feature, i) => (
          <Marker
            key={i}
            position={[
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ]}
          >
            <Tooltip>Project ID: {feature.properties.project_id}</Tooltip>
            <Popup>
              <ProjectPopup
                project={feature.properties}
                addComment={addComment}
                comments={comments}
              />
            </Popup>
          </Marker>
        ))}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </MapContainer>
  );
}

export default MapView;
