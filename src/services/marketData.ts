// Basic Market Data Service
// Uses CoinGecko for Crypto (Free Tier)
// Uses Yahoo Finance (Unofficial) for Stocks

const CACHE_DURATION = 60 * 1000; // 1 minute local cache

interface CacheItem {
    price: number;
    timestamp: number;
    change24h: number;
}

const priceCache: Record<string, CacheItem> = {};

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase();

// Mapping for CoinGecko IDs
const COINGECKO_MAP: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'DOGE': 'dogecoin',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'SHIB': 'shiba-inu',
    'LTC': 'litecoin',
    'LINK': 'chainlink',
    'BCH': 'bitcoin-cash',
    'ALGO': 'algorand',
};

// Fetch Stock data from Yahoo Finance
const fetchStockPrice = async (symbol: string): Promise<{ price: number; change24h: number } | null> => {
    try {
        console.log(`[MarketData] Fetching Stock ${symbol} from Yahoo...`);
        // Yahoo Finance Unofficial Chart API
        // This endpoint often works without authentication for simple data.
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`); // range=5d to ensure we get previous close if weekend

        if (!response.ok) throw new Error(`Yahoo API Error: ${response.status}`);
        const data = await response.json();

        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            return null;
        }

        const result = data.chart.result[0];
        const meta = result.meta;
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose;

        // Calculate change
        const change = price - prevClose;
        const changePercent = (change / prevClose) * 100;

        return { price, change24h: changePercent };

    } catch (e) {
        console.warn(`[MarketData] Yahoo Stock fetch failed for ${symbol}:`, e);
        return null;
    }
};

export const fetchPrice = async (symbol: string, type: 'crypto' | 'stock' | 'fx'): Promise<{ price: number; change24h: number }> => {
    const normalized = normalizeSymbol(symbol);

    // 1. Check Cache
    const cached = priceCache[normalized];
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log(`[MarketData] Returning cached data for ${normalized}`);
        return { price: cached.price, change24h: cached.change24h };
    }

    try {
        let price = 0;
        let change24h = 0;
        let found = false;

        // 2. Try CoinGecko (Crypto)
        // Check map logic or if type is explicitly crypto
        if (COINGECKO_MAP[normalized]) {
            const id = COINGECKO_MAP[normalized];
            console.log(`[MarketData] Fetching Crypto ${normalized} (id: ${id})...`);

            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`);
                if (response.ok) {
                    const data = await response.json();
                    if (data[id]) {
                        price = data[id].usd;
                        change24h = data[id].usd_24h_change;
                        found = true;
                    }
                }
            } catch (err) {
                console.error(`[MarketData] CoinGecko failed for ${normalized}`, err);
            }
        }

        // 3. Fallback to Yahoo Finance (Stocks or unknown Crypto)
        // If not found in CoinGecko Map, OR if CoinGecko failed, try Yahoo.
        if (!found) {
            // Yahoo handles Crypto tickers too (e.g. BTC-USD), but we prefer CoinGecko for now.
            // Yahoo handles Stocks (AAPL, GOOG).
            const stockData = await fetchStockPrice(normalized);
            if (stockData) {
                price = stockData.price;
                change24h = stockData.change24h;
                found = true;
            }
        }

        if (found) {
            // Update Cache
            priceCache[normalized] = { price, change24h, timestamp: Date.now() };
            return { price, change24h };
        }

        // 4. Return 0 if absolutely failed (No more random mock data)
        console.warn(`[MarketData] No data found for ${normalized}.`);
        return { price: 0, change24h: 0 };

    } catch (error) {
        console.error(`[MarketData] Critical Error fetching ${normalized}:`, error);
        return { price: 0, change24h: 0 };
    }
};
