import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Banner as BannerType } from '@/types';
import { bannerService } from '@/services';

interface BannerProps {
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ className = '' }) => {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setIsLoading(true);
        const activeBanner = await bannerService.getActive();
        
        if (activeBanner && isValidBanner(activeBanner)) {
          setBanner(activeBanner);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const isValidBanner = (banner: BannerType): boolean => {
    const now = new Date();
    const startDate = new Date(banner.dateInit);
    const endDate = new Date(banner.dateEnd);
    
    return (
      banner.status === 'ACTIVE' &&
      now >= startDate &&
      now <= endDate &&
      banner.imageUrl
    );
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isLoading || !banner || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative w-full bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200 ${className}`}
        >
          {/* Banner Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              {/* Banner Image and Content */}
              <div className="flex items-center space-x-4 flex-1">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.name}
                    className="h-12 w-8 sm:h-16 sm:w-10 md:h-20 md:w-12 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Banner Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-primary-900 truncate">
                    {banner.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-600 mt-1">
                    Válido hasta: {new Date(banner.dateEnd).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-2 rounded-full hover:bg-primary-200 transition-colors duration-200 group"
                aria-label="Cerrar banner"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 group-hover:text-primary-800" />
              </button>
            </div>
          </div>

          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;