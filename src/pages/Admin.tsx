import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  LogOut,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  ChevronDown,
  ToggleLeft as Toggle,
  Grid,
  List,
  CheckSquare,
  Check,
  Trash,
  Car,
  Info,
  FileCheck,
  Shield,
  Calendar,
  Gauge,
  Star,
  Settings,
  BookCheck,
  Award,
  Heart,
  File,
  Activity,
  Eye,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import { Sparkles } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars');

  // State for gallery management
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCarForGallery, setSelectedCarForGallery] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [galleryView, setGalleryView] = useState<'grid' | 'list'>('grid');
  const [gallerySort, setGallerySort] = useState<{ field: string, direction: 'asc' | 'desc' }>({
    field: 'created_at',
    direction: 'desc'
  });

  const categories = [
    'Exterieur',
    'Interieur',
    'Motor',
    'Felgen',
    'Frontansicht',
    'Heckansicht',
    'Seitenansicht',
    'Detail',
    'Cockpit',
    'Sonstiges'
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  // Fetch gallery images when tab changes to gallery
  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGalleryImages();
    }
  }, [activeTab, filterCategory, gallerySort]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsedCars = data?.map(car => ({
        ...car,
        specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        condition: typeof car.condition === 'string' ? JSON.parse(car.condition) : car.condition,
        additionalFeatures: car.additionalfeatures
      })) || [];

      setCars(parsedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Fehler beim Laden der Fahrzeuge');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/admin/login');
      toast.success('Erfolgreich abgemeldet');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Fehler beim Abmelden');
    }
  };

  const handleSave = async (car: any) => {
    try {
      // Validiere die wichtigsten Felder
      if (!car.brand || !car.model) {
        toast.error('Marke und Modell sind Pflichtfelder');
        return;
      }

      if (car.price <= 0) {
        toast.error('Bitte geben Sie einen gültigen Preis ein');
        return;
      }

      // Prüfe, ob mindestens ein Bild vorhanden ist
      if (!car.images || car.images.length === 0) {
        toast.info('Das Fahrzeug hat keine Bilder. Fahrzeuge mit Bildern werden besser wahrgenommen.');
      }

      // Create a copy of the car object with the correct field name
      const carToSave = {
        ...car,
        additionalfeatures: car.additionalFeatures, // Map to the correct field name
        specs: JSON.stringify(car.specs),
        condition: JSON.stringify(car.condition)
      };

      // Remove the original additionalFeatures field
      delete carToSave.additionalFeatures;

      // Sicherstellen, dass bei neuen Autos keine ID gesendet wird
      const isNewCar = !car.id;
      if (isNewCar) {
        delete carToSave.id;
      }

      // Zeige Ladetoast an
      const toastId = toast.loading(isNewCar ? 'Fahrzeug wird erstellt...' : 'Fahrzeug wird aktualisiert...');

      const { data, error } = await supabase
        .from('cars')
        .upsert(carToSave)
        .select();

      if (error) throw error;

      // Schließe Ladetoast
      toast.dismiss(toastId);

      // Erfolgstoast mit mehr Details
      if (isNewCar) {
        toast.success(`Fahrzeug "${car.brand} ${car.model}" erfolgreich erstellt`);
      } else {
        toast.success(`Fahrzeug "${car.brand} ${car.model}" erfolgreich aktualisiert`);
      }

      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error(`Fehler beim Speichern des Fahrzeugs: ${error.message || 'Unbekannter Fehler'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Fahrzeug erfolgreich gelöscht');
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Fehler beim Löschen des Fahrzeugs');
    }
  };

  const handleStatusToggle = async (car: any) => {
    try {
      const newStatus = car.status === 'available' ? 'sold' : 'available';
      const { error } = await supabase
        .from('cars')
        .update({ status: newStatus })
        .eq('id', car.id);

      if (error) throw error;

      toast.success(`Fahrzeug als ${newStatus === 'available' ? 'verfügbar' : 'verkauft'} markiert`);
      fetchCars();
    } catch (error) {
      console.error('Error updating car status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    }
  };

  // Funktion, um ein neues Auto hinzuzufügen mit verbesserter Initialisierung und Validierung
  const addNewCar = () => {
    // Erstelle ein neues leeres Auto-Objekt mit Standardwerten
    const newCar = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      status: 'available',
      description: '',
      features: [],
      images: [],
      additionalFeatures: [],
      specs: {
        engine: '',
        transmission: '',
        power: '',
        fuelType: '',
        consumption: '',
        acceleration: '',
        topSpeed: '',
        drive: '',
        seats: '',
        doors: '',
        emissionClass: '',
        environmentBadge: '',
        inspection: '',
        color: '',
        interiorColor: '',
        cylinders: '',
        tankVolume: ''
      },
      condition: {
        exterior: '',
        interior: '',
        technique: '',
        tires: '',
        accident: 'Nein',
        warranty: false,
        serviceHistory: false,
        previousOwners: 0,
        type: 'Gebraucht'
      }
    };

    // Setze das Bearbeitungsobjekt und aktiviere den Bearbeitungsmodus
    setEditingCar(newCar);
    setIsAddingCar(true);
    setActiveTab('basic');

    // Zeige einen Toast an, um zu bestätigen, dass ein neues Auto erstellt wird
    toast.info('Neues Fahrzeug wird erstellt. Bitte füllen Sie alle erforderlichen Felder aus.');
  };

  const updateCarField = (field: string, value: any) => {
    setEditingCar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSpecsField = (field: string, value: any) => {
    setEditingCar(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [field]: value
      }
    }));
  };

  const updateConditionField = (field: string, value: any) => {
    setEditingCar(prev => ({
      ...prev,
      condition: {
        ...prev.condition,
        [field]: value
      }
    }));
  };

  // Function to fetch gallery images
  const fetchGalleryImages = async () => {
    try {
      setLoadingGallery(true);

      // Basis-Query erstellen
      let query = supabase
        .from('gallery')
        .select('*, cars(brand, model, id)');

      // Kategorie-Filter anwenden, wenn ausgewählt
      if (filterCategory) {
        query = query.eq('category', filterCategory);
      }

      // Sortierung anwenden
      query = query.order(gallerySort.field, {
        ascending: gallerySort.direction === 'asc'
      });

      // Query ausführen
      const { data, error } = await query;

      if (error) throw error;

      // Daten verarbeiten und Autos verknüpfen
      const processedData = data?.map(img => {
        return {
          ...img,
          car_brand: img.car_id ? img.cars?.brand : img.car_brand,
          car_model: img.car_id ? img.cars?.model : img.car_model
        };
      }) || [];

      setGalleryImages(processedData);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Fehler beim Laden der Galeriebilder');
    } finally {
      setLoadingGallery(false);
    }
  };

  // Function to upload gallery image
  const uploadGalleryImage = async (file: File) => {
    try {
      // Anzeige des Uploads beim ersten Aufruf
      const toastId = toast.loading(`Bild ${file.name} wird hochgeladen...`);

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Galerie-Eintrag mit Auto-Informationen vorbereiten
      const galleryEntry: any = {
        url: publicUrl,
        category: selectedCategory || 'Sonstiges'
      };

      // Wenn ein Auto ausgewählt ist, füge die Auto-Info hinzu
      if (selectedCarForGallery) {
        galleryEntry.car_id = selectedCarForGallery.id;
        galleryEntry.car_brand = selectedCarForGallery.brand;
        galleryEntry.car_model = selectedCarForGallery.model;
      }

      // Add to gallery table
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([galleryEntry]);

      if (dbError) throw dbError;

      // Success
      toast.success(`Bild ${file.name} erfolgreich hochgeladen`, { id: toastId });

      // Aktualisiere die Galerie nach erfolgreichen Upload
      fetchGalleryImages();

    } catch (error) {
      console.error('Error uploading gallery image:', error);
      toast.error(`Fehler beim Hochladen von ${file.name}`);
    }
  };

  // Function to delete gallery image
  const deleteGalleryImage = async (id: string) => {
    if (!confirm('Möchten Sie dieses Bild wirklich löschen?')) return;

    try {
      const toastId = toast.loading('Bild wird gelöscht...');

      // Get the image URL first to extract the file path
      const { data } = await supabase
        .from('gallery')
        .select('url')
        .eq('id', id)
        .single();

      // Delete from gallery table
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Delete from storage if possible (extract path from URL)
      if (data && data.url) {
        // Extract file path from URL
        const urlParts = data.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `gallery/${fileName}`;

        await supabase.storage
          .from('images')
          .remove([filePath]);
      }

      // Success
      toast.success('Bild erfolgreich gelöscht', { id: toastId });
      fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Fehler beim Löschen des Bildes');
    }
  };

  // Function to delete multiple gallery images
  const deleteMultipleGalleryImages = async () => {
    if (selectedImages.length === 0) return;

    if (!confirm(`Möchten Sie ${selectedImages.length} Bilder wirklich löschen?`)) return;

    try {
      const toastId = toast.loading(`Lösche ${selectedImages.length} Bilder...`);

      // Sammle alle URLs für die Speicherlöschung
      const { data: galleryData } = await supabase
        .from('gallery')
        .select('url, id')
        .in('id', selectedImages);

      if (!galleryData) throw new Error('Keine Bilddaten gefunden');

      // Lösche aus der Datenbank
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .in('id', selectedImages);

      if (dbError) throw dbError;

      // Lösche aus dem Storage
      const filePaths = galleryData.map(item => {
        const urlParts = item.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        return `gallery/${fileName}`;
      });

      if (filePaths.length > 0) {
        await supabase.storage
          .from('images')
          .remove(filePaths);
      }

      // Success
      toast.success(`${selectedImages.length} Bilder erfolgreich gelöscht`, { id: toastId });

      // Reset selection
      setSelectedImages([]);
      setIsSelectionMode(false);

      // Aktualisiere die Galerie
      fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting gallery images:', error);
      toast.error('Fehler beim Löschen der Bilder');
    }
  };

  // Toggle image selection
  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(prev => prev.filter(imgId => imgId !== id));
    } else {
      setSelectedImages(prev => [...prev, id]);
    }
  };

  const hasRequiredBasicFields = () => {
    return editingCar.brand && editingCar.model && editingCar.year && editingCar.price && editingCar.mileage && editingCar.status;
  };

  const calculateCompletionPercentage = () => {
    const requiredFields = ['brand', 'model', 'year', 'price', 'mileage', 'status'];
    const filledFields = requiredFields.filter(field => editingCar[field]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-[#14A79D]/20 border-t-[#14A79D] rounded-full" />
          <p className="text-white/40 text-sm font-medium">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20 px-4 md:px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-white/30 text-sm mt-1">Fahrzeuge, Anfragen & Galerie verwalten</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Zurück zur Website</Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" /> Abmelden
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 bg-white/[0.02] backdrop-blur-sm p-1 rounded-xl mb-8 border border-white/[0.04]">
          {[{ key: 'cars', label: 'Fahrzeuge', icon: Car }, { key: 'inquiries', label: 'Anfragen', icon: FileCheck }, { key: 'gallery', label: 'Galerie', icon: ImageIcon }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-300 ${activeTab === tab.key
                ? 'text-white bg-[#14A79D] shadow-lg shadow-[#14A79D]/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.04]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-white">Fahrzeuge verwalten</h2>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => addNewCar()}
                className="bg-[#14A79D] hover:bg-[#14A79D]/90 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-lg shadow-[#14A79D]/20"
              >
                <Plus size={16} />
                Neues Fahrzeug
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cars.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
                >
                  <div className="relative aspect-video">
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {car.year} • {car.mileage.toLocaleString()} km
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${car.status === 'available'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                      {car.status === 'available' ? 'Verfügbar' : 'Verkauft'}
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-[#14A79D] font-semibold text-lg mb-4">
                      €{car.price.toLocaleString()}
                    </p>

                    <div className="flex flex-col gap-4">
                      {/* Status Toggle */}
                      <button
                        onClick={() => handleStatusToggle(car)}
                        className={`w-full px-4 py-2 rounded-lg flex items-center justify-between transition-colors ${car.status === 'available'
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                      >
                        <span>Status: {car.status === 'available' ? 'Verfügbar' : 'Verkauft'}</span>
                        <Toggle className="w-5 h-5" />
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCar(car);
                            setActiveTab('basic');
                          }}
                          className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="bg-red-500/10 text-red-500 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.04]">
            <h2 className="text-xl font-display font-bold text-white mb-6">Anfragen verwalten</h2>

            {/* Inquiries management UI */}
            <div className="text-center py-16">
              <FileCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">Anfragen-Management kommt bald</p>
            </div>
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.04]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Galerie-Management</h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    if (isSelectionMode) {
                      setSelectedImages([]);
                    }
                  }}
                  className={`px-3 py-2 rounded-md flex items-center gap-1 ${isSelectionMode
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#16181f] text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Auswählen</span>
                </button>

                <button
                  onClick={deleteMultipleGalleryImages}
                  disabled={selectedImages.length === 0}
                  className={`px-3 py-2 rounded-md flex items-center gap-1 ${selectedImages.length > 0
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Trash className="w-4 h-4" />
                  <span>{selectedImages.length > 0 ? `Löschen (${selectedImages.length})` : 'Löschen'}</span>
                </button>
              </div>
            </div>

            {/* Dashboard stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1a1c25]/90 rounded-lg p-4 border border-[#14A79D]/20">
                <h3 className="text-gray-400 text-sm mb-2">Bilder insgesamt</h3>
                <p className="text-white text-2xl font-bold">{galleryImages.length}</p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1a1c25]/90 rounded-lg p-4 border border-[#14A79D]/20">
                <h3 className="text-gray-400 text-sm mb-2">Mit Fahrzeugen verknüpft</h3>
                <p className="text-white text-2xl font-bold">
                  {galleryImages.filter(img => img.car_id).length}
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1a1c25]/90 rounded-lg p-4 border border-[#14A79D]/20">
                <h3 className="text-gray-400 text-sm mb-2">Häufigste Kategorie</h3>
                <p className="text-white text-2xl font-bold">
                  {galleryImages.length > 0 ?
                    Object.entries(
                      galleryImages.reduce((acc, img) => {
                        acc[img.category] = (acc[img.category] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1])[0][0]
                    : 'Keine Daten'}
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <div id="upload-section" className="bg-gradient-to-b from-[#16181f]/90 to-[#16181f] p-8 rounded-xl shadow-lg border border-[#14A79D]/10 transition-all hover:border-[#14A79D]/30 mb-8">
              <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-[#14A79D] mr-3" />
                <h3 className="text-xl font-bold text-white">Bilderverwaltung</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">Kategorie auswählen</label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14A79D] transition-all border border-gray-700 hover:border-[#14A79D]/50 appearance-none"
                        >
                          <option value="">Bitte Kategorie auswählen</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {!selectedCategory && (
                        <p className="text-gray-500 text-xs mt-1.5">Diese Information ist erforderlich für die Organisation</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Fahrzeug zuordnen (optional)</label>
                      <div className="relative">
                        <select
                          value={selectedCarForGallery?.id || ""}
                          onChange={(e) => {
                            const car = cars.find(c => c.id === e.target.value);
                            setSelectedCarForGallery(car || null);
                          }}
                          className="w-full bg-[#1a1c25] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14A79D] transition-all border border-gray-700 hover:border-[#14A79D]/50 appearance-none"
                        >
                          <option value="">Kein Fahrzeug zuordnen</option>
                          {cars.map((car) => (
                            <option key={car.id} value={car.id}>
                              {car.brand} {car.model} ({car.year})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-1.5">
                        {selectedCarForGallery
                          ? `Bilder werden mit ${selectedCarForGallery.brand} ${selectedCarForGallery.model} verknüpft`
                          : "Bilder werden keinem spezifischen Fahrzeug zugeordnet"}
                      </p>
                    </div>
                  </div>

                  {/* Übersicht und Tipps */}
                  <div className="bg-gradient-to-r from-[#14A79D]/10 to-[#14A79D]/5 rounded-lg p-5 border border-[#14A79D]/20">
                    <h4 className="font-medium text-[#14A79D] mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Tipps für optimale Bilder
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2.5">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-[#14A79D] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Verwende Bilder mit hoher Auflösung für beste Qualität</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-[#14A79D] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Wähle eine passende Kategorie für einfachere Navigation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-[#14A79D] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Aktiviere das Wasserzeichen zum Schutz der Markenrechte</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-[#14A79D] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Ordne Bilder, wenn möglich, einem Fahrzeug zu für bessere Organisation</span>
                      </li>
                    </ul>

                    <div className="mt-4 pt-4 border-t border-[#14A79D]/20">
                      <div className="flex items-center text-sm text-[#14A79D]">
                        <FileCheck className="w-4 h-4 mr-2" />
                        <span>Unterstützte Formate: JPG, PNG, WebP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <ImageUpload
                    onUpload={uploadGalleryImage}
                    bucketName="images"
                    enableWatermarkOption={true}
                    watermarkPosition="topLeft"
                    maxFiles={10}
                    className="bg-[#1a1c25]/60 backdrop-blur-sm rounded-lg shadow-md p-1"
                  />

                  {!selectedCategory && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                      <div className="text-center p-6 bg-[#16181f]/90 rounded-lg max-w-xs border border-[#14A79D]/30">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium text-lg mb-2">Kategorie erforderlich</h4>
                        <p className="text-gray-400 text-sm mb-4">
                          Bitte wählen Sie eine Kategorie aus, bevor Sie Bilder hochladen.
                        </p>
                        <button
                          onClick={() => document.querySelector('select')?.focus()}
                          className="bg-[#14A79D] hover:bg-[#14A79D]/90 text-white px-4 py-2 rounded-md transition-colors text-sm"
                        >
                          Kategorie auswählen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Management Header */}
            <div className="flex flex-wrap items-center justify-between bg-[#16181f] p-5 rounded-t-xl border-b border-gray-700 mb-1 sticky top-20 z-10">
              <div className="flex items-center">
                <ImageIcon className="w-5 h-5 text-[#14A79D] mr-2" />
                <h3 className="text-xl font-bold text-white">
                  Galerie
                  {galleryImages.length > 0 &&
                    <span className="text-[#14A79D] text-base ml-2 font-normal">
                      ({galleryImages.length} {galleryImages.length === 1 ? 'Bild' : 'Bilder'})
                    </span>
                  }
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                {/* Filter by category */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-[#1a1c25] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14A79D] border border-gray-700"
                >
                  <option value="">Alle Kategorien</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Sort options */}
                <select
                  value={`${gallerySort.field}_${gallerySort.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('_');
                    setGallerySort({
                      field,
                      direction: direction as 'asc' | 'desc'
                    });
                    fetchGalleryImages();
                  }}
                  className="bg-[#1a1c25] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14A79D] border border-gray-700"
                >
                  <option value="created_at_desc">Neueste zuerst</option>
                  <option value="created_at_asc">Älteste zuerst</option>
                  <option value="category_asc">Kategorie (A-Z)</option>
                  <option value="category_desc">Kategorie (Z-A)</option>
                </select>

                {/* View toggle */}
                <div className="flex rounded-md overflow-hidden border border-gray-700">
                  <button
                    onClick={() => setGalleryView('grid')}
                    className={`px-3 py-2 transition-colors ${galleryView === 'grid'
                      ? 'bg-[#14A79D] text-white'
                      : 'bg-[#1a1c25] text-gray-300 hover:bg-[#14A79D]/20'
                      }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGalleryView('list')}
                    className={`px-3 py-2 transition-colors ${galleryView === 'list'
                      ? 'bg-[#14A79D] text-white'
                      : 'bg-[#1a1c25] text-gray-300 hover:bg-[#14A79D]/20'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Select mode toggle and delete button */}
                <div className="flex border border-gray-700 rounded-md overflow-hidden">
                  <button
                    onClick={() => {
                      setIsSelectionMode(!isSelectionMode);
                      if (isSelectionMode) {
                        setSelectedImages([]);
                      }
                    }}
                    className={`px-3 py-2 transition-colors ${isSelectionMode
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#1a1c25] text-gray-300 hover:bg-[#1a1c25]/80'
                      }`}
                    title="Mehrfachauswahl aktivieren"
                  >
                    <CheckSquare className="w-5 h-5" />
                  </button>

                  <button
                    onClick={deleteMultipleGalleryImages}
                    disabled={selectedImages.length === 0}
                    className={`px-3 py-2 flex items-center transition-colors ${selectedImages.length > 0
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-[#1a1c25] text-gray-500 cursor-not-allowed'
                      }`}
                    title="Ausgewählte Bilder löschen"
                  >
                    <Trash className="w-5 h-5 mr-1" />
                    {selectedImages.length > 0 && selectedImages.length}
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Images List */}
            <div>
              {loadingGallery ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14A79D] mb-3"></div>
                  <p className="text-gray-400">Bilder werden geladen...</p>
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="bg-[#1a1c25]/80 rounded-lg p-8 text-center border border-gray-700">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Keine Bilder vorhanden</h3>
                  <p className="text-gray-400 mb-6">Laden Sie Bilder hoch, um sie hier anzuzeigen.</p>
                  <button
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-4 py-2 bg-[#14A79D] text-white rounded-md hover:bg-[#14A79D]/90 transition-colors"
                  >
                    Zum Upload-Bereich
                  </button>
                </div>
              ) : galleryView === 'grid' ? (
                <div className="bg-[#1a1c25]/80 rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-4">
                    {galleryImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transform hover:scale-[1.03] transition-all duration-200 ${isSelectionMode && selectedImages.includes(image.id)
                          ? 'ring-2 ring-[#14A79D] ring-offset-1 ring-offset-gray-900'
                          : ''
                          }`}
                        onClick={() => isSelectionMode && toggleImageSelection(image.id)}
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Image ${image.id}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />

                          {/* Overlay und Informationen beim Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <div className="flex justify-between items-center text-white mb-2">
                                <span className="font-medium truncate">{image.category ? image.category : "Keine Kategorie"}</span>
                                <div className="flex space-x-2">
                                  {!isSelectionMode && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteGalleryImage(image.id);
                                        }}
                                        className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-600 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingCar(image);
                                          setActiveTab('basic');
                                        }}
                                        className="p-1.5 bg-gray-600/90 rounded-full hover:bg-gray-700 transition-colors"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bilddetails immer sichtbar (unten) */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                            <div className="flex justify-between items-center text-xs text-gray-300">
                              <span>{new Date(image.created_at).toLocaleDateString()}</span>
                              <span className={image.car_id ? 'text-green-400' : 'text-gray-500'}>
                                {image.car_id ? (
                                  <span className="flex items-center">
                                    <Car className="w-3 h-3 mr-1" />
                                    Fahrzeug
                                  </span>
                                ) : 'Kein Fahrzeug'}
                              </span>
                            </div>
                          </div>

                          {/* Auswahlindikator */}
                          {isSelectionMode && (
                            <div className="absolute top-2 left-2">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedImages.includes(image.id)
                                ? 'bg-[#14A79D] border-[#14A79D]'
                                : 'bg-black/50 border-gray-300/50'
                                }`}>
                                {selectedImages.includes(image.id) && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1a1c25]/80 rounded-lg border border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800/80">
                        {isSelectionMode && (
                          <th className="px-3 py-3 text-left">
                            <div
                              onClick={() => {
                                setSelectedImages(galleryImages.map(img => img.id));
                              }}
                              className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-colors ${selectedImages.length === galleryImages.length && galleryImages.length > 0
                                ? 'bg-[#14A79D] border-[#14A79D]'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                }`}
                            >
                              {selectedImages.length === galleryImages.length && galleryImages.length > 0 && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bild</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kategorie</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fahrzeug</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Datum</th>
                        {!isSelectionMode && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Aktionen</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {galleryImages.map((image, index) => (
                        <tr
                          key={image.id}
                          className={`hover:bg-gray-800/40 transition-colors ${isSelectionMode && selectedImages.includes(image.id) ? 'bg-[#14A79D]/10' : ''
                            }`}
                          onClick={() => isSelectionMode && toggleImageSelection(image.id)}
                        >
                          {isSelectionMode && (
                            <td className="pl-3 pr-2 py-3">
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedImages.includes(image.id)
                                  ? 'bg-[#14A79D] border-[#14A79D]'
                                  : 'bg-gray-700 border-gray-600'
                                  }`}
                              >
                                {selectedImages.includes(image.id) && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-700">
                                <img src={image.url} alt="" className="h-12 w-16 object-cover" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-300 truncate max-w-[150px]">
                                  {image.filename || "Kein Name"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex text-xs leading-5 font-semibold rounded-full px-2.5 py-1 bg-gray-700 text-gray-300">
                              {image.category ? image.category : "Keine Kategorie"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {image.car_id ? (
                              <span className="inline-flex items-center text-green-400">
                                <Car className="w-3 h-3 mr-1.5" />
                                Zugewiesen
                              </span>
                            ) : (
                              <span className="text-gray-500">Nicht zugewiesen</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {new Date(image.created_at).toLocaleDateString()}
                          </td>
                          {!isSelectionMode && (
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCar(image);
                                  setActiveTab('basic');
                                }}
                                className="px-3 py-1.5 inline-flex items-center text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5 mr-1.5" />
                                Bearbeiten
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteGalleryImage(image.id);
                                }}
                                className="px-3 py-1.5 inline-flex items-center text-red-300 hover:text-white bg-red-900/30 hover:bg-red-700/80 rounded transition-colors ml-1"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                Löschen
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {(editingCar || isAddingCar) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#16181f] rounded-lg w-full max-w-7xl my-8"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">
                    {editingCar && editingCar.id ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
                  </h3>
                  <button
                    onClick={() => {
                      if (isAddingCar && !window.confirm('Sind Sie sicher? Ungespeicherte Änderungen gehen verloren.')) {
                        return;
                      }
                      setEditingCar(null);
                      setIsAddingCar(false);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Fortschrittsanzeige für Datenerfassung */}
                {isAddingCar && (
                  <div className="mt-4 mb-2">
                    <div className="text-sm text-gray-400 mb-1 flex justify-between">
                      <span>Datenerfassung</span>
                      <span className="text-right">
                        {calculateCompletionPercentage()}% abgeschlossen
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-[#14A79D] to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${calculateCompletionPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Edit/Preview Mode Toggle */}
                <div className="flex gap-4 mt-6 flex-wrap">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'basic'
                      ? 'bg-[#14A79D] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <File className="w-4 h-4" />
                    Basis
                    {!hasRequiredBasicFields() && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'specs'
                      ? 'bg-[#14A79D] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <Settings className="w-4 h-4" />
                    Spezifikationen
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'features'
                      ? 'bg-[#14A79D] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <List className="w-4 h-4" />
                    Ausstattung
                  </button>
                  <button
                    onClick={() => setActiveTab('condition')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'condition'
                      ? 'bg-[#14A79D] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <Activity className="w-4 h-4" />
                    Zustand
                  </button>
                  <button
                    onClick={() => {
                      // Prüfen ob alle Pflichtfelder ausgefüllt sind, sonst Warnung anzeigen
                      if (!hasRequiredBasicFields()) {
                        toast.error('Bitte füllen Sie erst alle Pflichtfelder aus');
                        setActiveTab('basic');
                        return;
                      }
                      setActiveTab('preview');
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ml-auto ${activeTab === 'preview'
                      ? 'bg-orange-400 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <Eye className="w-4 h-4" />
                    Vorschau
                  </button>
                </div>
              </div>

              {activeTab !== 'preview' ? (
                <div className="p-6 space-y-6">
                  {/* Existing Tabs Content */}
                  {activeTab === 'basic' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 mb-2 flex items-center">
                            Marke <span className="text-red-500 ml-1">*</span>
                            {editingCar.brand ? (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            ) : (
                              <span className="text-xs text-red-400 ml-2">Pflichtfeld</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={editingCar.brand || ''}
                            onChange={(e) => updateCarField('brand', e.target.value)}
                            className={`w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.brand ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
                              }`}
                            placeholder="z.B. BMW, Mercedes, Audi"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 flex items-center">
                            Modell <span className="text-red-500 ml-1">*</span>
                            {editingCar.model ? (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            ) : (
                              <span className="text-xs text-red-400 ml-2">Pflichtfeld</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={editingCar.model || ''}
                            onChange={(e) => updateCarField('model', e.target.value)}
                            className={`w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.model ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
                              }`}
                            placeholder="z.B. 3er, A-Klasse, A4"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 flex items-center">
                            Jahr <span className="text-red-500 ml-1">*</span>
                            {editingCar.year ? (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            ) : (
                              <span className="text-xs text-red-400 ml-2">Pflichtfeld</span>
                            )}
                          </label>
                          <input
                            type="number"
                            value={editingCar.year || ''}
                            onChange={(e) => updateCarField('year', parseInt(e.target.value))}
                            className={`w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.year ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
                              }`}
                            placeholder="z.B. 2020"
                            min="1900"
                            max={new Date().getFullYear()}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 flex items-center">
                            Preis <span className="text-red-500 ml-1">*</span>
                            {editingCar.price > 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            ) : (
                              <span className="text-xs text-red-400 ml-2">Pflichtfeld</span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={editingCar.price || ''}
                              onChange={(e) => updateCarField('price', parseInt(e.target.value))}
                              className={`w-full bg-[#1a1c25] text-white px-4 py-2 pl-8 rounded-lg focus:outline-none focus:ring-2 ${editingCar.price > 0 ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
                                }`}
                              placeholder="z.B. 25000"
                              min="0"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 flex items-center">
                            Kilometerstand <span className="text-red-500 ml-1">*</span>
                            {editingCar.mileage >= 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            ) : (
                              <span className="text-xs text-red-400 ml-2">Pflichtfeld</span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={editingCar.mileage || ''}
                              onChange={(e) => updateCarField('mileage', parseInt(e.target.value))}
                              className={`w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.mileage >= 0 ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
                                }`}
                              placeholder="z.B. 50000"
                              min="0"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">km</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Status</label>
                          <select
                            value={editingCar.status || 'available'}
                            onChange={(e) => updateCarField('status', e.target.value)}
                            className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-700"
                          >
                            <option value="available">Verfügbar</option>
                            <option value="sold">Verkauft</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">Beschreibung</label>
                        <textarea
                          value={editingCar.description || ''}
                          onChange={(e) => updateCarField('description', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32 resize-none border border-gray-700"
                          placeholder="Ausführliche Beschreibung des Fahrzeugs..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2 flex items-center">
                          Bilder
                          {editingCar.images && editingCar.images.length > 0 ? (
                            <span className="text-xs text-green-400 ml-2">{editingCar.images.length} Bilder hochgeladen</span>
                          ) : (
                            <span className="text-xs text-orange-400 ml-2">Mindestens ein Bild empfohlen</span>
                          )}
                        </label>

                        {/* Vorschau der bereits hochgeladenen Bilder */}
                        {editingCar.images && editingCar.images.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                            {editingCar.images.map((imageUrl, index) => (
                              <div key={index} className="relative group aspect-square overflow-hidden rounded-lg">
                                <img
                                  src={imageUrl}
                                  alt={`Bild ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    onClick={() => updateCarField('images', editingCar.images.filter((_, i) => i !== index))}
                                    className="bg-red-500 text-white p-1 rounded-full"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <ImageUpload
                          onImagesUploaded={(urls) =>
                            updateCarField('images', [...(editingCar.images || []), ...urls])
                          }
                          bucketName="car-images"
                          enableWatermarkOption={true}
                          watermarkPosition="topLeft"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Motor</label>
                        <input
                          type="text"
                          value={editingCar.specs?.engine || ''}
                          onChange={(e) => updateSpecsField('engine', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Leistung</label>
                        <input
                          type="text"
                          value={editingCar.specs?.power || ''}
                          onChange={(e) => updateSpecsField('power', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Getriebe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.transmission || ''}
                          onChange={(e) => updateSpecsField('transmission', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Kraftstoff</label>
                        <input
                          type="text"
                          value={editingCar.specs?.fuelType || ''}
                          onChange={(e) => updateSpecsField('fuelType', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Beschleunigung</label>
                        <input
                          type="text"
                          value={editingCar.specs?.acceleration || ''}
                          onChange={(e) => updateSpecsField('acceleration', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Höchstgeschwindigkeit</label>
                        <input
                          type="text"
                          value={editingCar.specs?.topSpeed || ''}
                          onChange={(e) => updateSpecsField('topSpeed', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Verbrauch</label>
                        <input
                          type="text"
                          value={editingCar.specs?.consumption || ''}
                          onChange={(e) => updateSpecsField('consumption', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">CO2-Emissionen</label>
                        <input
                          type="text"
                          value={editingCar.specs?.emissions || ''}
                          onChange={(e) => updateSpecsField('emissions', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Hubraum</label>
                        <input
                          type="text"
                          value={editingCar.specs?.hubraum || ''}
                          onChange={(e) => updateSpecsField('hubraum', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Sitze</label>
                        <input
                          type="text"
                          value={editingCar.specs?.seats || ''}
                          onChange={(e) => updateSpecsField('seats', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Türen</label>
                        <input
                          type="text"
                          value={editingCar.specs?.doors || ''}
                          onChange={(e) => updateSpecsField('doors', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Emissionsklasse</label>
                        <input
                          type="text"
                          value={editingCar.specs?.emissionClass || ''}
                          onChange={(e) => updateSpecsField('emissionClass', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Umweltplakette</label>
                        <input
                          type="text"
                          value={editingCar.specs?.environmentBadge || ''}
                          onChange={(e) => updateSpecsField('environmentBadge', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">HU</label>
                        <input
                          type="text"
                          value={editingCar.specs?.inspection || ''}
                          onChange={(e) => updateSpecsField('inspection', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Klimaanlage</label>
                        <input
                          type="text"
                          value={editingCar.specs?.airConditioning || ''}
                          onChange={(e) => updateSpecsField('airConditioning', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Einparkhilfe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.parkingAssist || ''}
                          onChange={(e) => updateSpecsField('parkingAssist', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Airbags</label>
                        <input
                          type="text"
                          value={editingCar.specs?.airbags || ''}
                          onChange={(e) => updateSpecsField('airbags', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Farbe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.color || ''}
                          onChange={(e) => updateSpecsField('color', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Innenfarbe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.interiorColor || ''}
                          onChange={(e) => updateSpecsField('interiorColor', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Anhängelast</label>
                        <input
                          type="text"
                          value={editingCar.specs?.trailerLoad || ''}
                          onChange={(e) => updateSpecsField('trailerLoad', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Zylinder</label>
                        <input
                          type="text"
                          value={editingCar.specs?.cylinders || ''}
                          onChange={(e) => updateSpecsField('cylinders', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Tankvolumen</label>
                        <input
                          type="text"
                          value={editingCar.specs?.tankVolume || ''}
                          onChange={(e) => updateSpecsField('tankVolume', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Ausstattung</label>
                        <div className="bg-gradient-to-r from-[#14A79D]/10 to-[#14A79D]/5 rounded-lg p-5 border border-[#14A79D]/20 mb-4">
                          <p className="text-gray-300 mb-3">
                            Geben Sie Ausstattungsmerkmale ein - jedes in einer neuen Zeile.
                            Für eine bessere Strukturierung können Sie Kategorien erstellen, indem Sie
                            <span className="font-bold text-[#14A79D]"> #Kategoriename:</span> verwenden.
                          </p>
                          <div className="text-sm bg-[#1a1c25] p-3 rounded-md text-gray-400 mb-3">
                            <p className="mb-1">#Sicherheit &amp; Assistenz:</p>
                            <p className="mb-1">Airbag Fahrer-/Beifahrerseite</p>
                            <p className="mb-1">Aktive Motorhaube</p>
                            <p className="mb-1">#Antrieb &amp; Fahrwerk:</p>
                            <p className="mb-1">Allradantrieb</p>
                            <p className="mb-1">Automatisches Bremsen Differential</p>
                          </div>
                        </div>
                        <textarea
                          value={editingCar.features?.join('\n') || ''}
                          onChange={(e) => updateCarField('features', e.target.value.split('\n').filter(Boolean))}
                          placeholder="Geben Sie Ausstattungsmerkmale ein - eines pro Zeile. Für Kategorien verwenden Sie #Kategoriename:"
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-64 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">Zusatzausstattung</label>
                        <textarea
                          value={editingCar.additionalFeatures?.join('\n') || ''}
                          onChange={(e) => updateCarField('additionalFeatures', e.target.value.split('\n').filter(Boolean))}
                          placeholder="Eine Zusatzausstattung pro Zeile"
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-48 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'condition' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Zustand</label>
                        <select
                          value={editingCar.condition?.type || 'Gebraucht'}
                          onChange={(e) => updateConditionField('type', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          <option value="Neu">Neu</option>
                          <option value="Gebraucht">Gebraucht</option>
                          <option value="Jahreswagen">Jahreswagen</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">Vorbesitzer</label>
                        <input
                          type="number"
                          value={editingCar.condition?.previousOwners || 0}
                          onChange={(e) => updateConditionField('previousOwners', parseInt(e.target.value))}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-gray-300">
                          <input
                            type="checkbox"
                            checked={editingCar.condition?.accident || false}
                            onChange={(e) => updateConditionField('accident', e.target.checked)}
                            className="w-4 h-4 rounded bg-[#1a1c25] border-gray-600 text-[#14A79D] focus:ring-[#14A79D]"
                          />
                          Unfallfahrzeug
                        </label>
                        <label className="flex items-center gap-2 text-gray-300">
                          <input
                            type="checkbox"
                            checked={editingCar.condition?.warranty || false}
                            onChange={(e) => updateConditionField('warranty', e.target.checked)}
                            className="w-4 h-4 rounded bg-[#1a1c25] border-gray-600 text-[#14A79D] focus:ring-[#14A79D]"
                          />
                          Garantie
                        </label>
                        <label className="flex items-center gap-2 text-gray-300">
                          <input
                            type="checkbox"
                            checked={editingCar.condition?.serviceHistory || false}
                            onChange={(e) => updateConditionField('serviceHistory', e.target.checked)}
                            className="w-4 h-4 rounded bg-[#1a1c25] border-gray-600 text-[#14A79D] focus:ring-[#14A79D]"
                          />
                          Scheckheftgepflegt
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // CarDetails Preview Mode
                <div className="p-6">
                  <div className="min-h-[800px] px-4">
                    <div className="max-w-7xl mx-auto">
                      {editingCar.condition?.accident && (
                        <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center">
                          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                          <div>
                            <h3 className="text-red-500 font-semibold mb-1">Unfallfahrzeug</h3>
                            <p className="text-gray-300">Dieses Fahrzeug hat einen dokumentierten Unfallschaden. Weitere Details finden Sie in der Fahrzeugbeschreibung.</p>
                          </div>
                        </div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: this }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                      >
                        {/* Left Column - Images */}
                        <div className="space-y-4">
                          <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden relative group h-[400px] flex items-center justify-center">
                            {editingCar.images && editingCar.images.length > 0 ? (
                              <img
                                src={editingCar.images[0]}
                                alt={`${editingCar.brand || 'Neues'} ${editingCar.model || 'Fahrzeug'}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon size={64} className="mb-4 opacity-50" />
                                <p>Keine Bilder vorhanden</p>
                                <p className="text-sm mt-2">Fügen Sie Bilder im Tab "Basis" hinzu</p>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-4">
                            {editingCar.images && editingCar.images.map((image: string, index: number) => (
                              <div
                                key={index}
                                className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden h-24"
                              >
                                <img
                                  src={image}
                                  alt={`${editingCar.brand || 'Neues'} ${editingCar.model || 'Fahrzeug'} thumbnail`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Column - Car Details */}
                        <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8">
                          <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-4">
                              {editingCar.brand || 'Marke'} {editingCar.model || 'Modell'}
                            </h1>
                            <div className="flex items-center justify-between mb-6">
                              <p className="text-3xl text-orange-400 font-bold">
                                €{(editingCar.price || 0).toLocaleString()}
                              </p>
                              <span className="text-gray-400">inkl. MwSt.</span>
                            </div>

                            {/* Condition Badges */}
                            <div className="mb-6 flex flex-wrap gap-2">
                              {editingCar.condition?.accident ? (
                                <div className="inline-flex items-center bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                                  <X className="w-4 h-4 mr-1" />
                                  Unfallfahrzeug
                                </div>
                              ) : (
                                <div className="inline-flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                                  <Check className="w-4 h-4 mr-1" />
                                  Unfallfrei
                                </div>
                              )}

                              {editingCar.condition?.warranty ? (
                                <div className="inline-flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                                  <Shield className="w-4 h-4 mr-1" />
                                  Garantie
                                </div>
                              ) : (
                                <div className="inline-flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  Keine Garantie
                                </div>
                              )}

                              {editingCar.condition?.serviceHistory && (
                                <div className="inline-flex items-center bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                                  <BookCheck className="w-4 h-4 mr-1" />
                                  Scheckheftgepflegt
                                </div>
                              )}

                              {editingCar.condition?.previousOwners === 0 && (
                                <div className="inline-flex items-center bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                                  <Award className="w-4 h-4 mr-1" />
                                  Erstbesitz
                                </div>
                              )}

                              {editingCar.condition?.previousOwners > 0 && (
                                <div className="inline-flex items-center bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm">
                                  <Info className="w-4 h-4 mr-1" />
                                  {editingCar.condition.previousOwners} Vorbesitzer
                                </div>
                              )}

                              {editingCar.condition?.type === 'Neu' && (
                                <div className="inline-flex items-center bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                                  <Sparkles className="w-4 h-4 mr-1" />
                                  Neufahrzeug
                                </div>
                              )}

                              {!editingCar.condition?.accident && editingCar.condition?.warranty && editingCar.condition?.serviceHistory && (
                                <div className="inline-flex items-center bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-sm">
                                  <Heart className="w-4 h-4 mr-1" />
                                  Top Zustand
                                </div>
                              )}
                            </div>

                            {/* Key Details */}
                            <div className="grid grid-cols-2 gap-4 text-gray-300">
                              <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-orange-400" />
                                <div>
                                  <p className="text-gray-400 text-sm">Erstzulassung</p>
                                  <p className="font-semibold">{editingCar.year || 'Jahr'}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Gauge className="w-5 h-5 mr-2 text-orange-400" />
                                <div>
                                  <p className="text-gray-400 text-sm">Kilometerstand</p>
                                  <p className="font-semibold">{(editingCar.mileage || 0).toLocaleString()} km</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Car className="w-5 h-5 mr-2 text-orange-400" />
                                <div>
                                  <p className="text-gray-400 text-sm">Kraftstoff</p>
                                  <p className="font-semibold">{editingCar.specs?.fuelType || 'Nicht angegeben'}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-orange-400" />
                                <div>
                                  <p className="text-gray-400 text-sm">Getriebe</p>
                                  <p className="font-semibold">{editingCar.specs?.transmission || 'Nicht angegeben'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Additional Specs */}
                            <div className="mt-6 grid grid-cols-2 gap-4 text-gray-300">
                              <div>
                                <p className="text-gray-400 text-sm">Leistung</p>
                                <p className="font-semibold">{editingCar.specs?.power || 'Nicht angegeben'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Hubraum</p>
                                <p className="font-semibold">{editingCar.specs?.hubraum || 'Nicht angegeben'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Verbrauch</p>
                                <p className="font-semibold">{editingCar.specs?.consumption || 'Nicht angegeben'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">CO₂-Emissionen</p>
                                <p className="font-semibold">{editingCar.specs?.emissions || 'Nicht angegeben'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Features Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8"
                        >
                          <h2 className="text-2xl font-bold text-white mb-6">Ausstattung</h2>
                          <div className="grid grid-cols-2 gap-4">
                            {editingCar.features && editingCar.features.length > 0 ? (
                              editingCar.features.map((feature: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center text-gray-300"
                                >
                                  <Check className="w-5 h-5 text-orange-400 mr-2" />
                                  <span>{feature}</span>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-gray-400 col-span-2 py-4">
                                Keine Ausstattung eingetragen
                              </div>
                            )}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8"
                        >
                          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Star className="w-6 h-6 text-orange-400 mr-2" />
                            Sonderausstattung
                          </h2>
                          <div className="grid grid-cols-1 gap-4">
                            {editingCar.additionalFeatures && editingCar.additionalFeatures.length > 0 ? (
                              editingCar.additionalFeatures.map((feature: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="bg-gradient-to-br from-[#1a1c25] to-[#1e2029] p-4 rounded-lg"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-gray-300">{feature}</span>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-gray-400 py-4">
                                Keine Sonderausstattung eingetragen
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Description Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8 mb-12"
                      >
                        <h2 className="text-2xl font-bold text-white mb-6">Fahrzeugbeschreibung</h2>
                        <div className="space-y-8">
                          <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-lg">
                            <p className="text-xl text-gray-200 leading-relaxed">
                              {editingCar.description || 'Keine Beschreibung vorhanden'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-gray-800 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setEditingCar(null);
                    setIsAddingCar(false);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    // Füge Validierung hinzu, bevor ein Auto gespeichert wird
                    if (!editingCar.brand || !editingCar.model) {
                      toast.error('Bitte geben Sie mindestens Marke und Modell ein');
                      return;
                    }
                    handleSave(editingCar);
                    setIsAddingCar(false);
                  }}
                  className="bg-[#14A79D] text-white px-6 py-2 rounded-lg hover:bg-[#118F86] transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Speichern
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default Admin;
