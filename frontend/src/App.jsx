import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import SavedEntriesPage from './pages/SavedEntriesPage';
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/entries' element={<SavedEntriesPage />} />
      </Routes>
    </>
  );
};

export default App;
