import { useState, useCallback } from 'react';
import { useItems } from '../context/ItemContext';
import TrackerForm from '../components/TrackerForm';
import TrackerResult from '../components/TrackerResult';

const HomePage = () => {
  const { loading, error } = useItems();
  const [trackerResult, setTrackerResult] = useState(null);

  const handleFormChange = useCallback(() => {
    setTrackerResult(null);
  }, [setTrackerResult]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <div className='error'>{error.message || String(error)}</div>}
      <main>
        <section>
          <TrackerForm
            onResult={setTrackerResult}
            onFormChange={handleFormChange}
          />
        </section>
        <section>
          <TrackerResult response={trackerResult} />
        </section>
      </main>
    </>
  );
};

export default HomePage;
