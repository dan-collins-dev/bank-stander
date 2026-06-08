import { useState, useEffect, useMemo } from 'react';
import ItemCard from './components/ItemCard';
const MAPPING_ENDPOINT = 'https://prices.runescape.wiki/api/v1/osrs/mapping';
const LATEST_ENDPOINT = 'https://prices.runescape.wiki/api/v1/osrs/latest';

const App = () => {
  const [itemMappingData, setItemMappingData] = useState([]);
  const [latestData, setLatestData] = useState({});
  const [loadingMapping, setLoadingMapping] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestPrices = async () => {
      try {
        const res = await fetch(LATEST_ENDPOINT);
        if (!res.ok) throw new Error('API callout failure');
        const data = await res.json();
        setLatestData(data.data);
      } catch (error) {
        console.log(error.message);
        setError(error);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchLatestPrices();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(MAPPING_ENDPOINT);
        if (!res.ok) throw new Error('API callout failure');
        const data = await res.json();
        setItemMappingData(data.filter((item) => item.members !== true));
      } catch (error) {
        console.log(error.message);
        setError(error);
      } finally {
        setLoadingMapping(false);
      }
    };

    fetchItems();
  }, []);

  // Used co-pilot to fix some issues I ran into trying 
  // to combine data from both endpoints. Was missing null checks
  // originally and didn't have separate loading states for each
  // request
  const items = useMemo(() => {
    if (!latestData || Object.keys(latestData).length === 0) return [];

    return Object.entries(latestData)
      .map(([id, priceData]) => {
        const mappingItem = itemMappingData.find(
          (item) => item.id === parseInt(id),
        );
        if (!mappingItem) return null;
        return {
          ...mappingItem,
          ...priceData,
        };
      })
      .filter((item) => item !== null);
  }, [itemMappingData, latestData]);

  const loading = loadingMapping || loadingLatest;

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
