import { Link } from 'react-router';

const Header = () => {
  return (
    <header className='header'>
      <img
        src='https://oldschool.runescape.wiki/images/Coins_10000.png?7fa38'
        alt=''
      />
      <div>
        <h1>Bank Stander</h1>
        <nav>
          <Link to='/'>Home</Link> | <Link to='/entries'>Saved Entries</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
