import React from 'react';
import type { Asset } from '../../context/GameContext';

interface AssetCharacterProps {
    asset: Asset;
    onClick: (asset: Asset) => void;
}

export const AssetCharacter: React.FC<AssetCharacterProps> = ({ asset, onClick }) => {
    const isPositive = asset.change24h >= 0;
    const color = isPositive ? 'var(--color-success)' : 'var(--color-danger)';

    // Choose sprite based on type (Placeholder pixel art using colored blocks/emojis for now)
    const getSprite = () => {
        if (asset.type === 'crypto') return '🪙';
        if (asset.type === 'stock') return '📜';
        return '💰';
    };

    return (
        <div
            onClick={() => onClick(asset)}
            className="animate-float"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px',
                transition: 'transform 0.1s'
            }}
        >
            {/* Name Tag */}
            <div style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '2px 4px',
                fontSize: '0.6rem',
                borderRadius: '4px',
                marginBottom: '4px',
                whiteSpace: 'nowrap'
            }}>
                {asset.symbol}
            </div>

            {/* Character Sprite (Placeholder) */}
            <div style={{
                fontSize: '2rem',
                filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))'
            }}>
                {getSprite()}
            </div>

            {/* Price Tag */}
            <div style={{
                marginTop: '4px',
                fontSize: '0.6rem',
                color: '#fff',
                textShadow: `1px 1px 0 #000`,
                backgroundColor: color,
                padding: '2px 4px',
                borderRadius: '2px'
            }}>
                ${asset.price.toLocaleString()}
            </div>
        </div>
    );
};
