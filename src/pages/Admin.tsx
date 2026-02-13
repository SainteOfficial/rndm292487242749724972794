import { useState, useEffect } from 'react';
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
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

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

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab, inquiryFilter]);

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

  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (inquiryFilter !== 'all') {
        query = query.eq('status', inquiryFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      setInquiries(data || []);
    } catch (error: any) {
      if (error?.code === '42P01') {
        setInquiries([]);
      } else {
        console.error('Error fetching inquiries:', error);
      }
    } finally {
      setLoadingInquiries(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success(`Anfrage als "${status === 'read' ? 'Gelesen' : status === 'replied' ? 'Beantwortet' : status}" markiert`);
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev: any) => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Fehler beim Aktualisieren der Anfrage');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('Möchten Sie diese Anfrage wirklich löschen?')) return;
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      toast.success('Anfrage gelöscht');
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Fehler beim Löschen');
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
        toast('Das Fahrzeug hat keine Bilder. Fahrzeuge mit Bildern werden besser wahrgenommen.');
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

      const { error } = await supabase
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
      toast.error(`Fehler beim Speichern des Fahrzeugs: ${(error as Error).message || 'Unbekannter Fehler'}`);
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
    toast('Neues Fahrzeug wird erstellt. Bitte füllen Sie alle erforderlichen Felder aus.');
  };

  const updateCarField = (field: string, value: any) => {
    setEditingCar((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSpecsField = (field: string, value: any) => {
    setEditingCar((prev: any) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [field]: value
      }
    }));
  };

  const updateConditionField = (field: string, value: any) => {
    setEditingCar((prev: any) => ({
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold text-white">Anfragen verwalten</h2>
              <div className="flex gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
                {[{ key: 'all', label: 'Alle' }, { key: 'new', label: 'Neu' }, { key: 'read', label: 'Gelesen' }, { key: 'replied', label: 'Beantwortet' }].map(f => (
                  <button key={f.key} onClick={() => setInquiryFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${inquiryFilter === f.key ? 'bg-[#14A79D] text-white shadow-lg shadow-[#14A79D]/20' : 'text-white/40 hover:text-white/60'}`}>
                    {f.label}
                    {f.key === 'new' && inquiries.filter((i: any) => i.status === 'new').length > 0 && (
                      <span className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{inquiries.filter((i: any) => i.status === 'new').length}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <p className="text-white/30 text-xs mb-1">Gesamt</p>
                <p className="text-2xl font-bold text-white">{inquiries.length}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <p className="text-white/30 text-xs mb-1">Ungelesen</p>
                <p className="text-2xl font-bold text-amber-400">{inquiries.filter((i: any) => i.status === 'new').length}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <p className="text-white/30 text-xs mb-1">Beantwortet</p>
                <p className="text-2xl font-bold text-green-400">{inquiries.filter((i: any) => i.status === 'replied').length}</p>
              </div>
            </div>

            {loadingInquiries ? (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-[#14A79D]/20 border-t-[#14A79D] rounded-full mb-3" />
                <p className="text-white/30 text-sm">Anfragen werden geladen...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16">
                <FileCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 text-sm mb-2">Keine Anfragen vorhanden</p>
                <p className="text-white/20 text-xs">Anfragen werden hier angezeigt, sobald Kunden das Kontaktformular nutzen.</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Inquiry List */}
                <div className={`space-y-2 ${selectedInquiry ? 'lg:w-1/2' : 'w-full'}`}>
                  {inquiries.map((inq: any) => (
                    <motion.div key={inq.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      onClick={() => { setSelectedInquiry(inq); if (inq.status === 'new') updateInquiryStatus(inq.id, 'read'); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedInquiry?.id === inq.id
                        ? 'bg-[#14A79D]/10 border-[#14A79D]/30'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {inq.status === 'new' && <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
                          <h4 className="text-white font-medium text-sm truncate">{inq.name || 'Unbekannt'}</h4>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${inq.status === 'new' ? 'bg-amber-500/20 text-amber-400' : inq.status === 'read' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                          {inq.status === 'new' ? 'Neu' : inq.status === 'read' ? 'Gelesen' : 'Beantwortet'}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mb-1 truncate">{inq.email || inq.phone || ''}</p>
                      <p className="text-white/30 text-xs truncate">{inq.message?.substring(0, 80) || ''}...</p>
                      <p className="text-white/20 text-[10px] mt-2">{inq.created_at ? new Date(inq.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Inquiry Detail */}
                {selectedInquiry && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:w-1/2 bg-white/[0.03] rounded-xl p-6 border border-white/[0.06] sticky top-24 self-start">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{selectedInquiry.name}</h3>
                        <p className="text-white/40 text-sm">{selectedInquiry.email}</p>
                        {selectedInquiry.phone && <p className="text-white/30 text-xs mt-1">{selectedInquiry.phone}</p>}
                      </div>
                      <button onClick={() => setSelectedInquiry(null)} className="text-white/30 hover:text-white/60 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {selectedInquiry.subject && (
                      <div className="mb-4">
                        <p className="text-white/30 text-xs mb-1">Betreff</p>
                        <p className="text-white text-sm">{selectedInquiry.subject}</p>
                      </div>
                    )}
                    {selectedInquiry.car_interest && (
                      <div className="mb-4">
                        <p className="text-white/30 text-xs mb-1">Fahrzeug-Interesse</p>
                        <p className="text-[#14A79D] text-sm font-medium">{selectedInquiry.car_interest}</p>
                      </div>
                    )}
                    <div className="mb-6">
                      <p className="text-white/30 text-xs mb-2">Nachricht</p>
                      <div className="bg-white/[0.03] rounded-lg p-4 border border-white/[0.06]">
                        <p className="text-white/70 text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedInquiry.status !== 'replied' && (
                        <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'replied')}
                          className="flex-1 bg-[#14A79D] hover:bg-[#14A79D]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Als beantwortet markieren
                        </button>
                      )}
                      <button onClick={() => deleteInquiry(selectedInquiry.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gesamt', value: galleryImages.length, color: 'text-white' },
                { label: 'Verknüpft', value: galleryImages.filter(img => img.car_id).length, color: 'text-[#14A79D]' },
                { label: 'Kategorien', value: galleryImages.length > 0 ? new Set(galleryImages.map((img: any) => img.category)).size : 0, color: 'text-amber-400' }
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Upload Section - Compact */}
            <div id="upload-section" className="bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#14A79D]" />
                  <h3 className="text-sm font-semibold text-white">Bilder hochladen</h3>
                </div>
                <p className="text-white/20 text-xs">JPG, PNG, WebP • max 10MB</p>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/40 text-xs mb-1.5">Kategorie *</label>
                    <div className="relative">
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-white/[0.04] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#14A79D]/50 border border-white/[0.08] hover:border-white/[0.15] appearance-none transition-colors">
                        <option value="">Auswählen...</option>
                        {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1.5">Fahrzeug (optional)</label>
                    <div className="relative">
                      <select value={selectedCarForGallery?.id || ""} onChange={(e) => { const car = cars.find(c => c.id === e.target.value); setSelectedCarForGallery(car || null); }}
                        className="w-full bg-white/[0.04] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#14A79D]/50 border border-white/[0.08] hover:border-white/[0.15] appearance-none transition-colors">
                        <option value="">Kein Fahrzeug</option>
                        {cars.map((car) => (<option key={car.id} value={car.id}>{car.brand} {car.model} ({car.year})</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 relative">
                  <ImageUpload onUpload={uploadGalleryImage} bucketName="images" enableWatermarkOption={true} watermarkPosition="topLeft" maxFiles={10} className="rounded-lg" />
                  {!selectedCategory && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                      <div className="text-center px-6">
                        <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <p className="text-white text-sm font-medium mb-1">Kategorie wählen</p>
                        <p className="text-white/40 text-xs">Bitte zuerst eine Kategorie auswählen</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Grid with Inline Controls */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden">
              {/* Filter Bar */}
              <div className="p-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#14A79D]" />
                  <span className="text-white text-sm font-medium">{galleryImages.length} Bilder</span>
                </div>
                <div className="flex items-center gap-2">
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white/[0.04] text-white/70 py-1.5 px-3 rounded-lg text-xs focus:outline-none border border-white/[0.08] appearance-none">
                    <option value="">Alle</option>
                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                  <select value={`${gallerySort.field}_${gallerySort.direction}`} onChange={(e) => { const [field, direction] = e.target.value.split('_'); setGallerySort({ field, direction: direction as 'asc' | 'desc' }); }}
                    className="bg-white/[0.04] text-white/70 py-1.5 px-3 rounded-lg text-xs focus:outline-none border border-white/[0.08] appearance-none">
                    <option value="created_at_desc">Neueste</option>
                    <option value="created_at_asc">Älteste</option>
                    <option value="category_asc">Kategorie A-Z</option>
                  </select>
                  <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
                    <button onClick={() => setGalleryView('grid')} className={`p-1.5 transition-colors ${galleryView === 'grid' ? 'bg-[#14A79D] text-white' : 'text-white/30 hover:text-white/60'}`}>
                      <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setGalleryView('list')} className={`p-1.5 transition-colors ${galleryView === 'list' ? 'bg-[#14A79D] text-white' : 'text-white/30 hover:text-white/60'}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => { setIsSelectionMode(!isSelectionMode); if (isSelectionMode) setSelectedImages([]); }}
                    className={`p-1.5 rounded-lg border transition-colors ${isSelectionMode ? 'bg-amber-500 text-white border-amber-500' : 'text-white/30 border-white/[0.08] hover:text-white/60'}`}>
                    <CheckSquare className="w-4 h-4" />
                  </button>
                  {selectedImages.length > 0 && (
                    <button onClick={deleteMultipleGalleryImages} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors">
                      <Trash className="w-3.5 h-3.5" /> {selectedImages.length}
                    </button>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="p-4">
                {loadingGallery ? (
                  <div className="flex flex-col items-center py-16">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-[#14A79D]/20 border-t-[#14A79D] rounded-full mb-3" />
                    <p className="text-white/30 text-sm">Laden...</p>
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div className="text-center py-16">
                    <ImageIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">Keine Bilder vorhanden</p>
                    <button onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-3 text-[#14A79D] text-xs hover:underline">↑ Bilder hochladen</button>
                  </div>
                ) : galleryView === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3">
                    {galleryImages.map((image, idx) => (
                      <motion.div key={image.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.02 }}
                        className={`relative group rounded-xl overflow-hidden cursor-pointer ${isSelectionMode && selectedImages.includes(image.id) ? 'ring-2 ring-[#14A79D] ring-offset-2 ring-offset-[#050505]' : ''}`}
                        onClick={() => isSelectionMode && toggleImageSelection(image.id)}>
                        <div className="aspect-square">
                          <img src={image.url} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                          <p className="text-white text-xs font-medium truncate">{image.category || 'Ohne Kategorie'}</p>
                          <p className="text-white/40 text-[10px]">{new Date(image.created_at).toLocaleDateString('de-DE')}</p>
                          {!isSelectionMode && (
                            <div className="flex gap-1.5 mt-2">
                              <button onClick={(e) => { e.stopPropagation(); deleteGalleryImage(image.id); }}
                                className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5 text-white" /></button>
                            </div>
                          )}
                        </div>
                        {/* Selection indicator */}
                        {isSelectionMode && (
                          <div className="absolute top-2 left-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedImages.includes(image.id) ? 'bg-[#14A79D] border-[#14A79D]' : 'bg-black/40 border-white/30'}`}>
                              {selectedImages.includes(image.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        )}
                        {/* Car badge */}
                        {image.car_id && (
                          <div className="absolute top-2 right-2 bg-[#14A79D]/80 backdrop-blur-sm rounded-full p-1">
                            <Car className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {galleryImages.map((image) => (
                      <div key={image.id} onClick={() => isSelectionMode && toggleImageSelection(image.id)}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer ${isSelectionMode && selectedImages.includes(image.id) ? 'bg-[#14A79D]/10' : 'hover:bg-white/[0.03]'}`}>
                        {isSelectionMode && (
                          <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${selectedImages.includes(image.id) ? 'bg-[#14A79D] border-[#14A79D]' : 'border-white/20'}`}>
                            {selectedImages.includes(image.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                        )}
                        <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.05]">
                          <img src={image.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{image.category || 'Ohne Kategorie'}</p>
                          <p className="text-white/30 text-xs">{new Date(image.created_at).toLocaleDateString('de-DE')}</p>
                        </div>
                        {image.car_id && <span className="text-[#14A79D] text-xs flex items-center gap-1"><Car className="w-3 h-3" />Verknüpft</span>}
                        {!isSelectionMode && (
                          <button onClick={(e) => { e.stopPropagation(); deleteGalleryImage(image.id); }}
                            className="p-1.5 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#0a0a0f]/95 backdrop-blur-xl rounded-2xl w-full max-w-7xl my-8 border border-white/[0.06] shadow-2xl shadow-black/50"
            >
              <div className="p-6 border-b border-white/[0.06]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      {editingCar && editingCar.id ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug erstellen'}
                    </h3>
                    <p className="text-white/30 text-sm mt-1">{editingCar?.brand && editingCar?.model ? `${editingCar.brand} ${editingCar.model}` : 'Füllen Sie die Fahrzeugdaten aus'}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (isAddingCar && !window.confirm('Sind Sie sicher? Ungespeicherte Änderungen gehen verloren.')) {
                        return;
                      }
                      setEditingCar(null);
                      setIsAddingCar(false);
                    }}
                    className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress bar */}
                {isAddingCar && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/30 text-xs">Fortschritt</span>
                      <span className="text-[#14A79D] text-xs font-medium">{calculateCompletionPercentage()}%</span>
                    </div>
                    <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-[#14A79D] to-[#14A79D]/60 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateCompletionPercentage()}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 mt-5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] flex-wrap">
                  {[
                    { key: 'basic', icon: File, label: 'Basis', badge: !hasRequiredBasicFields() },
                    { key: 'specs', icon: Settings, label: 'Specs' },
                    { key: 'features', icon: List, label: 'Ausstattung' },
                    { key: 'condition', icon: Activity, label: 'Zustand' },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.key
                        ? 'bg-[#14A79D] text-white shadow-lg shadow-[#14A79D]/20'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {tab.badge && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                    </button>
                  ))}
                  <button onClick={() => {
                    if (!hasRequiredBasicFields()) { toast.error('Bitte füllen Sie erst alle Pflichtfelder aus'); setActiveTab('basic'); return; }
                    setActiveTab('preview');
                  }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ml-auto ${activeTab === 'preview'
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
                    <Eye className="w-4 h-4" /> Vorschau
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
                            className={`w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.brand ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
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
                            className={`w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.model ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
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
                            className={`w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.year ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
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
                              className={`w-full bg-white/[0.04] text-white px-4 py-2 pl-8 rounded-lg focus:outline-none focus:ring-2 ${editingCar.price > 0 ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
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
                              className={`w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${editingCar.mileage >= 0 ? 'border border-green-500/30 focus:ring-green-400' : 'border border-red-500/30 focus:ring-red-400'
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
                            className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-700"
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
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32 resize-none border border-gray-700"
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
                            {editingCar.images.map((imageUrl: string, index: number) => (
                              <div key={index} className="relative group aspect-square overflow-hidden rounded-lg">
                                <img
                                  src={imageUrl}
                                  alt={`Bild ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    onClick={() => updateCarField('images', editingCar.images.filter((_: string, i: number) => i !== index))}
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
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Leistung</label>
                        <input
                          type="text"
                          value={editingCar.specs?.power || ''}
                          onChange={(e) => updateSpecsField('power', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Getriebe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.transmission || ''}
                          onChange={(e) => updateSpecsField('transmission', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Kraftstoff</label>
                        <input
                          type="text"
                          value={editingCar.specs?.fuelType || ''}
                          onChange={(e) => updateSpecsField('fuelType', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Beschleunigung</label>
                        <input
                          type="text"
                          value={editingCar.specs?.acceleration || ''}
                          onChange={(e) => updateSpecsField('acceleration', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Höchstgeschwindigkeit</label>
                        <input
                          type="text"
                          value={editingCar.specs?.topSpeed || ''}
                          onChange={(e) => updateSpecsField('topSpeed', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Verbrauch</label>
                        <input
                          type="text"
                          value={editingCar.specs?.consumption || ''}
                          onChange={(e) => updateSpecsField('consumption', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">CO2-Emissionen</label>
                        <input
                          type="text"
                          value={editingCar.specs?.emissions || ''}
                          onChange={(e) => updateSpecsField('emissions', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Hubraum</label>
                        <input
                          type="text"
                          value={editingCar.specs?.hubraum || ''}
                          onChange={(e) => updateSpecsField('hubraum', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Sitze</label>
                        <input
                          type="text"
                          value={editingCar.specs?.seats || ''}
                          onChange={(e) => updateSpecsField('seats', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Türen</label>
                        <input
                          type="text"
                          value={editingCar.specs?.doors || ''}
                          onChange={(e) => updateSpecsField('doors', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Emissionsklasse</label>
                        <input
                          type="text"
                          value={editingCar.specs?.emissionClass || ''}
                          onChange={(e) => updateSpecsField('emissionClass', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Umweltplakette</label>
                        <input
                          type="text"
                          value={editingCar.specs?.environmentBadge || ''}
                          onChange={(e) => updateSpecsField('environmentBadge', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">HU</label>
                        <input
                          type="text"
                          value={editingCar.specs?.inspection || ''}
                          onChange={(e) => updateSpecsField('inspection', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Klimaanlage</label>
                        <input
                          type="text"
                          value={editingCar.specs?.airConditioning || ''}
                          onChange={(e) => updateSpecsField('airConditioning', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Einparkhilfe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.parkingAssist || ''}
                          onChange={(e) => updateSpecsField('parkingAssist', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Airbags</label>
                        <input
                          type="text"
                          value={editingCar.specs?.airbags || ''}
                          onChange={(e) => updateSpecsField('airbags', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Farbe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.color || ''}
                          onChange={(e) => updateSpecsField('color', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Innenfarbe</label>
                        <input
                          type="text"
                          value={editingCar.specs?.interiorColor || ''}
                          onChange={(e) => updateSpecsField('interiorColor', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Anhängelast</label>
                        <input
                          type="text"
                          value={editingCar.specs?.trailerLoad || ''}
                          onChange={(e) => updateSpecsField('trailerLoad', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Zylinder</label>
                        <input
                          type="text"
                          value={editingCar.specs?.cylinders || ''}
                          onChange={(e) => updateSpecsField('cylinders', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Tankvolumen</label>
                        <input
                          type="text"
                          value={editingCar.specs?.tankVolume || ''}
                          onChange={(e) => updateSpecsField('tankVolume', e.target.value)}
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-64 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">Zusatzausstattung</label>
                        <textarea
                          value={editingCar.additionalFeatures?.join('\n') || ''}
                          onChange={(e) => updateCarField('additionalFeatures', e.target.value.split('\n').filter(Boolean))}
                          placeholder="Eine Zusatzausstattung pro Zeile"
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-48 resize-none"
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
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                          className="w-full bg-white/[0.04] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                        initial={{ opacity: 0, y: 20 }}
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
    </div>
  );
};

export default Admin;
