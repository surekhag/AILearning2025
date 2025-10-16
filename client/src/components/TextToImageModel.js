import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API_KEY from "../Config/config";

const TextToImageModel = ({
  apiUrl = "http://localhost:3001/api/write",
  placeholder = "Enter text...",
}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultUrl(null);
    setError(null);

    try {
      const endpoint =
        "https://router.huggingface.co/nebius/v1/images/generations";

      const resp = await fetch(endpoint, {
        response_format: "b64_json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-dev",
          response_format: "b64_json",
          prompt: text,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.log("data from eror", text);
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }

      //  // Parse JSON and extract base64 image
      const data = await resp.json();
      // console.log("API response:", data && data[0], data && data[0].b64_json); // <-- Add this line
      console.log("API response:", data, data && data.data[0]); // <-- Add this line

      const base64Image =
        (data && data?.data[0]?.generated_image_b64) ||
        (data && data?.data[0]?.images?.[0]?.b64_json) ||
        (data && data?.data[0]?.b64_json) ||
        (data && data?.data[0]?.image); // Add more keys if needed
      console.log("Extracted base64Image:", base64Image); // <-- Add this line
      if (!base64Image) {
        throw new Error("No image found in response");
      }
      const imageUrl = `data:image/png;base64,${base64Image}`;
      setResultUrl(imageUrl);
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
              Text to Image Model
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
            {resultUrl && <span className="text-success">Success</span>}
            {error && <span className="text-danger">Error</span>}
          </div>
        </form>

        {resultUrl && (
          <div className="mt-3">
            <h6>Response:</h6>
            <img src={resultUrl} alt="Generated" style={{ maxWidth: "100%" }} />
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

export default TextToImageModel;
