import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Select an Option</h1>
      <button
        onClick={() => navigate("/history")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        View History
      </button>
      <button
        onClick={() => navigate("/current")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        View Current Location
      </button>
    </div>
  );
}
