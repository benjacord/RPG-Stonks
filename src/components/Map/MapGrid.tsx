import React, { useState } from 'react';
import { useGame, type Asset } from '../../context/GameContext';
import { AssetCharacter } from '../Asset/AssetCharacter';
import { PixelCard } from '../Layout/PixelCard';
import { PixelChart } from '../Asset/PixelChart';

export const MapGrid: React.FC = () => {
    const { assets, addAsset } = useGame();

    // Temporary: Add mock data if empty
    React.useEffect(() => {
        if (assets.length === 0) {
            // We can leave it empty or pre-populate. 
            // Let's leave it to user to add via the new UI.
        }
    }, []);

    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newSymbol, setNewSymbol] = useState('');

    const handleAdd = () => {
        if (!newSymbol) return;
        // Start with 0 price, it will update on refresh
        addAsset({
            id: Date.now().toString(),
            symbol: newSymbol.trim().toUpperCase(),
            name: newSymbol.trim().toUpperCase(),
            price: 0,
            change24h: 0,
            type: 'crypto' // Default to crypto for now
        });
        setNewSymbol('');
        setIsAdding(false);
    };

    return (
        <div style={{ height: '100%', position: 'relative' }}>

            {/* Grid Area */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '32px',
                padding: '32px'
            }}>
                {assets.map(asset => (
                    <AssetCharacter
                        key={asset.id}
                        asset={asset}
                        onClick={setSelectedAsset}
                    />
                ))}

                {/* Add Button */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 0.8,
                    border: '2px dashed var(--color-ui-border)',
                    borderRadius: '8px',
                    minHeight: '80px',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                }} onClick={() => setIsAdding(true)}>
                    <div style={{ fontSize: '2rem' }}>➕</div>
                    <div style={{ fontSize: '0.6rem', marginTop: '4px' }}>Recruit</div>
                </div>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div style={{
                    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setIsAdding(false)}>
                    <div onClick={e => e.stopPropagation()}>
                        <PixelCard title="Recruit Asset">
                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', minWidth: '200px' }}>
                                <label style={{ fontSize: '0.7rem' }}>Symbol (e.g. BTC, ETH)</label>
                                <input
                                    autoFocus
                                    value={newSymbol}
                                    onChange={e => setNewSymbol(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                />
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <button onClick={handleAdd} style={{ flex: 1 }}>Add</button>
                                    <button onClick={() => setIsAdding(false)} style={{ flex: 1 }}>Cancel</button>
                                </div>
                            </div>
                        </PixelCard>
                    </div>
                </div>
            )}

            {/* Asset Detail Overlay */}
            {selectedAsset && (
                <div style={{
                    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setSelectedAsset(null)}>
                    <div onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px' }}>
                        <PixelCard title={selectedAsset.name}>
                            <div style={{ textAlign: 'center' }}>
                                <h3>{selectedAsset.symbol}</h3>
                                <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>${selectedAsset.price.toLocaleString()}</p>
                                <p style={{
                                    color: selectedAsset.change24h >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                }}>
                                    {selectedAsset.change24h > 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}% (24h)
                                </p>

                                <div style={{ margin: '16px 0' }}>
                                    <PixelChart color={selectedAsset.change24h >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} />
                                </div>

                                <button onClick={() => setSelectedAsset(null)} style={{ marginTop: '8px', width: '100%' }}>Close</button>
                            </div>
                        </PixelCard>
                    </div>
                </div>
            )}
        </div>
    );
};
