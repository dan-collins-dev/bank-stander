import { useState, useEffect } from 'react';
import ItemCard from './components/ItemCard';

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/items');
        if (!res.ok) throw new Error('API callout failure');
        const data = await res.json();
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

  return (
    <>
      <header className='header'>
        <h1>Bank Stander</h1>
      </header>
      <main>
        {loading && <p>Loading...</p>}
        {error && <div className='error'>{error}</div>}

        {!loading && !error && (
          <div className='item-container'>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default App;
