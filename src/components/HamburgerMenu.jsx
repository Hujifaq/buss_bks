import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiMap, FiSearch, FiHelpCircle, FiChevronRight, FiX } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';

function HamburgerMenu({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'home',
      label: t('menu.home'),
      path: '/',
      icon: FiHome,
    },
    {
      id: 'bus-stops',
      label: t('menu.busStops'),
      path: '/bus-stops',
      icon: FaBus,
    },
    {
      id: 'route-info',
      label: t('menu.routeInfo'),
      path: '/route-information',
      icon: FiMap,
    },
    {
      id: 'help',
      label: t('menu.help'),
      path: '/help',
      icon: FiHelpCircle,
    },
  ];

  const handleNavigate = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      setIsOpen(false);
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Clean & Minimalist Hamburger Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 w-9 h-9 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 flex items-center justify-center cursor-pointer focus:outline-none transition-colors duration-150 shadow-sm"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        title={isOpen ? "Close Menu" : "Open Menu"}
      >
        {isOpen ? <FiX size={20} /> : <RxHamburgerMenu size={20} />}
      </button>

      {/* Backdrop & Drawer Portal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Minimalist Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Clean Minimalist Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm sm:w-80 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.06)] z-40 flex flex-col justify-between py-8 px-6 border-l border-gray-100 overflow-y-auto"
            >
              {/* Drawer Content */}
              <div className="flex flex-col gap-6 pt-2">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/logo_bks.png"
                      alt="BKS Logo"
                      className="h-8 w-auto object-contain"
                    />
                    <span className="text-base font-bold text-gray-900">
                      {t('menu.title')}
                    </span>
                  </div>
                </div>

                {/* Minimalist Navigation Items */}
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
                    closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                  }}
                  className="flex flex-col gap-1"
                >
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.path && location.pathname === item.path;

                    return (
                      <motion.div
                        key={item.id}
                        variants={{
                          open: { opacity: 1, y: 0 },
                          closed: { opacity: 0, y: 6 },
                        }}
                        transition={{ duration: 0.18 }}
                      >
                        <button
                          onClick={() => handleNavigate(item)}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-colors duration-150 group cursor-pointer ${
                            isActive
                              ? 'bg-gray-100/80 text-gray-900 font-bold'
                              : 'hover:bg-gray-50 text-gray-700 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={18}
                              className={`transition-colors ${
                                isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-700'
                              }`}
                            />
                            <span className="text-sm tracking-tight">
                              {item.label}
                            </span>
                          </div>

                          <FiChevronRight
                            size={16}
                            className={`transition-transform duration-150 ${
                              isActive
                                ? 'text-gray-900'
                                : 'text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5'
                            }`}
                          />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default HamburgerMenu;
