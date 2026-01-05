import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchPrice } from '../services/marketData';

// Types
export interface Asset {
    id: string;
    symbol: string; // e.g. "BTC", "AAPL"
    name: string;
    price: number;
    change24h: number; // Percentage
    type: 'crypto' | 'stock' | 'fx';
}

export interface UserProfile {
    name: string;
    onboarded: boolean;
}

interface GameContextType {
    user: UserProfile;
    assets: Asset[];
    setUser: (name: string) => void;
    addAsset: (asset: Asset) => void;
    removeAsset: (id: string) => void;
    updateAssetPrice: (id: string, price: number, change24h: number) => void;
    refreshPrices: () => Promise<void>;
}

const defaultUser: UserProfile = {
    name: 'Traveler',
    onboarded: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('rpg_user');
        return saved ? JSON.parse(saved) : defaultUser;
    });

    const [assets, setAssets] = useState<Asset[]>(() => {
        const saved = localStorage.getItem('rpg_assets');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('rpg_user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('rpg_assets', JSON.stringify(assets));
    }, [assets]);

    const setUser = (name: string) => {
        setUserState({ name, onboarded: true });
    };

    const addAsset = (asset: Asset) => {
        if (assets.some((a) => a.symbol === asset.symbol)) return; // Prevent duplicates
        setAssets((prev) => [...prev, asset]);
    };

    const removeAsset = (id: string) => {
        setAssets((prev) => prev.filter((a) => a.id !== id));
    };

    const updateAssetPrice = (id: string, price: number, change24h: number) => {
        setAssets((prev) =>
            prev.map((a) => (a.id === id ? { ...a, price, change24h } : a))
        );
    };

    const refreshPrices = async () => {
        const updated = await Promise.all(assets.map(async (asset) => {
            const data = await fetchPrice(asset.symbol, asset.type);
            // Only update if valid data returned, otherwise keep old
            if (data.price !== 0) {
                return { ...asset, price: data.price, change24h: data.change24h };
            }
            return asset;
        }));
        setAssets(updated);
    };

    // Auto-refresh every 60s
    useEffect(() => {
        if (assets.length === 0) return;
        const interval = setInterval(refreshPrices, 60000);
        return () => clearInterval(interval);
    }, [assets.length]);

    // Initial refresh logic setup
    useEffect(() => {
        if (assets.length > 0) {
            refreshPrices();
        }
    }, []);

    return (
        <GameContext.Provider value={{ user, assets, setUser, addAsset, removeAsset, updateAssetPrice, refreshPrices }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
