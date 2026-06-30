import { useItems } from '../context/ItemContext';
import ItemCard from '../components/ItemCard';

const HomePage = () => {
  const { loading, error, items } = useItems();

  console.log(items)
  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <div className='error'>{error.message || String(error)}</div>}
      <main>
        {
          items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        }
      </main>
    </>
  );
};

export default HomePage;
