import { useState } from "react";
// Import Leaflet components
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// Import Leaflet icon (to fix default marker issue)
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import FlyTo from "./FlyTo";

// Fix default marker icon problem
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const CoveragePage = () => {
  const wareHouseData = useLoaderData();
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center mb-4 text-black">
        We are available in 64 district in Bangladesh
      </h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search area..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring focus:border-blue-400 text-slate-500"
      />

      {/* Map Container */}
      <div className="w-full max-w-screen-xl h-[60vh] rounded shadow overflow-hidden">
        <MapContainer
          center={[23.685, 90.3563]} // Center of Bangladesh
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Map tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <FlyTo searchTerm={searchTerm} wareHouseData={wareHouseData} />

          {/* Filter and display markers */}
          {wareHouseData
            .filter((loc) => {
              // Convert search term to lowercase once
              const search = searchTerm.toLowerCase();

              // Check if city matches
              const cityMatch = loc.city.toLowerCase().includes(search);

              // Check if any covered_area matches
              const areaMatch = loc.covered_area.some((area) =>
                area.toLowerCase().includes(search)
              );

              return cityMatch || areaMatch;
            })
            .map((loc, index) => (
              <Marker key={index} position={[loc.latitude, loc.longitude]}>
                <Popup>
                  <div className="space-y-1">
                    <div>
                      <strong>{loc.city}</strong>
                    </div>
                    <div>Region: {loc.region}</div>
                    <div>Areas: {loc.covered_area.join(", ")}</div>
                    {loc.flowchart && (
                      <a
                        href={loc.flowchart}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Flowchart
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default CoveragePage;
