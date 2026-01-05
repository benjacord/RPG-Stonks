import React from 'react';
import { useGame } from '../../context/GameContext';
import { WelcomeScreen } from '../Onboarding/WelcomeScreen';
import { PixelChatbot } from '../Chat/PixelChatbot';

export const RPGLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { user } = useGame();

    if (!user.onboarded) {
        return <WelcomeScreen />;
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Top Bar / HUD */}
            <header style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '4px solid var(--color-ui-border)',
                backgroundColor: 'var(--color-ui-bg)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-neutral)' }}>PLAYER</div>
                        <div style={{ fontSize: '1rem' }}>{user.name}</div>
                    </div>
                </div>

                <div>
                    {/* Placeholder for future gold/stats */}
                    <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>⚙️</span>
                </div>
            </header>

            {/* Main Content Area (Map) */}
            <main style={{
                flex: 1,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {children}
            </main>

            {/* Bottom Chatbot Placeholder */}
            <PixelChatbot />
        </div>
    );
};
