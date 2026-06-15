const ItemCard = ({ item }) => {
  const iconPath = item.icon.replaceAll(' ', '_');

  // Updated by copilot when working on
  // caching item icons
  const encodedIcon = encodeURIComponent(iconPath);

  return (
    <div className='item-card'>
      <h2>{item.name}</h2>
      <p>{item.examine}</p>
      <img
        src={`http://localhost:8000/api/images/${encodedIcon}`}
        alt={item.name}
      />
      <p>{item.high} GP</p>
      <p>Game ID: {item.id}</p>
      <p>GE Buy Limit: {item.limit}</p>
      <p>High Alch Value: {item.highalch} GP</p>
      <p>Latest Low Price: {item.low}</p>
      <p>Latest High Price: {item.high}</p>
      <p>High Alch Profit/Loss (Low Price): {item.highalch - item.low} GP</p>
      <p>High Alch Profit/Loss (High Price): {item.highalch - item.high} GP</p>
    </div>
  );
};

export default ItemCard;
