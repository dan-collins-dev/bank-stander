export const getMappingData = async () => {
  try {
    const res = await fetch(
      'https://prices.runescape.wiki/api/v1/osrs/mapping',
    );
    if (!res.ok) throw new Error('Request to /mapping failed.');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

export const getLatestPriceData = async () => {
  try {
    const res = await fetch('https://prices.runescape.wiki/api/v1/osrs/latest');
    if (!res.ok) throw new Error('Request to /latest failed.');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

export const combineData = (mapping, latestPrices) => {
  const prices = mapping.map((item) => ({
    ...item,
    ...latestPrices.data[String(item.id)],
  }));

  const finalData = prices.map(item => ({
    ...item,
    highAlchProfitHigh: item.highalch - item.high,
    highAlchProfitLow: item.highalch - item.low,
    medianBuyPrice: Math.floor((item.high + item.low) / 2)
  }))

  // console.log(finalData.slice(0, 10))
  return finalData;
};
