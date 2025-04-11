import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Maximize2, ChevronLeft, ChevronRight, ImageIcon, Heart, Download, Grid3X3, List, Bookmark, BookmarkCheck, RefreshCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

type Image = {
  id: string;
  url: string;
  car_id: string | null;
  car_brand: string | null;
  car_model: string | null;
  category: string | null;
  created_at: string;
};

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('galleryFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState<'normal' | 'large'>('normal');
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [searchQuery, selectedCategory, selectedBrand, images, favorites, showFavoritesOnly]);
  
  useEffect(() => {
    localStorage.setItem('galleryFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      
      // Fetch all car images from the 'gallery' table
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If no gallery table exists yet, fetch from cars table as fallback
      if (!data || data.length === 0) {
        const { data: carsData, error: carsError } = await supabase
          .from('cars')
          .select('id, brand, model, images, created_at');

        if (carsError) throw carsError;

        // Flatten car images into gallery format
        const flattenedImages: Image[] = [];
        
        carsData?.forEach(car => {
          if (car.images && Array.isArray(car.images)) {
            car.images.forEach((url: string, index: number) => {
              flattenedImages.push({
                id: `${car.id}-${index}`,
                url,
                car_id: car.id,
                car_brand: car.brand,
                car_model: car.model,
                category: 'Fahrzeug',
                created_at: car.created_at
              });
            });
          }
        });

        setImages(flattenedImages);
        
        // Extract unique categories and brands
        setCategories(['Fahrzeug']);
        setBrands([...new Set(flattenedImages.map(img => img.car_brand).filter(Boolean) as string[])]);
      } else {
        setImages(data);
        
        // Extract unique categories and brands
        setCategories([...new Set(data.map(img => img.category).filter(Boolean) as string[])]);
        setBrands([...new Set(data.map(img => img.car_brand).filter(Boolean) as string[])]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Fehler beim Laden der Bilder');
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = [...images];
    
    // Apply favorites filter first if active
    if (showFavoritesOnly) {
      filtered = filtered.filter(img => favorites.includes(img.id));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img => 
        (img.car_brand && img.car_brand.toLowerCase().includes(query)) ||
        (img.car_model && img.car_model.toLowerCase().includes(query)) ||
        (img.category && img.category.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(img => img.car_brand === selectedBrand);
    }
    
    setFilteredImages(filtered);
  };

  const toggleFavorite = useCallback((imageId: string) => {
    setFavorites(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  }, []);

  const downloadImage = useCallback(async (imageUrl: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      toast.loading('Bild wird vorbereitet...');
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `autosmaya-bild-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Bild wurde heruntergeladen');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Fehler beim Herunterladen des Bildes');
    }
  }, []);

  const openLightbox = (imageUrl: string, index: number) => {
    setCurrentImage(imageUrl);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setCurrentImage(filteredImages[currentImageIndex + 1].url);
    }
  };

  const goToPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setCurrentImage(filteredImages[currentImageIndex - 1].url);
    }
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowRight':
          if (currentImageIndex < filteredImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setCurrentImage(filteredImages[currentImageIndex + 1].url);
          }
          break;
        case 'ArrowLeft':
          if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            setCurrentImage(filteredImages[currentImageIndex - 1].url);
          }
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex, filteredImages]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setShowFavoritesOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-[#121419] via-[#15171e] to-[#16181f]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#14A79D] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[#14A79D]/60 animate-spin animate-delay-150"></div>
            <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-[#14A79D]/40 animate-spin animate-delay-300"></div>
          </div>
          <div className="text-white text-xl font-medium">Lade Galerie...</div>
          <p className="text-gray-400 mt-2">Wir bereiten die schönsten Bilder für Sie vor</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-36 pb-16 px-4 bg-gradient-to-b from-[#121419] via-[#15171e] to-[#16181f]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
          onAnimationComplete={() => setAnimationComplete(true)}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-5 text-white"
          >
            Exklusive Fahrzeug-Galerie
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-300 text-center mb-12 max-w-2xl mx-auto text-lg"
          >
            Entdecken Sie unsere Premium-Sammlung beeindruckender Fahrzeugbilder
          </motion.p>

          {/* Search and toolbar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 bg-gradient-to-br from-[#1a1c25]/90 to-[#16181f]/90 backdrop-blur-md p-4 md:p-5 rounded-xl shadow-lg border border-gray-800/50"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search input */}
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#14A79D] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Suchen Sie nach Marke, Modell oder Kategorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#16181f]/80 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14A79D] focus:border-transparent border border-gray-700 placeholder-gray-500 transition-all duration-300"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View options and filter toggles */}
              <div className="flex items-center flex-wrap gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Toggle favorites view */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300",
                    showFavoritesOnly 
                      ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white shadow-md shadow-[#14A79D]/20 ring-2 ring-[#14A79D]/20" 
                      : "bg-[#16181f]/90 text-gray-300 hover:text-white border border-gray-700 hover:border-[#14A79D]/60 hover:bg-[#14A79D]/10"
                  )}
                >
                  {showFavoritesOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  <span className="text-sm font-medium">{favorites.length} Favoriten</span>
                </button>

                {/* Toggle filters visibility */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300",
                    showFilters
                      ? "bg-[#1c1f29] text-[#14A79D] border border-[#14A79D]/40 ring-1 ring-[#14A79D]/10"
                      : "bg-[#16181f]/90 text-gray-300 hover:text-white border border-gray-700 hover:border-[#14A79D]/60 hover:bg-[#14A79D]/10"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter</span>
                </button>

                {/* Reset all filters */}
                {(selectedCategory || selectedBrand || searchQuery || showFavoritesOnly) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 bg-[#16181f]/90 text-gray-300 hover:text-white border border-gray-700 hover:border-[#14A79D]/60 hover:bg-[#14A79D]/10"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span className="text-sm font-medium">Zurücksetzen</span>
                  </button>
                )}

                {/* Grid size toggle */}
                {viewMode === 'grid' && (
                  <button
                    onClick={() => setGridSize(gridSize === 'normal' ? 'large' : 'normal')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 bg-[#16181f]/90 text-gray-300 hover:text-white border border-gray-700 hover:border-[#14A79D]/60 hover:bg-[#14A79D]/10"
                  >
                    <span className="text-sm font-medium">{gridSize === 'normal' ? 'Große' : 'Normale'} Ansicht</span>
                  </button>
                )}

                {/* View mode toggle */}
                <div className="flex rounded-lg overflow-hidden border border-gray-700/80 shadow-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "px-3 py-2 transition-all duration-300 font-medium",
                      viewMode === 'grid' 
                        ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white" 
                        : "bg-[#16181f]/90 text-gray-300 hover:text-white hover:bg-[#14A79D]/10"
                    )}
                    aria-label="Rasteransicht"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-2 transition-all duration-300 font-medium",
                      viewMode === 'list' 
                        ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white" 
                        : "bg-[#16181f]/90 text-gray-300 hover:text-white hover:bg-[#14A79D]/10"
                    )}
                    aria-label="Listenansicht"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters section */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 pt-5 border-t border-gray-700/30">
                    {/* Category filters */}
                    {categories.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">Kategorien</span>
                          <div className="h-px bg-gradient-to-r from-gray-700/70 to-transparent flex-grow"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCategory('')}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium",
                              !selectedCategory 
                                ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white shadow-sm shadow-[#14A79D]/20 ring-1 ring-[#14A79D]/20" 
                                : "bg-[#16181f]/90 text-gray-300 hover:bg-[#16181f] hover:text-white border border-gray-700 hover:border-[#14A79D]/30 hover:bg-[#14A79D]/5"
                            )}
                          >
                            Alle
                          </button>
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium",
                                selectedCategory === category 
                                  ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white shadow-sm shadow-[#14A79D]/20 ring-1 ring-[#14A79D]/20" 
                                  : "bg-[#16181f]/90 text-gray-300 hover:bg-[#16181f] hover:text-white border border-gray-700 hover:border-[#14A79D]/30 hover:bg-[#14A79D]/5"
                              )}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Brand filters */}
                    {brands.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">Marken</span>
                          <div className="h-px bg-gradient-to-r from-gray-700/70 to-transparent flex-grow"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedBrand('')}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium",
                              !selectedBrand 
                                ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white shadow-sm shadow-[#14A79D]/20 ring-1 ring-[#14A79D]/20" 
                                : "bg-[#16181f]/90 text-gray-300 hover:bg-[#16181f] hover:text-white border border-gray-700 hover:border-[#14A79D]/30 hover:bg-[#14A79D]/5"
                            )}
                          >
                            Alle
                          </button>
                          {brands.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => setSelectedBrand(brand)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium",
                                selectedBrand === brand 
                                  ? "bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white shadow-sm shadow-[#14A79D]/20 ring-1 ring-[#14A79D]/20" 
                                  : "bg-[#16181f]/90 text-gray-300 hover:bg-[#16181f] hover:text-white border border-gray-700 hover:border-[#14A79D]/30 hover:bg-[#14A79D]/5"
                              )}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results counter */}
            <div className="mt-4 text-center text-sm text-gray-400">
              <motion.span
                key={filteredImages.length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredImages.length} {filteredImages.length === 1 ? 'Bild' : 'Bilder'} gefunden
                {showFavoritesOnly && (
                  <span className="ml-1.5 text-[#14A79D]">(nur Favoriten)</span>
                )}
              </motion.span>
            </div>
          </motion.div>

          {/* Gallery Grid/List View */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {filteredImages.length > 0 ? (
              viewMode === 'grid' ? (
                <div className={cn(
                  "grid gap-5",
                  gridSize === 'normal' 
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                  {filteredImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: imageLoaded[image.id] ? 1 : 0, 
                        scale: imageLoaded[image.id] ? 1 : 0.9,
                        y: imageLoaded[image.id] ? 0 : 20
                      }}
                      transition={{ 
                        duration: 0.5, 
                        delay: animationComplete ? 0 : index % 8 * 0.05,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -5,
                        boxShadow: "0 15px 30px -8px rgba(0, 0, 0, 0.3)"
                      }}
                      onHoverStart={() => setHoverIndex(index)}
                      onHoverEnd={() => setHoverIndex(null)}
                      className={cn(
                        "relative group rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1c25]/90 to-[#16181f]/90 backdrop-blur-md cursor-pointer shadow-lg transition-shadow duration-300",
                        gridSize === 'normal' ? "aspect-square" : "aspect-video"
                      )}
                      onClick={() => openLightbox(image.url, index)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute inset-0 bg-[#14A79D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-5" />
                      
                      {favorites.includes(image.id) && (
                        <div className="absolute top-3 left-3 z-20">
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-[#14A79D] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md flex items-center gap-1"
                          >
                            <BookmarkCheck className="w-3 h-3" />
                            <span>Favorit</span>
                          </motion.div>
                        </div>
                      )}
                      
                      <img
                        src={image.url}
                        alt={`${image.car_brand || ''} ${image.car_model || ''}`}
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                          hoverIndex === index ? "scale-105" : "scale-100"
                        )}
                        loading="lazy"
                        onLoad={() => {
                          setImageLoaded(prev => ({ ...prev, [image.id]: true }));
                        }}
                      />
                      
                      {/* Image actions */}
                      <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <button 
                          className="bg-black/50 hover:bg-[#14A79D]/80 text-white p-2.5 rounded-lg backdrop-blur-sm transition-colors ring-1 ring-white/10 hover:ring-[#14A79D]/30 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(image.id);
                          }}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(image.id) ? 'fill-[#14A79D] text-[#14A79D]' : 'text-white'}`} />
                        </button>
                        <button 
                          className="bg-black/50 hover:bg-[#14A79D]/80 text-white p-2.5 rounded-lg backdrop-blur-sm transition-colors ring-1 ring-white/10 hover:ring-[#14A79D]/30 shadow-lg"
                          onClick={(e) => downloadImage(image.url, e)}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button 
                          className="bg-black/50 hover:bg-[#14A79D]/80 text-white p-2.5 rounded-lg backdrop-blur-sm transition-colors ring-1 ring-white/10 hover:ring-[#14A79D]/30 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(image.url, index);
                          }}
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Image info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                        {(image.car_brand || image.car_model || image.category) && (
                          <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            {image.car_brand && (
                              <h3 className="text-white font-bold text-lg tracking-wide truncate">
                                {image.car_brand} {image.car_model}
                              </h3>
                            )}
                            {image.category && (
                              <div className="mt-1">
                                <span className="inline-block bg-black/40 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                                  {image.category}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#1a1c25]/90 to-[#16181f]/90 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                  <div className="divide-y divide-gray-800/50">
                    {filteredImages.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: animationComplete ? 0 : index * 0.03,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className={cn(
                          "flex items-center p-3 hover:bg-[#14A79D]/10 transition-all duration-300 cursor-pointer",
                          favorites.includes(image.id) ? "bg-[#14A79D]/5" : ""
                        )}
                        onClick={() => openLightbox(image.url, index)}
                      >
                        <div className="h-16 w-24 relative overflow-hidden rounded-lg border border-gray-700 mr-4 flex-shrink-0 bg-[#0f1014]">
                          <img
                            src={image.url}
                            alt={`${image.car_brand || ''} ${image.car_model || ''}`}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-white font-medium">
                            {image.car_brand 
                              ? `${image.car_brand} ${image.car_model || ''}` 
                              : "Fahrzeugbild"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {image.category && (
                              <span className="inline-block bg-[#1a1c25] text-gray-300 text-xs px-2 py-0.5 rounded-md border border-gray-700/50">
                                {image.category}
                              </span>
                            )}
                            <span className="text-gray-400 text-xs">
                              {new Date(image.created_at).toLocaleDateString('de-DE')}
                            </span>
                            {favorites.includes(image.id) && (
                              <span className="text-[#14A79D] text-xs flex items-center gap-1">
                                <BookmarkCheck className="w-3 h-3" /> Favorit
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-2">
                          <button 
                            className="text-gray-400 hover:text-[#14A79D] p-2 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(image.id);
                            }}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(image.id) ? 'fill-[#14A79D] text-[#14A79D]' : ''}`} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-[#14A79D] p-2 rounded-lg transition-colors"
                            onClick={(e) => downloadImage(image.url, e)}
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-gradient-to-br from-[#1a1c25]/90 to-[#16181f]/90 backdrop-blur-md rounded-xl border border-gray-800"
              >
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-300 text-lg font-medium mb-2">
                  Keine Bilder gefunden
                </p>
                <p className="text-gray-400">
                  Bitte versuchen Sie eine andere Suche oder Filter-Einstellung.
                </p>
                {selectedCategory || selectedBrand || searchQuery || showFavoritesOnly ? (
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#14A79D] to-[#0d8880] text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#14A79D]/20 font-medium"
                  >
                    Filter zurücksetzen
                  </button>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute top-4 right-4 text-white bg-black/70 hover:bg-[#14A79D] p-2.5 rounded-full z-50 transition-colors duration-300 shadow-xl ring-1 ring-white/10 hover:ring-[#14A79D]/50"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            {currentImageIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/70 hover:bg-[#14A79D] p-3 rounded-full z-50 transition-colors duration-300 shadow-xl ring-1 ring-white/10 hover:ring-[#14A79D]/50"
                onClick={goToPrevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}
            
            {currentImageIndex < filteredImages.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/70 hover:bg-[#14A79D] p-3 rounded-full z-50 transition-colors duration-300 shadow-xl ring-1 ring-white/10 hover:ring-[#14A79D]/50"
                onClick={goToNextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt="Vergrößertes Bild"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
            
            {/* Image info in lightbox */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="absolute bottom-8 left-0 right-0 flex justify-center"
            >
              {filteredImages[currentImageIndex] && (
                <div className="bg-black/70 backdrop-blur-md px-6 py-4 rounded-xl flex flex-col items-center shadow-xl border border-white/5">
                  {filteredImages[currentImageIndex].car_brand && (
                    <p className="text-white font-bold text-lg">
                      {filteredImages[currentImageIndex].car_brand} {filteredImages[currentImageIndex].car_model}
                    </p>
                  )}
                  {filteredImages[currentImageIndex].category && (
                    <p className="text-[#14A79D] text-sm mt-1">
                      {filteredImages[currentImageIndex].category}
                    </p>
                  )}
                  
                  {/* Lightbox actions */}
                  <div className="mt-4 flex gap-6">
                    <button 
                      className="flex items-center gap-2 text-white hover:text-[#14A79D] transition-colors bg-black/30 hover:bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(filteredImages[currentImageIndex].id);
                      }}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(filteredImages[currentImageIndex].id) ? 'fill-[#14A79D] text-[#14A79D]' : ''}`} />
                      <span className="font-medium">{favorites.includes(filteredImages[currentImageIndex].id) ? 'Favorisiert' : 'Favorisieren'}</span>
                    </button>
                    <button 
                      className="flex items-center gap-2 text-white hover:text-[#14A79D] transition-colors bg-black/30 hover:bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg"
                      onClick={(e) => downloadImage(filteredImages[currentImageIndex].url, e)}
                    >
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Download</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
            
            <div className="absolute bottom-4 right-4 text-white text-sm bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery; 