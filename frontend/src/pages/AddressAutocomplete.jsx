import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddressAutocomplete = ({ onSelect, required = false }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // ✅ track if user picked from list
  const cacheRef = useRef({});
  const debounceTimeout = useRef(null);

  // ✅ Use in-memory cache only (no localStorage) to avoid Tracking Prevention warning
  const searchAddress = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    // Check in-memory cache
    if (cacheRef.current[searchTerm]) {
      setSuggestions(cacheRef.current[searchTerm]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchTerm,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });

      const results = response.data;
      setSuggestions(results);
      cacheRef.current[searchTerm] = results; // ✅ memory only
    } catch (error) {
      console.error("Autocomplete error:", error.message);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsSelected(false); // ✅ reset selection if user types again

    // Notify parent that address was cleared
    if (val === "") {
      onSelect({ display_name: "" });
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => searchAddress(val), 400);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item.display_name);
    setSuggestions([]);
    setIsSelected(true); // ✅ mark as properly selected
  };

  // ✅ Clear selection
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsSelected(false);
    onSelect({ display_name: "" });
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search and select address *"
          className={`border rounded px-3 py-2 w-full pr-8
            ${isSelected ? "border-green-500 bg-green-50" : ""}
            ${required && !isSelected && query ? "border-red-400" : ""}
          `}
        />

        {/* ✅ Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* ✅ Loading indicator */}
      {isLoading && (
        <p className="text-xs text-gray-400 mt-1">Searching...</p>
      )}

      {/* ✅ Warning if typed but not selected */}
      {!isSelected && query.length > 2 && !isLoading && suggestions.length === 0 && (
        <p className="text-xs text-red-400 mt-1">No results found. Try a different search.</p>
      )}

      {/* ✅ Hint to select from list */}
      {!isSelected && suggestions.length > 0 && (
        <p className="text-xs text-blue-400 mt-1">👆 Please select an address from the list below</p>
      )}

      {/* ✅ Selected confirmation */}
      {isSelected && (
        <p className="text-xs text-green-500 mt-1">✓ Address selected</p>
      )}

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="border mt-1 rounded max-h-48 overflow-y-auto shadow-md bg-white z-50 absolute w-full">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
              onClick={() => handleSelect(item)}
            >
              📍 {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;