import { useEffect, useState } from 'react';
import './PhotoOverlay.css';

export default function PhotoOverlay({ photoUrl, onClose }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    console.log('PhotoOverlay received URL:', photoUrl);
  }, [photoUrl]);

  if (!photoUrl) return null;

  return (
    <div
      className="photo-overlay"
      onClick={onClose}
      role="dialog"
      tabIndex={-1}
    >
      <div className="photo-card">
        {imageError && (
          <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
            <p>❌ Failed to load image</p>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', marginTop: '10px' }}>
              URL: {photoUrl}
            </p>
          </div>
        )}
        {!imageLoaded && !imageError && (
          <div style={{ color: 'white', padding: '20px' }}>
            Loading image...
          </div>
        )}
        <img 
          src={photoUrl} 
          alt="Birthday celebration" 
          onLoad={() => {
            console.log('Image loaded successfully');
            setImageLoaded(true);
          }}
          onError={(e) => {
            console.error('Image failed to load:', photoUrl);
            console.error('Error event:', e);
            setImageError(true);
          }}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
}

