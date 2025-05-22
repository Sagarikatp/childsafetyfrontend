import { MapIcon } from "./Icons";
export default function MapPlaceholder({ message, isError = false }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <MapIcon
        className={`h-16 w-16 ${
          isError ? "text-red-500" : "text-blue-500"
        } mb-4`}
      />
      <p className={`text-lg ${isError ? "text-red-600" : "text-gray-600"}`}>
        {message || "Loading map..."}
      </p>
    </div>
  );
}
