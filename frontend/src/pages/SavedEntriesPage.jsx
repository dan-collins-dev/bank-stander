import { useState, useMemo } from 'react';
import ItemCard from '../components/ItemCard';

const getProfitMetric = (entry) => {
  if (typeof entry.totalProfit === 'number') return entry.totalProfit;
  if (typeof entry.netSale === 'number') return entry.netSale;
  return 0;
};

const SavedEntriesPage = () => {
  const [entryLimit, setEntryLimit] = useState('10');
  const entries = useMemo(() => {
    if (typeof window === 'undefined') return [];

    try {
      const saved = JSON.parse(localStorage.getItem('trackerEntries') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (err) {
      console.error('Failed to load tracker entries', err);
      return [];
    }
  }, []);

  const sortedEntries = useMemo(() => {
    return entries
      .filter((entry) => entry.item)
      .slice()
      .sort((a, b) => getProfitMetric(b) - getProfitMetric(a));
  }, [entries]);

  const displayedEntries = useMemo(() => {
    const limit = entryLimit === 'all' ? sortedEntries.length : Number(entryLimit);
    return sortedEntries.slice(0, limit);
  }, [entryLimit, sortedEntries]);

  if (entries.length === 0) {
    return (
      <main>
        <h2>Saved Entries</h2>
        <p>No saved tracker entries found.</p>
      </main>
    );
  }

  return (
    <main>
      <h2>Saved Entries</h2>
      <div className='tracker-list-settings'>
        <label htmlFor='entry-limit'>Display limit</label>
        <select
          id='entry-limit'
          value={entryLimit}
          onChange={(e) => setEntryLimit(e.target.value)}
        >
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='50'>50</option>
          <option value='all'>All</option>
        </select>
      </div>

      <div className='saved-entries-grid'>
        {displayedEntries.map((entry, index) => (
          <ItemCard key={`${entry.submittedAt}-${index}`} item={entry.item} entry={entry} />
        ))}
      </div>
    </main>
  );
};

export default SavedEntriesPage;
