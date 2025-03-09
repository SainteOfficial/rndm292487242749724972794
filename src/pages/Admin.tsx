import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Edit, Trash2, Plus, Save, X, LogOut, Upload, Image as ImageIcon, AlertTriangle, ChevronDown, ToggleLeft as Toggle } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const Admin = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchCars();
  }, []);

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
      // Create a copy of the car object with the correct field name
      const carToSave = {
        ...car,
        additionalfeatures: car.additionalFeatures, // Map to the correct field name
        specs: JSON.stringify(car.specs),
        condition: JSON.stringify(car.condition)
      };

      // Remove the original additionalFeatures field
      delete carToSave.additionalFeatures;

      const { error } = await supabase
        .from('cars')
        .upsert(carToSave);

      if (error) throw error;

      toast.success('Fahrzeug erfolgreich gespeichert');
      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error('Fehler beim Speichern des Fahrzeugs');
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white">Lade Fahrzeuge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Abmelden
          </button>
        </div>

        <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Fahrzeuge</h2>
            <button
              onClick={() => {
                setEditingCar({
                  brand: '',
                  model: '',
                  year: new Date().getFullYear(),
                  price: 0,
                  mileage: 0,
                  images: [],
                  description: '',
                  specs: {
                    engine: '',
                    power: '',
                    transmission: '',
                    fuelType: '',
                    acceleration: '',
                    topSpeed: '',
                    consumption: '',
                    emissions: '',
                    hubraum: '',
                    seats: '',
                    doors: '',
                    emissionClass: '',
                    environmentBadge: '',
                    inspection: '',
                    airConditioning: '',
                    parkingAssist: '',
                    airbags: '',
                    color: '',
                    interiorColor: '',
                    trailerLoad: '',
                    cylinders: '',
                    tankVolume: ''
                  },
                  features: [],
                  additionalFeatures: [],
                  condition: {
                    type: 'Neu',
                    accident: false,
                    previousOwners: 0,
                    warranty: true,
                    serviceHistory: true
                  },
                  status: 'available'
                });
                setActiveTab('basic');
              }}
              className="bg-[#14A79D] text-white px-4 py-2 rounded-lg hover:bg-[#118F86] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Neues Fahrzeug
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1c25] rounded-lg overflow-hidden"
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
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    car.status === 'available' 
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
                      className={`w-full px-4 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        car.status === 'available'
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
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#16181f] rounded-lg w-full max-w-4xl my-8"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">
                    {editingCar.id ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
                  </h3>
                  <button
                    onClick={() => setEditingCar(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'basic'
                        ? 'bg-[#14A79D] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Basis
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'specs'
                        ? 'bg-[#14A79D] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Spezifikationen
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'features'
                        ? 'bg-[#14A79D] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Ausstattung
                  </button>
                  <button
                    onClick={() => setActiveTab('condition')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'condition'
                        ? 'bg-[#14A79D] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Zustand
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {activeTab === 'basic' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Marke</label>
                        <input
                          type="text"
                          value={editingCar.brand || ''}
                          onChange={(e) => updateCarField('brand', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Modell</label>
                        <input
                          type="text"
                          value={editingCar.model || ''}
                          onChange={(e) => updateCarField('model', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Jahr</label>
                        <input
                          type="number"
                          value={editingCar.year || ''}
                          onChange={(e) => updateCarField('year', parseInt(e.target.value))}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Preis</label>
                        <input
                          type="number"
                          value={editingCar.price || ''}
                          onChange={(e) => updateCarField('price', parseInt(e.target.value))}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Kilometerstand</label>
                        <input
                          type="number"
                          value={editingCar.mileage || ''}
                          onChange={(e) => updateCarField('mileage', parseInt(e.target.value))}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Status</label>
                        <select
                          value={editingCar.status || 'available'}
                          onChange={(e) => updateCarField('status', e.target.value)}
                          className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                        className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-4">Bilder</label>
                      <ImageUpload
                        onImagesUploaded={(urls) => 
                          updateCarField('images', [...(editingCar.images || []), ...urls])
                        }
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
                      <textarea
                        value={editingCar.features?.join('\n') || ''}
                        onChange={(e) => updateCarField('features', e.target.value.split('\n').filter(Boolean))}
                        placeholder="Eine Ausstattung pro Zeile"
                        className="w-full bg-[#1a1c25] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-48 resize-none"
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

              <div className="p-6 border-t border-gray-800 flex justify-end gap-4">
                <button
                  onClick={() => setEditingCar(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => handleSave(editingCar)}
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