import { useEffect, useState } from "react";

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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts(query);
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
