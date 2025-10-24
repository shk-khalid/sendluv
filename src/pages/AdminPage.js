import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AdminPage.css';

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [shareableLink, setShareableLink] = useState(null);

  const handleFileSelect = async (event) => {
    try {
      setError(null);
      setShareableLink(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('overlays')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('overlays')
        .getPublicUrl(filePath);

      console.log('Uploaded file path:', filePath);
      console.log('Generated public URL:', publicUrl);

      setUploadedPhotoUrl(publicUrl);
      
      // Generate shareable link
      const baseUrl = window.location.origin;
      const basePath = process.env.NODE_ENV === 'production' ? '/bdaycakee' : '';
      const encodedUrl = encodeURIComponent(publicUrl);
      const link = `${baseUrl}${basePath}/celebrate?photo=${encodedUrl}`;
      
      console.log('Shareable link:', link);
      setShareableLink(link);

    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>🎂 Create Birthday Celebration</h1>
        <p className="subtitle">Upload a photo and share the magic with your loved one</p>

        <div className="upload-section">
          <input
            type="file"
            id="admin-photo-input"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="admin-photo-input" 
            className={`admin-upload-button ${uploading ? 'uploading' : ''}`}
          >
            {uploading ? 'Uploading...' : '📸 Upload Photo'}
          </label>
          
          {error && <div className="admin-error">{error}</div>}
        </div>

        {uploadedPhotoUrl && (
          <div className="preview-section">
            <h2>Preview</h2>
            <div className="photo-preview">
              <img src={uploadedPhotoUrl} alt="Uploaded preview" />
            </div>
          </div>
        )}

        {shareableLink && (
          <div className="link-section">
            <h2>🎉 Shareable Link Ready!</h2>
            <p>Send this link to your loved one:</p>
            <div className="link-container">
              <input 
                type="text" 
                value={shareableLink} 
                readOnly 
                className="link-input"
              />
              <button onClick={copyToClipboard} className="copy-button">
                📋 Copy
              </button>
            </div>
            <div className="instructions">
              <h3>How it works:</h3>
              <ol>
                <li>Share the link with the birthday person</li>
                <li>They'll see the birthday cake animation</li>
                <li>When they sing/blow, the cake will grow</li>
                <li>After confetti, your photo will appear! 🎊</li>
              </ol>
            </div>
          </div>
        )}

        <div className="footer-note">
          <p>💡 Tip: Each photo upload generates a unique link</p>
        </div>
      </div>
    </div>
  );
}

