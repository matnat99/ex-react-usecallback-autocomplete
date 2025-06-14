import { useCallback, useEffect, useState } from "react";

const debounce = (callback, delay) => {
  let timeout;
  return (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3333/products?search=${query}`);
      const data = await res.json();
      setSuggestions(data);
      console.log("API");
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), []);

  useEffect(() => {
    debouncedFetchProducts(query);
  }, [query]);

  return (
    <div>
      <h1>Autocomplete</h1>
      <input
        type="text"
        placeholder="Cerca un prodotto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="dropdown">
          {suggestions.map((suggestion) => (
            <p key={suggestion.id}>{suggestion.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
