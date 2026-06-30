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
    </div>
  );
};

export default ItemCard;
