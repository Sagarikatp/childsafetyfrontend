import { useEffect, useState } from "react";
import { getLocationHistory } from "../services/api";

export default function HistoryView() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getLocationHistory();
      setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Location History</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            Latitude: {entry.latitude}, Longitude: {entry.longitude}, Timestamp:{" "}
            {entry.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
