const ItemCard = ({ item, entry }) => {
  const iconPath = item.icon.replaceAll(' ', '_');

  // Updated by copilot when working on
  // caching item icons
  const encodedIcon = encodeURIComponent(iconPath);

  const formatNumber = (n) => {
    const num = Number(n);
    return Number.isFinite(num) ? num.toLocaleString() : (n ?? '—');
  };

  return (
    <div className='item-card'>
      <h2>{item.name}</h2>
      <p>{item.examine}</p>
      <img
        src={`http://localhost:8000/api/images/${encodedIcon}`}
        alt={item.name}
      />

      {entry && (
        <div className='entry-details'>
          <h3>Tracker Entry</h3>
          <p>
            <strong>{entry.typeLabel}</strong> {entry.quantity} x{' '}
            {entry.itemName}
          </p>
          {entry.typeLabel === 'Buying' && (
            <>
              <p>Price per item: {formatNumber(entry.pricePerItem)} GP</p>
              <p>Total cost: {formatNumber(entry.totalCost)} GP</p>
              <p>{entry.note}</p>
            </>
          )}
          {entry.typeLabel === 'Selling' && (
            <>
              <p>
                Sell price per item: {formatNumber(entry.sellPricePerItem)} GP
              </p>
              <p>
                Buy price per item: {formatNumber(entry.buyPricePerItem)} GP
              </p>
              <p>Tax per item: {formatNumber(entry.taxPerItem)} GP</p>
              <p>Total tax: {formatNumber(entry.totalTax)} GP</p>
              <p>Gross sale: {formatNumber(entry.grossSale)} GP</p>
              <p>Net sale: {formatNumber(entry.netSale)} GP</p>
              <p>Total buy cost: {formatNumber(entry.totalBuyCost)} GP</p>
              <p>
                Profit: {formatNumber(entry.profit)} GP (
                {formatNumber(entry.profitMarginPercent)}%)
              </p>
              <p>{entry.note}</p>
            </>
          )}
          {entry.typeLabel === 'High Alchemy' && (
            <>
              <p>
                High Alchemy value per item:{' '}
                {formatNumber(entry.alchValuePerItem)} GP
              </p>
              <p>
                Median buy price per item:{' '}
                {formatNumber(entry.medianBuyPricePerItem)} GP
              </p>
              <p>Total alch value: {formatNumber(entry.totalAlchValue)} GP</p>
              <p>Total buy cost: {formatNumber(entry.totalBuyCost)} GP</p>
              <p>Profit per item: {formatNumber(entry.profitPerItem)} GP</p>
              <p>
                Total profit: {formatNumber(entry.totalProfit)} GP (
                {formatNumber(entry.profitPercent)}%)
              </p>
            </>
          )}
          <p>
            <small>{new Date(entry.submittedAt).toLocaleString()}</small>
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
