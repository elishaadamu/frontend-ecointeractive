import React, { useState, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
} from "react-leaflet";
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
  "Bike/Ped": "#ccd145ff", // Sky Blue
};

const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 1px solid #000;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const getPathsForType = (type) => {
  // This data would ideally come from your GeoJSON or API
  // These are example paths - replace with your actual path data
  const paths = {
    Roadway: [
      [
        [21.438926, -158.185005],
        [21.43887, -158.184642],
      ],
      [
        [21.332594, -157.921314],
        [21.331446, -157.920799],
      ],
    ],
    Transit: [
      [
        [21.406389, -157.937775],
        [21.406233, -157.937431],
      ],
      [
        [21.297222, -157.859167],
        [21.296944, -157.858611],
      ],
    ],
    "Bike/Ped": [
      [
        [21.342778, -157.928889],
        [21.3425, -157.928333],
      ],
      [
        [21.285833, -157.833889],
        [21.285556, -157.833333],
      ],
    ],
  };
  return paths[type] || [];
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
  const [pathData, setPathData] = useState([]);

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

      // Get all visible paths based on active layers
      const paths = activeProjectLayers.flatMap((layer) => {
        const layerPaths = getPathsForType(layer);
        return layerPaths.map((path) => ({
          coordinates: path,
          type: layer,
        }));
      });
      setPathData(paths);

      // Calculate bounds including both points and paths
      const allPointCoords = filtered.features.map(
        (f) => f.geometry.coordinates
      );
      const allPathCoords = paths.flatMap((path) => path.coordinates);
      const allCoords = [
        ...allPointCoords,
        ...allPathCoords.map((coord) => [coord[1], coord[0]]),
      ];

      if (allCoords.length > 0) {
        const minLat = Math.min(
          ...allCoords.map((c) => (Array.isArray(c[1]) ? c[1][0] : c[1]))
        );
        const maxLat = Math.max(
          ...allCoords.map((c) => (Array.isArray(c[1]) ? c[1][0] : c[1]))
        );
        const minLng = Math.min(
          ...allCoords.map((c) => (Array.isArray(c[0]) ? c[0][0] : c[0]))
        );
        const maxLng = Math.max(
          ...allCoords.map((c) => (Array.isArray(c[0]) ? c[0][0] : c[0]))
        );
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
      {/* Render Polylines for paths */}
      {pathData.map((path, i) => (
        <Polyline
          key={`path-${i}`}
          positions={path.coordinates}
          pathOptions={{
            color: projectTypeColors[path.type],
            weight: 4,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Render both pointer and colored circle markers */}
      {filteredData &&
        filteredData.features.map((feature, i) => (
          <React.Fragment key={`marker-group-${i}`}>
            {/* Pointer Marker */}
            <Marker
              key={`pointer-${i}`}
              position={[
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
              ]}
              icon={DefaultIcon}
              zIndexOffset={1000} // Keep pointer on top
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
            {/* Colored Circle Marker */}
            <Marker
              key={`circle-${i}`}
              position={[
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
              ]}
              icon={createCustomIcon(
                projectTypeColors[feature.properties.project_type]
              )}
              zIndexOffset={900} // Keep circle below pointer
            />
          </React.Fragment>
        ))}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </MapContainer>
  );
}

export default MapView;
