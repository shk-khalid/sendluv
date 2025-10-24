import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './PhotoUpload.css';

export default function PhotoUpload({ onPhotoUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    try {
      setError(null);
      
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

      // Callback with photo URL
      if (onPhotoUploaded) {
        onPhotoUploaded(publicUrl);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload">
      <input
        type="file"
        id="photo-input"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      <label htmlFor="photo-input" className={`upload-button ${uploading ? 'uploading' : ''}`}>
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </label>
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}

