import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelCard } from '../Layout/PixelCard';

export const WelcomeScreen: React.FC = () => {
    const { setUser } = useGame();
    const [nameInput, setNameInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameInput.trim()) {
            setUser(nameInput.trim());
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--color-bg)',
            backgroundImage: 'radial-gradient(circle, var(--color-bg) 20%, var(--color-bg-dark) 100%)'
        }}>
            <PixelCard title="Welcome Traveler" className="animate-float">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                        Welcome to the Realm of Prices
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>
                        Track your treasures and watch the markets.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>How shall we call you?</label>
                        <input
                            type="text"
                            placeholder="Enter name..."
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            autoFocus
                            maxLength={15}
                        />
                    </div>

                    <button type="submit" disabled={!nameInput.trim()}>
                        Start Adventure
                    </button>
                </form>
            </PixelCard>

            <p style={{ marginTop: '32px', fontSize: '0.6rem', opacity: 0.7 }}>
                v1.0.0 &bull; Pixel Price Tracker
            </p>
        </div>
    );
};
