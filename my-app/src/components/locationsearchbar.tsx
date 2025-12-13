// LocationSearchBar.tsx
import { useState } from "react";
import "./LocationSearchBar.css";

export type LocationSearchParams = {
  city: string;
  query: string;
};

type Props = {
  initialCity?: string;
  initialQuery?: string;
  onSearch: (params: LocationSearchParams) => void;
};

export default function LocationSearchBar({
  initialCity = "Bangalore",
  initialQuery = "",
  onSearch,
}: Props) {
  const [city, setCity] = useState(initialCity);
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();                    // stop page refresh
    onSearch({ city, query });             // 🔹 call parent with values
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      {/* city part */}
      <div className="city-part">
        <span className="pin">📍</span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          {/* add more */}
        </select>
        <button type="button" className="map-btn">
          Map
        </button>
      </div>

      {/* query part */}
      <div className="query-part">
        <span className="icon">🔍</span>
        <input
          type="text"
          placeholder="Search doctors, clinics, hospitals, etc."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* SEARCH button – this is what you click */}
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}
