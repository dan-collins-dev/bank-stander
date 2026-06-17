import { createContext, useState, useEffect, useContext } from 'react';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/items');
        if (!res.ok) throw new Error('Failed to retrieve from /items');
        const data = await res.json();
        console.log('LOGGING FROM CONTEXT');
        setItems(data);
      } catch (error) {
        console.log(error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const sayHello = (e) => {
    console.log("HELLO", e.target.checked)
  }

  return (
    <ItemContext.Provider value={{ items, loading, error, sayHello }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  return useContext(ItemContext);
};
