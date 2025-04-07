import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import { getCurrentLocation } from "../services/api";

export default function HomePage() {
  const [position, setPosition] = useState([0, 0]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getCurrentLocation();
        if (data) {
          setPosition([data.latitude, data.longitude]);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return <MapView position={position} />;
}
