import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Check, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

// Eine einfache SVG-Variante des Logos in Base64, falls das Original nicht geladen werden kann
const AUTO_LOGO_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgODAiPjxwYXRoIGZpbGw9IiNmZmE1MDAiIGQ9Ik0yMCA1MEgxMDBMMTIwIDMwSDIwMEwxNTAgNTBIMjAwTDE1MCA3MEg1MEwyMCA1MFoiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMGEwYTAiPkFVVE9TTUFZQTwvdGV4dD48L3N2Zz4=';

interface ImageUploadProps {
  onImagesUploaded?: (urls: string[]) => void;
  onUpload?: (file: File) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  bucketName?: string; // Neuer Prop für den Bucket-Namen
  enableWatermarkOption?: boolean; // Option zum Aktivieren der Wasserzeichen-Funktion
  watermarkPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; // Position des Wasserzeichens
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  onUpload,
  maxFiles = 60,
  maxSize = 10 * 1024 * 1024, // 10MB default
  bucketName = 'car-images', // Standardmäßig car-images verwenden
  enableWatermarkOption = false,
  watermarkPosition = 'topLeft',
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ total: 0, completed: 0 });
  const [applyWatermark, setApplyWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);

  // Hilfsfunktion: Bild laden
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${src}`));
      img.src = src;
    });
  };
  
  // Hilfsfunktion: Canvas zu Blob
  const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas konnte nicht in Blob umgewandelt werden'));
        }
      }, type);
    });
  };

  // Funktion zum Hinzufügen des Wasserzeichens zu einem Bild
  const applyWatermarkToImage = async (file: File, position: string): Promise<File> => {
    const toastId = toast.loading("Füge Wasserzeichen hinzu...");
    
    return new Promise((resolve, reject) => {
      try {
        // Originalbild in ein Image-Element laden
        const originalImg = document.createElement('img');
        originalImg.onload = function() {
          // Canvas für das neue Bild erstellen
          const canvas = document.createElement('canvas');
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            toast.error("Canvas-Kontext konnte nicht erstellt werden", { id: toastId });
            reject(new Error("Canvas-Kontext konnte nicht erstellt werden"));
            return;
          }
          
          // Originalbild auf Canvas zeichnen
          ctx.drawImage(originalImg, 0, 0);
          
          // Logo laden
          const logo = document.createElement('img');
          
          // Wenn Logo geladen ist, auf Canvas zeichnen
          logo.onload = function() {
            toast.success("Logo geladen", { id: toastId });
            
            // Wasserzeichen-Größe (20% der Bildbreite)
            const logoWidth = originalImg.width * 0.2;
            const logoHeight = (logo.height / logo.width) * logoWidth;
            
            // Wasserzeichen oben links positionieren
            ctx.drawImage(logo, 20, 20, logoWidth, logoHeight);
            
            // Canvas in Datei umwandeln
            canvas.toBlob((blob) => {
              if (blob) {
                toast.success("Wasserzeichen hinzugefügt", { id: toastId });
                const modifiedFile = new File([blob], file.name, { type: file.type });
                resolve(modifiedFile);
              } else {
                toast.error("Fehler beim Erstellen des Bildes", { id: toastId });
                reject(new Error("Fehler beim Erstellen des Bildes"));
              }
            }, file.type);
          };
          
          // Logo laden - mit absolutem Pfad
          logo.crossOrigin = "Anonymous";
          
          // URL zu verschiedenen möglichen Logo-Positionen
          const logoUrl1 = window.location.origin + '/logov2.png';
          const logoUrl2 = '/logov2.png';
          
          // Versuche einen der möglichen Pfade
          logo.onerror = function() {
            toast.error(`Logo konnte nicht von ${logo.src} geladen werden, versuche alternative URL`, { id: toastId });
            logo.src = logoUrl2;
            
            logo.onerror = function() {
              toast.error(`Logo konnte auch nicht von ${logoUrl2} geladen werden`, { id: toastId });
              reject(new Error("Logo konnte nicht geladen werden"));
            };
          };
          
          toast.loading(`Lade Logo von: ${logoUrl1}`, { id: toastId });
          logo.src = logoUrl1;
        };
        
        // Fehlerbehandlung für Originalbild
        originalImg.onerror = function() {
          toast.error("Originalbild konnte nicht geladen werden", { id: toastId });
          reject(new Error("Originalbild konnte nicht geladen werden"));
        };
        
        // Originalbild aus Datei laden
        originalImg.src = URL.createObjectURL(file);
        
      } catch (error) {
        toast.error(`Allgemeiner Fehler: ${(error as Error).message}`, { id: toastId });
        reject(error);
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviewImages(prev => [...prev, ...newPreviews]);

    setUploading(true);
    setUploadProgress({ total: acceptedFiles.length, completed: 0 });
    
    try {
      // Handle the onUpload prop for single file uploads
      if (onUpload) {
        // Parallele Verarbeitung aller Dateien statt sequentiell
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          // Wenn Wasserzeichen aktiviert ist, füge es hinzu
          let fileToUpload = file;
          if (enableWatermarkOption && applyWatermark) {
            try {
              fileToUpload = await applyWatermarkToImage(file, watermarkPosition);
            } catch (error) {
              console.error('Error applying watermark:', error);
              toast.error(`Fehler beim Hinzufügen des Wasserzeichens zu ${file.name}`);
            }
          }

          const result = await onUpload(fileToUpload);
          // Fortschritt aktualisieren
          setUploadProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
          return result;
        });
        await Promise.all(uploadPromises);
      } 
      // Handle the onImagesUploaded prop for batch uploads with URLs
      else if (onImagesUploaded) {
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Wenn Wasserzeichen aktiviert ist, füge das Wasserzeichen hinzu
            let fileToUpload = file;
            if (enableWatermarkOption && applyWatermark) {
              try {
                fileToUpload = await applyWatermarkToImage(file, watermarkPosition);
              } catch (watermarkError) {
                console.error('Error applying watermark:', watermarkError);
                toast.error(`Fehler beim Hinzufügen des Wasserzeichens zu ${file.name}`);
              }
            }

            const { error: uploadError, data } = await supabase.storage
              .from(bucketName) // Verwende den übergebenen Bucket-Namen
              .upload(filePath, fileToUpload);

            if (uploadError) {
              throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
              .from(bucketName) // Verwende den übergebenen Bucket-Namen
              .getPublicUrl(filePath);

            // Fortschritt aktualisieren
            setUploadProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
            
            return publicUrl;
          } catch (error: any) {
            console.error('Error uploading image:', error.message);
            toast.error(`Fehler beim Hochladen von ${file.name}`);
            
            // Fortschritt aktualisieren auch bei Fehler
            setUploadProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
            
            return null;
          }
        });

        const urls = await Promise.all(uploadPromises);
        const validUrls = urls.filter((url): url is string => url !== null);
        if (validUrls.length > 0) {
          onImagesUploaded(validUrls);
          toast.success(`${validUrls.length} ${validUrls.length === 1 ? 'Bild' : 'Bilder'} erfolgreich hochgeladen`);
        }
      } else {
        console.warn('Neither onImagesUploaded nor onUpload props were provided');
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('Fehler beim Verarbeiten der Uploads');
    } finally {
      setUploading(false);
      setUploadProgress({ total: 0, completed: 0 });
    }
  }, [onImagesUploaded, onUpload, bucketName, applyWatermark, enableWatermarkOption, watermarkPosition]);

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
    <div className={cn("w-full", className)}>
      {/* Wasserzeichen-Option */}
      {enableWatermarkOption && (
        <div className="mb-5 bg-gray-800/50 rounded-md p-4 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-2">Wasserzeichen</h3>
          <p className="text-gray-400 text-sm mb-3">
            Fügen Sie optional ein Wasserzeichen zu Ihren Bildern hinzu, um Ihren Inhalt zu schützen.
          </p>
          
          {/* Ersatz für Switch-Komponente */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setApplyWatermark(!applyWatermark)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                applyWatermark ? 'bg-[#14A79D]' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  applyWatermark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-300">
              {applyWatermark ? "Wasserzeichen aktiviert" : "Wasserzeichen deaktiviert"}
            </span>
          </div>
          
          {applyWatermark && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">Wasserzeichen-Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="z.B. © Autohaus Schmidt"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#14A79D]/20 focus:border-[#14A79D]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">Transparenz ({watermarkOpacity}%)</label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">0%</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#14A79D]"
                  />
                  <span className="text-xs text-gray-400">100%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drag & Drop Bereich */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer",
          isDragActive
            ? "border-[#14A79D] bg-[#14A79D]/5" 
            : "border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-800/70"
        )}
      >
        <div className="mb-4">
          <Upload className={cn(
            "h-10 w-10 transition-colors",
            isDragActive ? "text-[#14A79D]" : "text-gray-400"
          )} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          {isDragActive ? "Bilder hier ablegen" : "Klicken oder ziehen Sie Bilder hier hin"}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          Unterstützt werden JPG, PNG und WebP bis zu {maxSize / 1024 / 1024}MB
        </p>
        {uploading && (
          <p className="text-yellow-400 text-sm">
            Bitte warten Sie, bis der aktuelle Upload abgeschlossen ist...
          </p>
        )}
        <input {...getInputProps()} />
      </div>

      {/* Ausgewählte Bilder */}
      {previewImages.length > 0 && (
        <div className="mt-5">
          <h3 className="text-lg font-medium text-white mb-3">Ausgewählte Bilder ({previewImages.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
                <div className="relative aspect-square">
                  <img
                    src={image.preview}
                    alt={`Vorschau ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay mit Status */}
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all",
                    uploadProgress.completed > 0 && uploadProgress.completed < uploadProgress.total ? "bg-blue-500/10" : 
                    "bg-black/40 opacity-0 group-hover:opacity-100"
                  )}>
                    {uploadProgress.completed > 0 && uploadProgress.completed < uploadProgress.total && (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                        {uploadProgress.completed !== undefined && (
                          <span className="text-white text-xs font-medium">
                            {Math.round((uploadProgress.completed / uploadProgress.total) * 100)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Lösch-Button */}
                  {!uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(index);
                      }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {/* Dateiname */}
                <div className="p-2 text-xs truncate text-gray-300" title={image.file.name}>
                  {image.file.name.length > 20 ? image.file.name.substring(0, 20) + '...' : image.file.name}
                </div>
              </div>
            ))}
          </div>
          
          {/* Upload-Button und Aktionsleiste */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="text-sm text-gray-400">
              {uploadProgress.completed > 0 && (
                <span>{uploadProgress.completed} von {uploadProgress.total} Dateien hochgeladen</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewImages([])}
                disabled={uploading}
                className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center">
                  <X className="w-4 h-4 mr-2" /> Zurücksetzen
                </span>
              </button>
              <button
                onClick={() => onDrop(previewImages.map(p => p.file))}
                disabled={uploading || previewImages.length === 0}
                className="px-4 py-2 bg-[#14A79D] text-white rounded-md hover:bg-[#14A79D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird hochgeladen...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" /> Hochladen
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Status Zusammenfassung */}
      {uploadProgress.completed > 0 && uploadProgress.completed === uploadProgress.total && previewImages.length > 0 && (
        <div className="mt-5 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-400 font-medium">
              Upload erfolgreich abgeschlossen!
            </p>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            {uploadProgress.completed} {uploadProgress.completed === 1 ? 'Bild wurde' : 'Bilder wurden'} erfolgreich hochgeladen.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;