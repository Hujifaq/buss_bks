import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FiClock, FiSearch, FiMapPin, FiChevronDown, FiChevronUp, FiArrowRight, FiAlertCircle, FiX, FiInfo } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import './RouteInformation.css';
import RideMap from './RideMap';
import { MoonLoader } from 'react-spinners';

// Comprehensive station translation dictionary for English language support
const stationTranslationMap = {
  'นครราชสีมา': 'Nakhon Ratchasima',
  'โคราช': 'Korat',
  'กรุงเทพฯ': 'Bangkok',
  'กรุงเทพ': 'Bangkok',
  'กรุงเทพมหานคร': 'Bangkok',
  'ปากช่อง': 'Pak Chong',
  'ขอนแก่น': 'Khon Kaen',
  'อุดรธานี': 'Udon Thani',
  'หนองคาย': 'Nong Khai',
  'บุรีรัมย์': 'Buri Ram',
  'สุรินทร์': 'Surin',
  'ศรีสะเกษ': 'Si Sa Ket',
  'อุบลราชธานี': 'Ubon Ratchathani',
  'ชัยภูมิ': 'Chaiyaphum',
  'พิมาย': 'Phimai',
  'โชคชัย': 'Chok Chai',
  'นางรอง': 'Nang Rong',
  'ประทาย': 'Prathai',
  'ด่านขุนทด': 'Dan Khun Thot',
  'บัวใหญ่': 'Bua Yai',
  'สีคิ้ว': 'Sikhiu',
  'สูงเนิน': 'Sung Noen',
  'โนนสูง': 'Non Sung',
  'โนนแดง': 'Non Daeng',
  'พล': 'Phon',
  'บ้านไผ่': 'Ban Phai',
  'มวกเหล็ก': 'Muak Lek',
  'สระบุรี': 'Saraburi',
  'อยุธยา': 'Ayutthaya',
  'ปักธงชัย': 'Pak Thong Chai',
  'เสิงสาง': 'Soeng Sang',
  'ครบุรี': 'Khon Buri',
  'ห้วยแถลง': 'Huai Thalaeng',
  'ชุมพวง': 'Chum Phuang',
  'จักราช': 'Chakkarat',
  'ขามสะแกแสง': 'Kham Sakaesaeng',
  'พระทองคำ': 'Phra Thong Kham',
  'เฉลิมพระเกียรติ': 'Chaloem Phra Kiat',
  'เมืองยาง': 'Mueang Yang',
  'ลำทะเมนชัย': 'Lam Thamenchai',
  'บัวลาย': 'Bua Lai',
  'สีดา': 'Sida',
  'บ้านด่านนอก': 'Ban Dan Nok',
  'กบินทร์บุรี': 'Kabin Buri',
  'ปราจีนบุรี': 'Prachin Buri',
  'ฉะเชิงเทรา': 'Chachoengsao',
  'ชลบุรี': 'Chon Buri',
  'พัทยา': 'Pattaya',
  'ระยอง': 'Rayong',
  'จันทบุรี': 'Chanthaburi',
  'ตราด': 'Trat',
  'เชียงใหม่': 'Chiang Mai',
  'เชียงราย': 'Chiang Rai',
  'พิษณุโลก': 'Phitsanulok',
  'นครสวรรค์': 'Nakhon Sawan',
  'ลพบุรี': 'Lop Buri',
  'กาญจนบุรี': 'Kanchanaburi',
  'ราชบุรี': 'Ratchaburi',
  'เพชรบุรี': 'Phetchaburi',
  'หัวหิน': 'Hua Hin',
  'ประจวบคีรีขันธ์': 'Prachuap Khiri Khan',
  'ชุมพร': 'Chumphon',
  'สุราษฎร์ธานี': 'Surat Thani',
  'ภูเก็ต': 'Phuket',
  'หาดใหญ่': 'Hat Yai',
  'สงขลา': 'Songkhla',
};

const reverseStationMap = Object.entries(stationTranslationMap).reduce((acc, [th, en]) => {
  acc[en.toLowerCase()] = th;
  return acc;
}, {});

const isCleanEnglish = (str) => {
  if (!str || typeof str !== 'string') return false;
  // If string contains any Thai unicode characters (\u0E00-\u0E7F), it is NOT English
  if (/[\u0E00-\u0E7F]/.test(str)) return false;
  return /^[a-zA-Z0-9\s.,'()-]+$/.test(str.trim());
};

const translateStation = (name, isEn) => {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!isEn) return trimmed;
  if (isCleanEnglish(trimmed)) return trimmed;
  return stationTranslationMap[trimmed] || trimmed;
};

const getLocalizedStationName = (name, isEn) => {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  if (isEn) {
    if (isCleanEnglish(trimmed)) return trimmed;
    return stationTranslationMap[trimmed] || trimmed;
  } else {
    const lower = trimmed.toLowerCase();
    if (reverseStationMap[lower]) return reverseStationMap[lower];
    return trimmed;
  }
};

// Component for Route Search Box (used in sidebar and mobile header)
const RouteSearchBox = ({
  originInput,
  setOriginInput,
  destInput,
  setDestInput,
  locationOptions,
  allDbRoutes,
  onSearch,
  onSwap,
  onSelectQuickRoute,
  searchWarning,
  onClearWarning,
}) => {
  const { t } = useTranslation();
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const originRef = useRef(null);
  const destRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setIsOriginOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target)) {
        setIsDestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic connected origins based on selected/typed destination
  const availableOriginOptions = useMemo(() => {
    if (!destInput.trim() || !allDbRoutes || allDbRoutes.length === 0) {
      return locationOptions;
    }
    const dLower = destInput.trim().toLowerCase();

    const filtered = locationOptions.filter((loc) => {
      const isObject = typeof loc === 'object' && loc !== null;
      const th = isObject ? loc.th : loc;
      const en = isObject ? loc.en : '';

      const isCurrentDest = th.toLowerCase() === dLower || (en && en.toLowerCase() === dLower);
      if (isCurrentDest) return false;

      return allDbRoutes.some((r) => {
        const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
        const matchesDest = text.includes(dLower);
        const matchesOrigin = text.includes(th.toLowerCase()) || (en && text.includes(en.toLowerCase()));
        return matchesDest && matchesOrigin;
      });
    });

    return filtered.length > 0 ? filtered : locationOptions;
  }, [destInput, allDbRoutes, locationOptions]);

  // Dynamic connected destinations based on selected/typed origin
  const availableDestOptions = useMemo(() => {
    if (!originInput.trim() || !allDbRoutes || allDbRoutes.length === 0) {
      return locationOptions;
    }
    const oLower = originInput.trim().toLowerCase();

    const filtered = locationOptions.filter((loc) => {
      const isObject = typeof loc === 'object' && loc !== null;
      const th = isObject ? loc.th : loc;
      const en = isObject ? loc.en : '';

      const isCurrentOrigin = th.toLowerCase() === oLower || (en && en.toLowerCase() === oLower);
      if (isCurrentOrigin) return false;

      return allDbRoutes.some((r) => {
        const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
        const matchesOrigin = text.includes(oLower);
        const matchesDest = text.includes(th.toLowerCase()) || (en && text.includes(en.toLowerCase()));
        return matchesOrigin && matchesDest;
      });
    });

    return filtered.length > 0 ? filtered : locationOptions;
  }, [originInput, allDbRoutes, locationOptions]);

  const filteredOrigins = useMemo(() => {
    const list = availableOriginOptions;
    if (!originInput.trim()) return list;
    const oLower = originInput.trim().toLowerCase();
    return list.filter((loc) => {
      if (typeof loc === 'object' && loc !== null) {
        return loc.searchKey ? loc.searchKey.includes(oLower) : loc.label.toLowerCase().includes(oLower);
      }
      return String(loc).toLowerCase().includes(oLower);
    });
  }, [originInput, availableOriginOptions]);

  const filteredDests = useMemo(() => {
    const list = availableDestOptions;
    if (!destInput.trim()) return list;
    const dLower = destInput.trim().toLowerCase();
    return list.filter((loc) => {
      if (typeof loc === 'object' && loc !== null) {
        return loc.searchKey ? loc.searchKey.includes(dLower) : loc.label.toLowerCase().includes(dLower);
      }
      return String(loc).toLowerCase().includes(dLower);
    });
  }, [destInput, availableDestOptions]);

  return (
    <div className="ri-search-container">
      <div className="ri-search-header-title">
        <FiSearch size={14} className="text-gray-500" />
        <span>{t('ri.pageTitle', 'ค้นหาเส้นทาง')}</span>
      </div>

      <div className="ri-search-inputs-wrapper">
        {/* Origin Field */}
        <div className="ri-search-field" ref={originRef}>
          <FiMapPin className="ri-field-icon origin" size={15} />
          <input
            type="text"
            value={originInput}
            onChange={(e) => {
              setOriginInput(e.target.value);
              setIsOriginOpen(true);
            }}
            onFocus={() => setIsOriginOpen(true)}
            placeholder={t('ri.from', 'ต้นทาง')}
            className="ri-search-input"
          />
          {isOriginOpen && filteredOrigins.length > 0 && (
            <div className="ri-autocomplete-dropdown">
              {filteredOrigins.map((loc, idx) => {
                const itemLabel = typeof loc === 'object' && loc !== null ? loc.label : loc;
                const itemVal = typeof loc === 'object' && loc !== null ? loc.value : loc;
                return (
                  <div
                    key={idx}
                    className="ri-autocomplete-item"
                    onClick={() => {
                      setOriginInput(itemVal);
                      setIsOriginOpen(false);
                      if (destInput.trim()) {
                        onSearch(itemVal, destInput);
                      }
                    }}
                  >
                    {itemLabel}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Destination Field */}
        <div className="ri-search-field" ref={destRef}>
          <FiMapPin className="ri-field-icon dest" size={15} />
          <input
            type="text"
            value={destInput}
            onChange={(e) => {
              setDestInput(e.target.value);
              setIsDestOpen(true);
            }}
            onFocus={() => setIsDestOpen(true)}
            placeholder={t('ri.to', 'ปลายทาง')}
            className="ri-search-input"
          />
          {isDestOpen && filteredDests.length > 0 && (
            <div className="ri-autocomplete-dropdown">
              {filteredDests.map((loc, idx) => {
                const itemLabel = typeof loc === 'object' && loc !== null ? loc.label : loc;
                const itemVal = typeof loc === 'object' && loc !== null ? loc.value : loc;
                return (
                  <div
                    key={idx}
                    className="ri-autocomplete-item"
                    onClick={() => {
                      setDestInput(itemVal);
                      setIsDestOpen(false);
                      onSearch(originInput, itemVal);
                    }}
                  >
                    {itemLabel}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actions: Swap & Search */}
      <div className="ri-search-actions">
        <button
          type="button"
          onClick={onSwap}
          className="ri-swap-btn"
          title="สลับต้นทาง-ปลายทาง"
        >
          <FaExchangeAlt size={13} />
        </button>
        <button
          type="button"
          onClick={() => onSearch(originInput, destInput)}
          className="ri-submit-btn"
        >
          <FiSearch size={14} />
          <span>{t('ri.searchBtn', 'ค้นหา')}</span>
        </button>
      </div>

      {/* Warning Alert Notice Banner */}
      {searchWarning && (
        <div className="ri-warning-box">
          <div className="ri-warning-header">
            <FiAlertCircle size={16} className="ri-warning-icon" />
            <span className="ri-warning-title">{searchWarning.title}</span>
            <button
              type="button"
              onClick={onClearWarning}
              className="ri-warning-close"
              title="ปิดการแจ้งเตือน"
            >
              <FiX size={14} />
            </button>
          </div>
          <p className="ri-warning-msg">{searchWarning.message}</p>
        </div>
      )}
    </div>
  );
};

// StepperContent shows the full route timeline including via stops
const StepperContent = ({ origin, originDetail, destination, destinationDetail, viaStops }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const translatedViaStops = useMemo(() => {
    return viaStops.map((s) => translateStation(s, isEn));
  }, [viaStops, isEn]);

  const allStops = [
    { name: origin, detail: originDetail, type: 'start' },
    ...translatedViaStops.map((s) => ({ name: s, type: 'via' })),
    { name: destination, detail: destinationDetail, type: 'end' },
  ].filter((s) => s.name && s.name.trim() !== '');

  return (
    <div className="ri-stepper-container">
      <div className="ri-stepper">
        {allStops.map((stop, index) => {
          const isStart = stop.type === 'start';
          const isEnd = stop.type === 'end';
          const isLast = index === allStops.length - 1;

          return (
            <div className={`ri-step ${stop.type}`} key={index}>
              {/* Timeline Indicator Column */}
              <div className="ri-timeline-col">
                <div className={`ri-step-circle ${stop.type}`}>
                  {(isStart || isEnd) && <div className="ri-inner-dot" />}
                </div>
                {!isLast && <div className="ri-timeline-line" />}
              </div>

              {/* Step Details */}
              <div className="ri-step-content">
                <div className="ri-step-header">
                  <h3 className="ri-step-title">{stop.name}</h3>
                  {stop.detail && (
                    <span className="ri-step-detail">
                      ({stop.detail})
                    </span>
                  )}
                </div>
                <span className={`ri-step-tag ${stop.type}`}>
                  {isStart ? t('ri.startAt', 'จุดเริ่มต้น') : isEnd ? t('ri.endAt', 'จุดหมายปลายทาง') : t('busStops.card.stop', 'จุดรับ-จอด')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ri-bottom-banner">
        <FiInfo size={16} className="ri-banner-icon" />
        <span>{t('ri.bottomBanner', 'ข้อมูลนี้เป็นเส้นทางรถตามจุดจอดที่มีในระบบ ไม่ใช่การติดตามตำแหน่งรถแบบเรียลไทม์')}</span>
      </div>
    </div>
  );
};

const RouteInformation = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const originQuery = (searchParams.get('origin') || '').trim();
  const destinationQuery = (searchParams.get('destination') || '').trim();

  const [allDbRoutes, setAllDbRoutes] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchWarning, setSearchWarning] = useState(null);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isMobileInfoCollapsed, setIsMobileInfoCollapsed] = useState(false);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    // Swipe down to collapse (deltaY > 30), swipe up to expand (deltaY < -30)
    if (deltaY > 30) {
      setIsMobileInfoCollapsed(true);
    } else if (deltaY < -30) {
      setIsMobileInfoCollapsed(false);
    }

    touchStartY.current = null;
  };

  // Search input fields local state
  const [originInput, setOriginInput] = useState(originQuery);
  const [destInput, setDestInput] = useState(destinationQuery);

  // Keep search inputs synced if URL search params or active language change
  useEffect(() => {
    const isEn = i18n.language === 'en';
    setOriginInput((prev) => getLocalizedStationName(prev || originQuery, isEn));
    setDestInput((prev) => getLocalizedStationName(prev || destinationQuery, isEn));
  }, [originQuery, destinationQuery, i18n.language]);

  // Fetch Supabase route data once on mount or query change
  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const { data: routes, error } = await supabase.from('bus_routes').select('*');
        if (error) throw error;
        if (!routes || routes.length === 0) return;

        setAllDbRoutes(routes);

        let matchedRoutes = [];
        let warning = null;

        if (originQuery || destinationQuery) {
          const oLower = originQuery.toLowerCase();
          const dLower = destinationQuery.toLowerCase();

          if (originQuery && destinationQuery) {
            matchedRoutes = routes.filter((r) => {
              const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
              return text.includes(oLower) && text.includes(dLower);
            });
          } else if (originQuery) {
            matchedRoutes = routes.filter((r) => {
              const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
              return text.includes(oLower);
            });
          } else if (destinationQuery) {
            matchedRoutes = routes.filter((r) => {
              const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
              return text.includes(dLower);
            });
          }

          if (matchedRoutes.length === 0) {
            warning = {
              title: t('ri.warningNotFoundTitle', 'ไม่พบเส้นทางในระบบ'),
              message: `${t('ri.warningNotFoundMsg', 'ไม่พบเส้นทางวิ่งของรถโดยสารระหว่างสถานที่ที่ท่านค้นหา')} ("${originQuery || 'ทุกต้นทาง'}" ➔ "${destinationQuery || 'ทุกปลายทาง'}") ${t('ri.checkOrSelect', 'กรุณาตรวจสอบความถูกต้องของชื่อสถานที่ หรือเลือกเส้นทางจากรายการที่ให้บริการจริง')}`,
            };
            matchedRoutes = [routes[0]];
          }
        }

        setSearchWarning(warning);
        setAvailableRoutes(matchedRoutes);
        setSelectedRouteIndex(0);
      } catch (err) {
        console.error('Error fetching route:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [originQuery, destinationQuery, t]);

  // Distinct deduplicated locations array for search autocomplete (includes start, end, and intermediate via stops)
  const locationOptions = useMemo(() => {
    const locMap = new Map();
    const isEn = i18n.language === 'en';

    allDbRoutes.forEach((r) => {
      const thParts = (r.route_name_th || '').split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
      const enParts = (r.route_name_en || '').split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);

      // 1. From route names
      if (thParts.length >= 2) {
        const thOrigin = thParts[0];
        const thDest = thParts[thParts.length - 1];
        
        const candidateEnOrigin = (enParts.length >= 1 && isCleanEnglish(enParts[0])) ? enParts[0] : '';
        const candidateEnDest = (enParts.length >= 2 && isCleanEnglish(enParts[enParts.length - 1])) ? enParts[enParts.length - 1] : '';

        const enOrigin = candidateEnOrigin || stationTranslationMap[thOrigin] || '';
        const enDest = candidateEnDest || stationTranslationMap[thDest] || '';

        if (thOrigin && !locMap.has(thOrigin)) {
          locMap.set(thOrigin, { th: thOrigin, en: enOrigin });
        } else if (thOrigin && locMap.has(thOrigin)) {
          const existing = locMap.get(thOrigin);
          if (!existing.en || !isCleanEnglish(existing.en)) {
            existing.en = enOrigin;
          }
        }

        if (thDest && !locMap.has(thDest)) {
          locMap.set(thDest, { th: thDest, en: enDest });
        } else if (thDest && locMap.has(thDest)) {
          const existing = locMap.get(thDest);
          if (!existing.en || !isCleanEnglish(existing.en)) {
            existing.en = enDest;
          }
        }
      } else if (thParts.length === 1) {
        const thName = thParts[0];
        const candidateEn = (enParts.length >= 1 && isCleanEnglish(enParts[0])) ? enParts[0] : '';
        const enName = candidateEn || stationTranslationMap[thName] || '';
        if (!locMap.has(thName)) {
          locMap.set(thName, { th: thName, en: enName });
        }
      }

      // 2. From Intermediate Via Stops (จุดรับ-จอดระหว่างทาง)
      if (r.stops_via) {
        const viaParts = r.stops_via.split(/[,|;]/).map((s) => s.trim()).filter(Boolean);
        viaParts.forEach((v) => {
          if (!locMap.has(v)) {
            locMap.set(v, { th: v, en: stationTranslationMap[v] || '' });
          }
        });
      }
    });

    return Array.from(locMap.values()).map((loc) => {
      const validEn = (loc.en && isCleanEnglish(loc.en)) ? loc.en : (stationTranslationMap[loc.th] || loc.th);
      const label = isEn ? validEn : loc.th;
      const value = label;
      const searchKey = `${loc.th} ${validEn}`.toLowerCase();
      return {
        ...loc,
        label,
        value,
        searchKey,
      };
    });
  }, [allDbRoutes, i18n.language]);

  const handleSearchSubmit = (orig, dest) => {
    const origTrim = (orig || '').trim();
    const destTrim = (dest || '').trim();

    if (!origTrim && !destTrim) {
      setSearchWarning({
        title: t('ri.warningEmptyTitle', 'กรุณากรอกข้อมูลค้นหา'),
        message: t('ri.warningEmptyMsg', 'โปรดระบุต้นทางหรือปลายทางเพื่อค้นหาเส้นทาง'),
      });
      return;
    }

    if (allDbRoutes.length > 0) {
      const oLower = origTrim.toLowerCase();
      const dLower = destTrim.toLowerCase();

      let matched = [];
      if (origTrim && destTrim) {
        matched = allDbRoutes.filter((r) => {
          const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
          return text.includes(oLower) && text.includes(dLower);
        });
      } else if (origTrim) {
        matched = allDbRoutes.filter((r) => {
          const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
          return text.includes(oLower);
        });
      } else if (destTrim) {
        matched = allDbRoutes.filter((r) => {
          const text = ((r.route_name_th || '') + ' ' + (r.route_name_en || '') + ' ' + (r.stops_via || '')).toLowerCase();
          return text.includes(dLower);
        });
      }

      if (matched.length === 0) {
        setSearchWarning({
          title: t('ri.warningNotFoundTitle', 'ไม่พบเส้นทางในระบบ'),
          message: `${t('ri.warningNotFoundMsg', 'ไม่พบเส้นทางวิ่งของรถโดยสารระหว่างสถานที่ที่ท่านค้นหา')} ("${origTrim || 'ทุกต้นทาง'}" ➔ "${destTrim || 'ทุกปลายทาง'}") ${t('ri.checkOrSelect', 'กรุณาตรวจสอบความถูกต้องของชื่อสถานที่ หรือเลือกเส้นทางจากรายการที่ให้บริการจริง')}`,
        });
        return;
      }
    }

    setSearchWarning(null);
    const params = {};
    if (origTrim) params.origin = origTrim;
    if (destTrim) params.destination = destTrim;
    setSearchParams(params);
  };

  const handleSwap = () => {
    const tempO = originInput;
    const tempD = destInput;
    setOriginInput(tempD);
    setDestInput(tempO);
    handleSearchSubmit(tempD, tempO);
  };

  const handleSelectQuickRoute = (route) => {
    setSearchWarning(null);
    let o = '';
    let d = '';
    if (route.route_name_th) {
      const parts = route.route_name_th.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        o = parts[0];
        d = parts[parts.length - 1];
      }
    }
    if (!o) o = route.route_name_th || 'นครราชสีมา';
    if (!d) d = 'ปลายทาง';

    setOriginInput(o);
    setDestInput(d);
    handleSearchSubmit(o, d);
  };

  const routeData = availableRoutes[selectedRouteIndex] || null;

  // --- Derive parsed data dynamically on render ---
  let mapOrigin = '';
  let mapDestination = '';
  let mapOriginEn = '';
  let mapDestinationEn = '';
  let viaStops = [];
  let exactOrigin = null;
  let exactDest = null;

  if (routeData) {
    let routeOrigin = '';
    let routeDestination = '';

    if (routeData.route_name_th) {
      const parts = routeData.route_name_th.split(/\s*[-–—_]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        routeOrigin = parts[0];
        routeDestination = parts[parts.length - 1];
      }
    }

    if (!routeOrigin && routeData.route_name_en) {
      const parts = routeData.route_name_en.split(/\s*[-–—_]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        routeOrigin = parts[0];
        routeDestination = parts[parts.length - 1];
      }
    }

    if (!routeOrigin) routeOrigin = originQuery || routeData.route_name_th || 'Origin';
    if (!routeDestination) routeDestination = destinationQuery || 'Destination';

    if (routeData.stops_via) {
      viaStops = routeData.stops_via
        .split(/[,|;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      if (viaStops.length === 0 && routeData.stops_via.trim().length > 0) {
        viaStops = [routeData.stops_via.trim()];
      }
    }

    let oLat = routeData.origin_lat;
    let oLng = routeData.origin_lng;
    let dLat = routeData.dest_lat;
    let dLng = routeData.dest_lng;

    let enOriginProper = '';
    let enDestProper = '';

    if (routeData.route_name_en) {
      const parts = routeData.route_name_en.split(/\s*[-–—_]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        enOriginProper = parts[0];
        enDestProper = parts[parts.length - 1];
      }
    }

    if (routeOrigin && routeDestination) {
      const dbOriginLower = routeOrigin.toLowerCase();
      const dbDestLower = routeDestination.toLowerCase();
      
      const enOriginLower = enOriginProper.toLowerCase();
      const enDestLower = enDestProper.toLowerCase();

      let shouldReverse = false;
      const queryOriginLower = originQuery.toLowerCase();
      const queryDestLower = destinationQuery.toLowerCase();

      if (
        queryOriginLower && 
        (dbDestLower.includes(queryOriginLower) || (enDestLower && enDestLower.includes(queryOriginLower)))
      ) {
        shouldReverse = true;
      } else if (
        queryDestLower && 
        (dbOriginLower.includes(queryDestLower) || (enOriginLower && enOriginLower.includes(queryDestLower)))
      ) {
        shouldReverse = true;
      }

      if (shouldReverse) {
        const temp = routeOrigin;
        routeOrigin = routeDestination;
        routeDestination = temp;
        
        const tempEn = enOriginProper;
        enOriginProper = enDestProper;
        enDestProper = tempEn;

        viaStops.reverse();
        
        const tLat = oLat;
        const tLng = oLng;
        oLat = dLat;
        oLng = dLng;
        dLat = tLat;
        dLng = tLng;
      }
    }

    mapOrigin = routeOrigin;
    mapDestination = routeDestination;
    mapOriginEn = enOriginProper;
    mapDestinationEn = enDestProper;
    exactOrigin = (oLat && oLng) ? { lat: parseFloat(oLat), lng: parseFloat(oLng) } : null;
    exactDest = (dLat && dLng) ? { lat: parseFloat(dLat), lng: parseFloat(dLng) } : null;
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <MoonLoader color="#ff4d85" />
      </div>
    );
  }

  const isEn = i18n.language === 'en';
  const displayOrigin = isEn
    ? translateStation(mapOriginEn || mapOrigin || originQuery || 'Nakhon Ratchasima', true)
    : (mapOrigin || originQuery || 'นครราชสีมา');
  const displayDest = isEn
    ? translateStation(mapDestinationEn || mapDestination || destinationQuery || 'Destination', true)
    : (mapDestination || destinationQuery || 'ปลายทาง');
  const title = `${displayOrigin} - ${displayDest}`;

  // Custom details for the brackets based on user preference
  let originDetail = null;
  if (displayOrigin === 'นครราชสีมา' || mapOrigin === 'นครราชสีมา' || displayOrigin === 'Nakhon Ratchasima') {
    originDetail = isEn
      ? 'Nakhon Ratchasima Bus Terminal 1'
      : 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 1';
  }

  let destDetail = routeData?.location_source;
  if (destDetail === mapDestinationEn) destDetail = null;
  if (displayDest === 'นครราชสีมา' || mapDestination === 'นครราชสีมา' || displayDest === 'Nakhon Ratchasima') {
    destDetail = isEn
      ? 'Nakhon Ratchasima Bus Terminal 1'
      : 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 1';
  }

  // Fuzzy match for company and image columns
  let foundCompany = null;
  let foundImage = null;
  
  if (routeData) {
    const keys = Object.keys(routeData);
    
    // Find company
    const companyKey = keys.find(k => k.toLowerCase().includes('company') || k.toLowerCase().includes('บริษัท'));
    if (companyKey) foundCompany = routeData[companyKey];
    
    // Find image
    const imageKey = keys.find(k => k.toLowerCase().includes('photo') || k.toLowerCase().includes('image') || k.toLowerCase().includes('pic') || k.toLowerCase().includes('img'));
    if (imageKey) foundImage = routeData[imageKey];
  }

  const company =
    foundCompany ||
    (routeData?.vehicle_type === 'van'
      ? 'รถตู้'
      : routeData?.vehicle_type === 'minibus'
      ? 'มินิบัส'
      : 'BKS');
      
  const timeRange = routeData?.departure_time_range_raw || '–';
  
  const image =
    foundImage ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop';

  // mapStops: only the two city names for Google Maps geocoding
  const mapStops = [displayOrigin, displayDest];

  return (
    <div className="ri-layout">
      {/* Desktop Sidebar */}
      <aside className="ri-sidebar desktop-only">
        {/* Route Search System Container */}
        <RouteSearchBox
          originInput={originInput}
          setOriginInput={setOriginInput}
          destInput={destInput}
          setDestInput={setDestInput}
          locationOptions={locationOptions}
          allDbRoutes={allDbRoutes}
          onSearch={handleSearchSubmit}
          onSwap={handleSwap}
          onSelectQuickRoute={handleSelectQuickRoute}
          searchWarning={searchWarning}
          onClearWarning={() => setSearchWarning(null)}
        />

        <StepperContent
          origin={displayOrigin}
          originDetail={originDetail}
          destination={displayDest}
          destinationDetail={destDetail}
          viaStops={viaStops}
        />
      </aside>

      {/* Main Content */}
      <main className="ri-main">
        {/* Map Area */}
        <div className="ri-map-area">
          <RideMap mapStops={mapStops} exactOrigin={exactOrigin} exactDest={exactDest} />

          {/* Mobile Floating Search Banner (Collapsed by default, Expandable on tap) */}
          <div className="mobile-only ri-mobile-search-banner">
            {!isMobileSearchExpanded ? (
              <div
                className="ri-compact-search-bar"
                onClick={() => setIsMobileSearchExpanded(true)}
              >
                <div className="ri-compact-search-info">
                  <FiSearch style={{ color: '#ff4d85', flexShrink: 0 }} size={15} />
                  <span className="ri-compact-from">{originInput || t('ri.from', 'ต้นทาง')}</span>
                  <FiArrowRight style={{ color: '#94a3b8', flexShrink: 0 }} size={12} />
                  <span className="ri-compact-to">{destInput || t('ri.to', 'ปลายทาง')}</span>
                </div>
                <div className="ri-compact-expand-btn">
                  <span>{t('ri.searchBtn', 'ค้นหา')}</span>
                  <FiChevronDown size={14} />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="ri-expanded-header-bar">
                  <span className="ri-expanded-title">
                    {t('ri.pageTitle', 'ค้นหาเส้นทาง')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileSearchExpanded(false)}
                    className="ri-collapse-btn"
                  >
                    <span>ซ่อน</span>
                    <FiChevronUp size={14} />
                  </button>
                </div>
                <RouteSearchBox
                  originInput={originInput}
                  setOriginInput={setOriginInput}
                  destInput={destInput}
                  setDestInput={setDestInput}
                  locationOptions={locationOptions}
                  allDbRoutes={allDbRoutes}
                  onSearch={(orig, dest) => {
                    handleSearchSubmit(orig, dest);
                    setIsMobileSearchExpanded(false);
                  }}
                  onSwap={handleSwap}
                  onSelectQuickRoute={(route) => {
                    handleSelectQuickRoute(route);
                    setIsMobileSearchExpanded(false);
                  }}
                  searchWarning={searchWarning}
                  onClearWarning={() => setSearchWarning(null)}
                />
              </div>
            )}
          </div>

          {/* Info Card (Collapsible on Mobile via Swipe Up/Down or Arrow Click) */}
          <div
            className={`ri-info-card ${isMobileInfoCollapsed ? 'collapsed' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Mobile Drag/Swipe Handle & Toggle Arrow */}
            <div
              className="ri-card-handle-bar mobile-only"
              onClick={() => setIsMobileInfoCollapsed(!isMobileInfoCollapsed)}
            >
              <div className="ri-drag-pill" />
              <button
                type="button"
                className="ri-card-toggle-btn"
                aria-label={isMobileInfoCollapsed ? 'แสดงข้อมูล' : 'ซ่อนข้อมูล'}
              >
                <span>{isMobileInfoCollapsed ? t('ri.showInfo', 'แสดงข้อมูล') : t('ri.hideInfo', 'ซ่อนข้อมูล')}</span>
                {isMobileInfoCollapsed ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
            </div>

            {/* Collapsed Mobile Mini View */}
            {isMobileInfoCollapsed ? (
              <div
                className="ri-card-collapsed-content mobile-only"
                onClick={() => setIsMobileInfoCollapsed(false)}
              >
                <span className="ri-badge">{company}</span>
                <span className="ri-collapsed-title">{title}</span>
                <div className="ri-card-time" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  <FiClock size={14} color="#4da6ff" />
                  <span style={{ color: 'white', fontSize: '12px' }}>{timeRange}</span>
                </div>
              </div>
            ) : null}

            {/* Main Card Body */}
            <div className={`ri-card-body ${isMobileInfoCollapsed ? 'hidden-on-mobile' : ''}`}>
              <div className="ri-card-content">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <span className="ri-badge">{company}</span>
              </div>
              <h2 className="ri-card-title">{title}</h2>

              {/* Company Selection Vertical Scroll Container */}
              {availableRoutes.length > 1 && (
                <div className="ri-company-list">
                  {availableRoutes.map((r, idx) => {
                    const keys = Object.keys(r);
                    const cKey = keys.find(k => k.toLowerCase().includes('company') || k.toLowerCase().includes('บริษัท'));
                    const cName = (cKey ? r[cKey] : null) || (r.vehicle_type === 'van' ? 'รถตู้' : r.vehicle_type === 'minibus' ? 'มินิบัส' : 'BKS');
                    const isActive = idx === selectedRouteIndex;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedRouteIndex(idx)}
                        className={`ri-company-btn ${isActive ? 'active' : ''}`}
                      >
                        <span className="ri-company-name">{cName}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="ri-card-divider mobile-only"></div>

              <div className="ri-card-time" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                <FiClock size={16} color="#4da6ff" />
                <span style={{ color: 'white' }}>{timeRange}</span>
              </div>
            </div>

            <div className="ri-card-bus">
              <img src={image} alt="Bus" />
            </div>
          </div>
        </div>
      </div>

        {/* Mobile Stepper */}
        <div className="ri-stepper-mobile mobile-only">
          <StepperContent
            origin={displayOrigin}
            originDetail={originDetail}
            destination={displayDest}
            destinationDetail={destDetail}
            viaStops={viaStops}
          />
        </div>
      </main>
    </div>
  );
};

export default RouteInformation;

