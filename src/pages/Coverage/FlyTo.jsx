import { useEffect } from "react";
import { useMap } from "react-leaflet";

const FlyTo = ({ searchTerm, wareHouseData }) => {
  const map = useMap();

  useEffect(() => {
    if (!searchTerm) return;

    const search = searchTerm.toLowerCase();

    for (const loc of wareHouseData) {
      const cityMatch = loc.city.toLowerCase().includes(search);
      const areaMatch = loc.covered_area.some((area) =>
        area.toLowerCase().includes(search)
      );

      if (cityMatch || areaMatch) {
        map.flyTo([loc.latitude, loc.longitude], 15, { duration: 2 });
        break; // fly to first match only
      }
    }
  }, [searchTerm, wareHouseData, map]);

  return null;
};

export default FlyTo;
