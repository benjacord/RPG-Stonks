import React from 'react';

interface PixelCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`pixel-card ${className}`} style={{
            backgroundColor: 'var(--color-ui-bg)',
            border: '4px solid var(--color-ui-border)',
            padding: '16px',
            position: 'relative',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
        }}>
            {title && (
                <div style={{
                    backgroundColor: 'var(--color-ui-border)',
                    color: 'var(--color-ui-bg)',
                    display: 'inline-block',
                    padding: '4px 8px',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.8rem',
                    position: 'absolute',
                    top: '-16px',
                    left: '12px',
                    textTransform: 'uppercase'
                }}>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};
