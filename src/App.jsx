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
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const fetchProductDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:3333/products/${id}`);
      const data = await res.json();
      setSelectedProduct(data);
      setQuery("");
      setSuggestions([]);
    } catch (err) {
      console.error(err);
    }
  };

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
            <p
              key={suggestion.id}
              onClick={() => fetchProductDetails(suggestion.id)}
            >
              {suggestion.name}
            </p>
          ))}
        </div>
      )}
      {selectedProduct && (
        <div className="card">
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <p>{selectedProduct.description}</p>
          <p>
            <strong>Prezzo:</strong>
            {selectedProduct.price.toFixed(2)}€
          </p>
        </div>
      )}
    </div>
  );
}
