import React, { useState } from "react";
import CommentForm from "./CommentForm";
import * as XLSX from "xlsx";

function ProjectPopup({ project, addComment, comments, onClosePopup }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className="project-popup"
      style={{
        maxWidth: "300px",
        background: "white",
        borderRadius: "8px",
      }}
    >
      <h3>{project.project_title || "Unnamed Project"}</h3>
      <div className="project-details">
        <p>
          <strong>Cost:</strong> ${project.cost}
        </p>
        <p>
          <strong>Type:</strong> {project.project_type}
        </p>
        <p>
          <strong>Improvement:</strong> {project.improvement}
        </p>
        <p>
          <strong>Locality:</strong> {project.locality}
        </p>
        <p>
          <strong>Product:</strong> {project.product}
        </p>
      </div>

      <div className="popup-buttons">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "Add Comment"}
        </button>
      </div>

      {showForm && (
        <div className="comment-form-container">
          <CommentForm
            projectId={project.project_id}
            addComment={addComment}
            onClosePopup={onClosePopup}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectPopup;
