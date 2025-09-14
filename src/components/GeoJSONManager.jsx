import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function GeoJSONManager({ setGeoData, currentGeoDataFilename, setCurrentGeoDataFilename }) {
  const [availableGeoJSONs, setAvailableGeoJSONs] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    // Fetch list of available GeoJSON files from the backend
    const fetchAvailableGeoJSONs = async () => {
      try {
        const response = await axios.get('https://ecointeractive.onrender.com/api/geojson/list'); // Replace with your backend URL
        setAvailableGeoJSONs(response.data);
        // If there's no current active file set, or if the current active file isn't in the list,
        // try to set the first one as selected, or default to 'projects.geojson' if available.
        if (!currentGeoDataFilename && response.data.length > 0) {
          const defaultFile = response.data.includes('projects.geojson') ? 'projects.geojson' : response.data[0];
          setSelectedFile(defaultFile);
        } else if (currentGeoDataFilename) {
          setSelectedFile(currentGeoDataFilename);
        }
      } catch (error) {
        console.error('Error fetching available GeoJSON files:', error);
        Swal.fire('Error', 'Failed to load available GeoJSON files.', 'error');
      }
    };

    fetchAvailableGeoJSONs();
  }, [currentGeoDataFilename]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  const handleSetActiveGeoJSON = async () => {
    if (!selectedFile) {
      Swal.fire('Warning', 'Please select a GeoJSON file.', 'warning');
      return;
    }

    try {
      // Call backend to set the active GeoJSON file
      await axios.post('https://ecointeractive.onrender.com/api/geojson/set-active', { filename: selectedFile }); // Replace with your backend URL

      // Fetch the content of the newly active GeoJSON file and update parent state
      const response = await axios.get(`https://ecointeractive.onrender.com/api/geojson/${selectedFile}`); // Replace with your backend URL
      setGeoData(response.data);
      setCurrentGeoDataFilename(selectedFile); // Update the filename in parent state

      Swal.fire('Success', `${selectedFile} is now the active GeoJSON file!`, 'success');
    } catch (error) {
      console.error('Error setting active GeoJSON:', error);
      Swal.fire('Error', 'Failed to set active GeoJSON file.', 'error');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Manage GeoJSON Projects</h2>
      <p>Select a GeoJSON file to make it the active project data for all users.</p>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="geojson-select" style={{ display: 'block', marginBottom: '5px' }}>
          Available GeoJSON Files:
        </label>
        <select
          id="geojson-select"
          value={selectedFile}
          onChange={handleFileChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1em',
          }}
        >
          <option value="">-- Select a file --</option>
          {availableGeoJSONs.map((filename) => (
            <option key={filename} value={filename}>
              {filename}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSetActiveGeoJSON}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1em',
        }}
      >
        Set as Active GeoJSON
      </button>

      {currentGeoDataFilename && (
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
          Currently Active: {currentGeoDataFilename}
        </p>
      )}
    </div>
  );
}

export default GeoJSONManager;
