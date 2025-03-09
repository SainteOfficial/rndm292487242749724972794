import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024 // 10MB default
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviewImages(prev => [...prev, ...newPreviews]);

    setUploading(true);
    const uploadPromises = acceptedFiles.map(async (file) => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('car-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);

        return publicUrl;
      } catch (error: any) {
        console.error('Error uploading image:', error.message);
        toast.error(`Fehler beim Hochladen von ${file.name}`);
        return null;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      if (validUrls.length > 0) {
        onImagesUploaded(validUrls);
        toast.success('Bilder erfolgreich hochgeladen');
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('Fehler beim Verarbeiten der Uploads');
    } finally {
      setUploading(false);
    }
  }, [onImagesUploaded]);

  const removePreview = (index: number) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles,
    maxSize,
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-orange-400 bg-orange-400/10'
            : 'border-gray-600 hover:border-orange-400 hover:bg-gray-800/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`w-12 h-12 ${isDragActive ? 'text-orange-400' : 'text-gray-400'}`} />
          {isDragActive ? (
            <p className="text-orange-400 font-medium">Dateien hier ablegen...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-300">
                Dateien hier ablegen oder klicken zum Auswählen
              </p>
              <p className="text-gray-400 text-sm">
                JPG, PNG oder WebP (max. {maxSize / 1024 / 1024}MB)
              </p>
              <p className="text-gray-400 text-sm">
                Maximal {maxFiles} {maxFiles === 1 ? 'Datei' : 'Dateien'}
              </p>
            </div>
          )}
        </div>
      </div>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previewImages.map((image, index) => (
            <div
              key={image.preview}
              className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Bilder werden hochgeladen...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;