const formatNumber = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return value;
  return new Intl.NumberFormat('en-US').format(value);
};

const TrackerResult = ({ response }) => {
  if (!response) return null;

  return (
    <div className='tracker-response'>
      <h3>Tracker Result</h3>
      <p>
        {response.typeLabel} {response.quantity} x {response.itemName}
      </p>
      {response.typeLabel === 'Buying' && (
        <>
          <p>Price per item: {formatNumber(response.pricePerItem)} GP</p>
          <p>Total cost: {formatNumber(response.totalCost)} GP</p>
          <p>{response.note}</p>
        </>
      )}
      {response.typeLabel === 'Selling' && (
        <>
          <p>
            Sell price per item: {formatNumber(response.sellPricePerItem)} GP
          </p>
          <p>Buy price per item: {formatNumber(response.buyPricePerItem)} GP</p>
          <p>Tax per item: {formatNumber(response.taxPerItem)} GP</p>
          <p>Total tax: {formatNumber(response.totalTax)} GP</p>
          <p>Gross sale: {formatNumber(response.grossSale)} GP</p>
          <p>Net sale: {formatNumber(response.netSale)} GP</p>
          <p>Total buy cost: {formatNumber(response.totalBuyCost)} GP</p>
          <p>
            Profit: {formatNumber(response.profit)} GP (
            {formatNumber(response.profitMarginPercent)}%)
          </p>
          <p>{response.note}</p>
        </>
      )}
      {response.typeLabel === 'High Alchemy' && (
        <>
          <p>
            High Alchemy value per item:{' '}
            {formatNumber(response.alchValuePerItem)} GP
          </p>
          <p>
            Median buy price per item:{' '}
            {formatNumber(response.medianBuyPricePerItem)} GP
          </p>
          <p>Total alch value: {formatNumber(response.totalAlchValue)} GP</p>
          <p>Total buy cost: {formatNumber(response.totalBuyCost)} GP</p>
          <p>Profit per item: {formatNumber(response.profitPerItem)} GP</p>
          <p>
            Total profit: {formatNumber(response.totalProfit)} GP (
            {formatNumber(response.profitPercent)}%)
          </p>
        </>
      )}
    </div>
  );
};

export default TrackerResult;
