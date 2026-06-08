const ItemCard = ({ item }) => {
  return (
    <div className='item-card'>
      <h2>{item.name}</h2>
      <p>{item.examine}</p>
      <img src={`https://oldschool.runescape.wiki/images/${item.icon.replaceAll(" ", "_")}`} alt='' />
      <p>{item.high} GP</p>
      <p>Game ID: {item.id}</p>
      <p>GE Buy Limit: {item.limit}</p>
      <p>Low Alch Value: {item.lowalch} GP</p>
      <p>High Alch Value: {item.highalch} GP</p>
    </div>
  );
};

export default ItemCard;
