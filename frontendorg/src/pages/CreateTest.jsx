import React, { useState } from "react";
import axios from "axios";
import "../css/CreateTest.css";
import { NavLink } from "react-router-dom";

const CreateTestPage = () => {
  const [level, setLevel] = useState("");
  const [langType, setLangType] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/createTest", {
        level,
        langType,
        referenceText,
      });
      setMessage("Test created/updated successfully!");
      setIsError(false);
    } catch (error) {
      console.error("There was an error creating the test!", error);
      setMessage("Failed to create/update the test.");
      setIsError(true);
    }
  };

  return (
    <div className="container">
        <NavLink to="/">
          <button className="back-btn">Back</button>
        </NavLink>
      <h1>Create Test</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Level:</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="">Select Level</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div>
          <label>Language Type:</label>
          <select
            value={langType}
            onChange={(e) => setLangType(e.target.value)}
            required
          >
            <option value="">Select Language</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>
        </div>
        <div>
          <label>Reference Text:</label>
          <textarea
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && (
        <p className={`message ${isError ? "error" : "success"}`}>{message}</p>
      )}
    </div>
  );
};

export default CreateTestPage;
