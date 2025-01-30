import React, { useState } from "react";

const AddProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    setIsOpen(false); // Close modal after submission
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Plus Button */}
      <button onClick={() => setIsOpen(true)} style={styles.plusButton}>+</button>

      {/* Modal */}
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Add Item</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter text..."
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                style={styles.input}
              />
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>Submit</button>
                <button type="button" onClick={() => setIsOpen(false)} style={styles.closeButton}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  plusButton: {
    fontSize: "24px",
    padding: "10px 20px",
    borderRadius: "50%",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  submitButton: {
    padding: "8px 16px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    padding: "8px 16px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

export default AddProject;
