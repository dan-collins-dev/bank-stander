import { useState, useEffect, useRef } from 'react';
import { useItems } from '../context/ItemContext';

const formatNumber = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return value;
  return new Intl.NumberFormat('en-US').format(value);
};

const TrackerForm = ({ onResult, onFormChange }) => {
  const { items, loading, error } = useItems();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [showNonMemberOnly, setShowNonMemberOnly] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  const filteredItems = showNonMemberOnly
    ? items.filter((item) => item.members === false)
    : items;

  const selectedItem = filteredItems.find(
    (item) => String(item.id) === String(selectedItemId),
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const _isFirst = useRef(true);
  useEffect(() => {
    if (_isFirst.current) {
      _isFirst.current = false;
      return;
    }
    // re-enable submit when user changes the form
    setIsSubmitted(false);
    if (typeof onFormChange === 'function') {
      onFormChange();
    }
  }, [
    selectedCategory,
    selectedItemId,
    quantity,
    buyPrice,
    sellPrice,
    unitPrice,
    showNonMemberOnly,
    onFormChange,
  ]);

  const resetInputs = () => {
    setSelectedItemId('');
    setBuyPrice('');
    setSellPrice('');
    setUnitPrice('');
    setQuantity(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    resetInputs();
  };

  const handleMemberToggle = () => {
    setShowNonMemberOnly((prev) => !prev);
    setSelectedItemId('');
  };

  const saveSubmission = (entry) => {
    if (typeof window === 'undefined') return;

    try {
      const existing = JSON.parse(
        localStorage.getItem('trackerEntries') || '[]',
      );
      const updated = [...(Array.isArray(existing) ? existing : []), entry];
      localStorage.setItem('trackerEntries', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save tracker entry', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedItem) return;

    const qty = Number(quantity);
    if (!qty || qty < 1) return;

    if (selectedCategory === 'buy' && !unitPrice) return;
    if (selectedCategory === 'sell' && (!sellPrice || !buyPrice)) return;

    let result = {
      category: selectedCategory,
      itemName: selectedItem.name,
      item: selectedItem,
      quantity: qty,
      submittedAt: new Date().toISOString(),
    };

    if (selectedCategory === 'buy') {
      const price = Number(unitPrice);
      const total = price * qty;
      result = {
        ...result,
        typeLabel: 'Buying',
        pricePerItem: price,
        totalCost: total,
        note: `Buy order cost uses ${formatNumber(price)} GP per item.`,
      };
    } else if (selectedCategory === 'sell') {
      const pricePerItem = Number(sellPrice);
      const purchasePrice = Number(buyPrice);

      let taxPerItem = 0;
      if (pricePerItem > 50) {
        const rawTax = pricePerItem * 0.02;
        taxPerItem = rawTax > 5000000 ? purchasePrice + 5000000 : rawTax;
      }

      const gross = pricePerItem * qty;
      const totalTax = taxPerItem * qty;
      const net = gross - totalTax;
      const totalBuyCost = purchasePrice * qty;
      const profit = net - totalBuyCost;
      const profitMarginPercent = totalBuyCost
        ? (profit / totalBuyCost) * 100
        : 0;

      result = {
        ...result,
        typeLabel: 'Selling',
        sellPricePerItem: pricePerItem,
        buyPricePerItem: purchasePrice,
        taxPerItem,
        totalTax,
        grossSale: gross,
        netSale: net,
        totalBuyCost,
        profit,
        profitMarginPercent,
        note:
          pricePerItem <= 50
            ? 'No Grand Exchange tax applies for sell prices up to 50 GP.'
            : taxPerItem === purchasePrice + 5000000
              ? '2% tax exceeded 5,000,000 GP; using capped formula buy price + 5,000,000 GP.'
              : '2% Grand Exchange tax applied.',
      };
    } else if (selectedCategory === 'highAlch') {
      const alchValue = Number(selectedItem.highalch || 0);
      const buyBasis = Number(selectedItem.medianBuyPrice || 0);
      const totalAlchValue = alchValue * qty;
      const totalBuyCost = buyBasis * qty;
      const profitPerItem = alchValue - buyBasis;
      const totalProfit = totalAlchValue - totalBuyCost;
      const profitPercent = buyBasis ? (profitPerItem / buyBasis) * 100 : 0;

      result = {
        ...result,
        typeLabel: 'High Alchemy',
        alchValuePerItem: alchValue,
        medianBuyPricePerItem: buyBasis,
        totalAlchValue,
        totalBuyCost,
        profitPerItem,
        totalProfit,
        profitPercent,
      };
    }

    saveSubmission(result);
    if (typeof onResult === 'function') onResult(result);
    setIsSubmitted(true);
  };

  if (loading) {
    return <p>Loading items...</p>;
  }

  if (error) {
    return <div className='error'>{error.message || String(error)}</div>;
  }

  return (
    <form className='tracker-form' onSubmit={handleSubmit}>
      <div className='category-section'>
        <label htmlFor='category-select'>Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          name='categories'
          id='category-select'
          required
        >
          <option value=''>-- Select an option --</option>
          <option value='buy'>Buy</option>
          <option value='sell'>Sell</option>
          <option value='highAlch'>High Alch</option>
        </select>
      </div>

      <div className='f2p-selection'>
        <label htmlFor='members-toggle'>Show non-member items only</label>
        <input
          checked={showNonMemberOnly}
          onChange={handleMemberToggle}
          type='checkbox'
          name='membersToggle'
          id='members-toggle'
        />
      </div>

      <div className='item-selection'>
        <label htmlFor='item-select'>Select an item</label>
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          name='names'
          id='item-select'
          required
        >
          <option value=''>-- Select an option --</option>
          {filteredItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && selectedItem && (
        <div className='tracker-form-details'>
          <label htmlFor='item-qty'>Quantity</label>
          <input
            type='number'
            name='qty'
            id='item-qty'
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder='1'
            required
          />

          {selectedCategory === 'buy' && (
            <>
              <label htmlFor='unit-price'>Buy price per item (GP)</label>
              <input
                type='number'
                name='unitPrice'
                id='unit-price'
                min={0}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder={selectedItem.medianBuyPrice || 'Enter price'}
              />
            </>
          )}

          {selectedCategory === 'sell' && (
            <>
              <label htmlFor='sell-price'>Sell price per item (GP)</label>
              <input
                type='number'
                name='sellPrice'
                id='sell-price'
                min={0}
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder={selectedItem.high || 'Enter price'}
                required
              />

              <label htmlFor='buy-price'>Buy price per item (GP)</label>
              <input
                type='number'
                name='buyPrice'
                id='buy-price'
                min={0}
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder={selectedItem.medianBuyPrice || 'Enter price'}
                required
              />
            </>
          )}

          {selectedCategory === 'highAlch' && (
            <p>
              High Alchemy value per item:{' '}
              {formatNumber(Number(selectedItem.highalch || 0))} GP
            </p>
          )}
        </div>
      )}

      <button type='submit' disabled={!selectedCategory || !selectedItem || isSubmitted}>
        {isSubmitted ? 'Submitted' : 'Add to Tracker'}
      </button>
    </form>
  );
};

export default TrackerForm;
