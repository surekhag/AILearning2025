import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TextToImage = ({
  apiUrl = "http://localhost:3001/api/write",
  placeholder = "Enter text...",
}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const API_KEY = "INSERT_YOUR_HUGGING_FACE_API_KEY_HERE";
    try {
      const endpoint = "https://router.huggingface.co/nebius/v1/images/generations"

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(JSON.stringify(text)),
      });

      if (!resp.ok) {
        const text = await resp.blob();
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }

      const data = await resp.blob();
      console.log("data from HF", data);
      // Handle common HF response shapes
      if (typeof data === "string") {
        setResult(data);
        // return data;
      } else if (Array.isArray(data) && data[0]?.generated_text) {
        // return data[0].generated_text;
        setResult(data[0].generated_text);
      } else if (data.generated_text) {
        // return data.generated_text;
        setResult(data.generated_text);
      } else {
        setResult(data.choices[0].message.content);
        // setResult(JSON.stringify(data.choices[0].message.content, null, 2));
        // return JSON.stringify(data.choices[0].message.content, null, 2);
      }
    } catch (err) {
      // throw err;
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "480px", margin: "1rem auto" }}>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="textInput" className="form-label">
              Input Text
            </label>
            <input
              id="textInput"
              type="text"
              className="form-control"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div className="d-flex align-items-center">
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
            {result && <span className="text-success">Success</span>}
            {error && <span className="text-danger">Error</span>}
          </div>
        </form>

        {result && (
          <div className="mt-3">
            <h6>Response:</h6>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-3 text-danger">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToImage;
