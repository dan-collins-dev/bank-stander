export type Item = {
	examine: string;
	id: number;
	members: boolean;
	lowalch: number;
	limit: number;
	highalch: number;
	value: number;
	icon: string;
	name: string;
	high: number;
	low: number;
	highTime: number;
	lowTime: number;
};

type PriceData = {
	high: number;
	low: number;
	highTime: number;
	lowTime: number;
	[key: string]: unknown;
};

type LatestItem = {
	data: Record<string, PriceData>;
}

export const getMappingData = async (): Promise<Item[]> => {
	try {
		const res = await fetch(
			'https://prices.runescape.wiki/api/v1/osrs/mapping',
		);
		if (!res.ok) throw new Error('Request to /mapping failed.');
		const data: Item[] = await res.json();
		return data.filter((item): item is Item => item.members !== true);
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
		else {
			console.log("An error occured", err)
		}

		return [];
	}
};

export const getLatestPriceData = async (): Promise<LatestItem> => {
	try {
		const res = await fetch('https://prices.runescape.wiki/api/v1/osrs/latest');
		if (!res.ok) throw new Error('Request to /latest failed.');
		const data: LatestItem = await res.json();
		return data;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
		else {
			console.log("An error occured", err)
		}

		return { data: {} };
	}
};

export const combineData = (mapping: Item[], latestPrices: LatestItem = { data: {} }) => {
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

	return finalData;
};
