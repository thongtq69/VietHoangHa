import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, MapPin, BedDouble, Bath, Square, ChevronRight, ChevronLeft, Phone, Home, Building, Star, CheckCircle, Menu, X, TrendingUp, Users, Award, Image as ImageIcon, Newspaper, BookOpen, BarChart3, Calendar, ExternalLink } from 'lucide-react';
import allProperties from './data.json';

// Data is already sorted newest-first (ID 1 = most recent Facebook post)

const ITEMS_PER_PAGE = 12;

const NEWS_TABS = [
  { key: 'tin-tuc', label: 'Tin tức', icon: Newspaper },
  { key: 'wiki', label: 'Wiki BĐS', icon: BookOpen },
  { key: 'phan-tich', label: 'Phân tích đánh giá', icon: BarChart3 },
];

export default function App() {
  const [activeDistrict, setActiveDistrict] = useState('All');
  const [activeWard, setActiveWard] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeNewsTab, setActiveNewsTab] = useState('tin-tuc');
  const [newsData, setNewsData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetch('/news.json')
      .then(res => { if (!res.ok) throw new Error('not found'); return res.json(); })
      .then(data => setNewsData(Array.isArray(data) ? data : data?.articles || []))
      .catch(() => setNewsData([]));
  }, []);

  const filteredNews = useMemo(() => {
    if (!newsData || newsData.length === 0) return [];
    return newsData
      .filter(article => article.category === activeNewsTab)
      .slice(0, 6);
  }, [activeNewsTab, newsData]);

  const districts = useMemo(() => {
    const counts = {};
    allProperties.forEach(p => { counts[p.district] = (counts[p.district] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const wards = useMemo(() => {
    if (activeDistrict === 'All') return [];
    const counts = {};
    allProperties
      .filter(p => p.district === activeDistrict && p.ward)
      .forEach(p => { counts[p.ward] = (counts[p.ward] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [activeDistrict]);

  const PRICE_RANGES = [
    { label: 'Tất cả giá', value: 'All' },
    { label: '3 - 5 Tỷ', value: '3-5', min: 3, max: 5 },
    { label: '5 - 8 Tỷ', value: '5-8', min: 5, max: 8 },
    { label: '8 - 12 Tỷ', value: '8-12', min: 8, max: 12 },
    { label: 'Trên 12 Tỷ', value: '12+', min: 12, max: 999 },
  ];

  const filteredProperties = useMemo(() => {
    let result = allProperties;
    if (activeDistrict !== 'All') {
      result = result.filter(p => p.district === activeDistrict);
    }
    if (activeWard !== 'All') {
      result = result.filter(p => p.ward === activeWard);
    }
    if (priceRange !== 'All') {
      const range = PRICE_RANGES.find(r => r.value === priceRange);
      if (range) {
        result = result.filter(p => p.priceNum >= range.min && p.priceNum < range.max);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        (p.ward || '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.price.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeDistrict, activeWard, priceRange, searchQuery]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDistrictChange = (district) => {
    setActiveDistrict(district);
    setActiveWard('All');
    setPriceRange('All');
    setCurrentPage(1);
  };

  const handleWardChange = (ward) => {
    setActiveWard(ward);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setActiveWard('All');
    setPriceRange('All');
    setCurrentPage(1);
  };

  const handleImgError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const fallbackImg = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';

  const scrollToProperties = () => {
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openArticle = useCallback((article) => {
    if (article.content) {
      setSelectedArticle(article);
      document.body.style.overflow = 'hidden';
    } else if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const closeArticle = useCallback(() => {
    setSelectedArticle(null);
    document.body.style.overflow = '';
  }, []);

  const openGallery = useCallback((property) => {
    setSelectedProperty(property);
    setGalleryIndex(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeGallery = useCallback(() => {
    setSelectedProperty(null);
    setGalleryIndex(0);
    document.body.style.overflow = '';
  }, []);

  const galleryPrev = useCallback(() => {
    if (!selectedProperty) return;
    setGalleryIndex(i => (i - 1 + selectedProperty.images.length) % selectedProperty.images.length);
  }, [selectedProperty]);

  const galleryNext = useCallback(() => {
    if (!selectedProperty) return;
    setGalleryIndex(i => (i + 1) % selectedProperty.images.length);
  }, [selectedProperty]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedArticle) { closeArticle(); return; }
        if (selectedProperty) { closeGallery(); return; }
      }
      if (!selectedProperty) return;
      if (e.key === 'ArrowLeft') galleryPrev();
      if (e.key === 'ArrowRight') galleryNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedProperty, selectedArticle, closeGallery, closeArticle, galleryPrev, galleryNext]);

  return (
    <div className="min-h-screen font-body bg-secondary-50 select-none">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card px-4 md:px-6 py-3 md:py-4 flex justify-between items-center rounded-none border-t-0 border-x-0 !shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
            <Home className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-secondary-900 tracking-tight">Việt Hoàng Hà<span className="text-primary-600">.</span></h1>
        </div>
        <div className="hidden md:flex gap-8 text-secondary-800 font-medium tracking-wide">
          <a href="#properties" className="hover:text-primary-600 transition-colors duration-200">Mua Bán</a>
          <a href="#news" className="hover:text-primary-600 transition-colors duration-200">Tin Tức</a>
          <a href="#why-us" className="hover:text-primary-600 transition-colors duration-200">Giới Thiệu</a>
          <a href="https://www.facebook.com/viet.hoang.ha.482723" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors duration-200">Facebook</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="bg-primary-600 hover:bg-primary-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium transition-all shadow-md shadow-primary-600/30 flex items-center gap-2 cursor-pointer text-sm md:text-base">
            <img src="https://cdn.simpleicons.org/zalo/white" alt="Zalo" width="18" height="18" />
            <span className="hidden sm:inline">0909.222.596</span>
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'} className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-secondary-800 cursor-pointer">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium text-secondary-900">
            <a href="#properties" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-secondary-50">Mua Bán Nhà Đất</a>
            <a href="#news" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-secondary-50">Tin Tức BĐS</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-secondary-50">Giới Thiệu</a>
            <a href="https://www.facebook.com/viet.hoang.ha.482723" target="_blank" rel="noopener noreferrer" className="py-3 border-b border-secondary-50">Facebook</a>
            <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="py-3 text-primary-600 font-bold">Zalo: 0909.222.596</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden mb-8 md:mb-12 border border-secondary-50/50 p-1.5 md:p-2">
          <img src="/banner.jpg" alt="Việt Hoàng Hà Bất Động Sản - Chuyên Mua Bán Nhà Đất Gò Vấp, Tân Bình, Q.12" className="w-full h-auto object-contain rounded-xl md:rounded-2xl" />
        </div>

        {/* Search Bar */}
        <div className="glass-card w-full max-w-3xl p-2.5 md:p-3 flex flex-col md:flex-row gap-2.5 md:gap-3 rounded-2xl md:rounded-full">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl md:rounded-full">
            <Search className="text-secondary-800 opacity-60 w-5 h-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm theo đường, quận, giá... (vd: Quang Trung, 5 tỷ)"
              className="bg-transparent border-none outline-none w-full text-secondary-900 placeholder:text-secondary-800/50 font-medium"
            />
          </div>
          <button onClick={scrollToProperties} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 md:py-3 rounded-xl md:rounded-full font-semibold transition-all shadow-md cursor-pointer whitespace-nowrap">
            Tìm Kiếm
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-6 md:py-10 max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { icon: Building, num: `${allProperties.length}+`, label: 'Bất Động Sản' },
            { icon: Award, num: '10+', label: 'Năm Kinh Nghiệm' },
            { icon: Users, num: '1,500+', label: 'Khách Hàng' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm border border-secondary-50">
              <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-xl md:text-3xl font-heading font-bold text-secondary-900">{stat.num}</div>
              <div className="text-xs md:text-sm text-secondary-800/60 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters (Districts) */}
      <section className="py-6 md:py-8 max-w-7xl mx-auto px-4 md:px-6" id="properties">
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-4 mb-2">
          <button
            onClick={() => handleDistrictChange('All')}
            className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full font-medium transition-all cursor-pointer text-sm md:text-base ${
              activeDistrict === 'All'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'bg-white text-secondary-800 hover:bg-primary-50 border border-secondary-50/50'
            }`}
          >
            Tất cả ({allProperties.length})
          </button>
          {districts.map(([district, count]) => (
            <button
              key={district}
              onClick={() => handleDistrictChange(district)}
              className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full font-medium transition-all cursor-pointer text-sm md:text-base ${
                activeDistrict === district
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'bg-white text-secondary-800 hover:bg-primary-50 border border-secondary-50/50'
              }`}
            >
              {district} ({count})
            </button>
          ))}
        </div>

        {/* Ward Filter — only shown when a specific district is selected and has wards */}
        {wards.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5 mt-3 md:mt-4">
            <button
              onClick={() => handleWardChange('All')}
              className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer text-xs md:text-sm ${
                activeWard === 'All'
                  ? 'bg-secondary-800 text-white shadow-sm'
                  : 'bg-secondary-50 text-secondary-800 hover:bg-secondary-100 border border-secondary-100'
              }`}
            >
              Tất cả phường
            </button>
            {wards.map(([ward, count]) => (
              <button
                key={ward}
                onClick={() => handleWardChange(ward)}
                className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer text-xs md:text-sm ${
                  activeWard === ward
                    ? 'bg-secondary-800 text-white shadow-sm'
                    : 'bg-secondary-50 text-secondary-800 hover:bg-secondary-100 border border-secondary-100'
                }`}
              >
                {ward} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Price Range Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5 mt-3 md:mt-4">
          {PRICE_RANGES.map(range => (
            <button
              key={range.value}
              onClick={() => handlePriceChange(range.value)}
              className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer text-xs md:text-sm ${
                priceRange === range.value
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-white text-secondary-800 hover:bg-accent-500/10 border border-accent-500/20'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-6 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 gap-3">
          <div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 mb-1 md:mb-2">
              {activeDistrict === 'All' ? 'Tất Cả Bất Động Sản' : activeWard !== 'All' ? `BĐS ${activeWard}, ${activeDistrict}` : `BĐS ${activeDistrict}`}
            </h3>
            <p className="text-secondary-800 opacity-70 font-medium text-sm md:text-base">
              Hiển thị {paginatedProperties.length} trong {filteredProperties.length} bất động sản
              {searchQuery && ` cho "${searchQuery}"`}
            </p>
          </div>
        </div>

        {paginatedProperties.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-secondary-800/30 mx-auto mb-4" />
            <p className="text-secondary-800/60 font-medium text-lg">Không tìm thấy BĐS phù hợp.</p>
            <button onClick={() => { setSearchQuery(''); setActiveDistrict('All'); setActiveWard('All'); setPriceRange('All'); }} className="mt-4 text-primary-600 font-semibold cursor-pointer">Xem tất cả</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {paginatedProperties.map(property => (
              <div key={property.id} className="bg-white rounded-2xl md:rounded-[1.5rem] overflow-hidden group hover:shadow-premium transition-all duration-300 border border-secondary-50">
                <div className="relative h-52 md:h-64 overflow-hidden bg-secondary-50 cursor-pointer" onClick={() => openGallery(property)}>
                  <img
                    src={imgErrors[property.id] ? fallbackImg : property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={() => handleImgError(property.id)}
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-1.5 md:gap-2 flex-wrap">
                    {property.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-white/90 backdrop-blur text-secondary-900 text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-primary-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-bold text-base md:text-lg shadow-lg">
                    {property.price}
                  </div>
                  {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {property.images.length}
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-1.5 text-secondary-800/70 mb-2 md:mb-3 text-xs md:text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600 shrink-0" />
                    <span>{property.ward && property.ward !== property.district ? `${property.ward}, ${property.district}` : `${property.district}, TP.HCM`}</span>
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-secondary-900 mb-4 md:mb-5 leading-snug line-clamp-2 min-h-[2.5rem] md:min-h-[3.25rem]">
                    {property.title}
                  </h4>

                  <div className="grid grid-cols-3 gap-3 md:gap-4 py-3 md:py-4 border-t border-b border-secondary-50/80 mb-4 md:mb-5">
                    {property.beds > 0 && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 text-secondary-900 mb-0.5">
                          <BedDouble className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600/80" />
                          <span className="font-bold text-sm md:text-base">{property.beds}</span>
                        </div>
                        <span className="text-[10px] md:text-xs text-secondary-800/60 font-medium">PN</span>
                      </div>
                    )}
                    {property.baths > 0 && (
                      <div className="flex flex-col items-center justify-center border-x border-secondary-50/80">
                        <div className="flex items-center gap-1.5 text-secondary-900 mb-0.5">
                          <Bath className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600/80" />
                          <span className="font-bold text-sm md:text-base">{property.baths}</span>
                        </div>
                        <span className="text-[10px] md:text-xs text-secondary-800/60 font-medium">WC</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 text-secondary-900 mb-0.5">
                          <Square className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600/80" />
                          <span className="font-bold text-xs md:text-sm">{property.area}</span>
                        </div>
                        <span className="text-[10px] md:text-xs text-secondary-800/60 font-medium">DT</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={property.post_url || `https://zalo.me/0909222596`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-secondary-50 hover:bg-secondary-800 hover:text-white text-secondary-900 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Xem chi tiết
                    </a>
                    <a
                      href="https://zalo.me/0909222596"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer text-sm"
                    >
                      <img src="https://cdn.simpleicons.org/zalo/white" alt="Zalo" width="16" height="16" />
                      Zalo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 md:mt-14">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Trang trước"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white border border-secondary-50 hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); scrollToProperties(); }}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-xl font-semibold transition-all cursor-pointer text-sm md:text-base ${
                    currentPage === page
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : 'bg-white text-secondary-800 border border-secondary-50 hover:bg-primary-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Trang sau"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white border border-secondary-50 hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {/* News & Analysis Section */}
      {newsData.length > 0 && (
        <section id="news" className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 mb-2 md:mb-3">
              Tin Tức & Phân Tích BĐS
            </h2>
            <p className="text-secondary-800/60 font-medium text-sm md:text-base max-w-2xl mx-auto">
              Cập nhật thông tin thị trường, kiến thức bất động sản và phân tích chuyên sâu
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-8 md:mb-10">
            {NEWS_TABS.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveNewsTab(tab.key)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-medium transition-all duration-200 cursor-pointer text-sm md:text-base min-h-[44px] ${
                    activeNewsTab === tab.key
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : 'bg-white text-secondary-800 hover:bg-primary-50 border border-secondary-100'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredNews.map((article, idx) => (
                <div
                  key={article.url || idx}
                  onClick={() => openArticle(article)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArticle(article); } }}
                  className="group bg-white rounded-2xl overflow-hidden border border-secondary-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 md:h-48 overflow-hidden bg-secondary-50">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-50">
                        <Newspaper className="w-12 h-12 text-primary-600/30" />
                      </div>
                    )}
                    {/* Category Badge */}
                    {article.categoryLabel && (
                      <span className="absolute top-3 left-3 bg-primary-600 text-white text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {article.categoryLabel}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <h4 className="text-base md:text-[17px] font-bold text-secondary-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="text-secondary-800/60 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary-50">
                      {article.date && (
                        <div className="flex items-center gap-1.5 text-secondary-800/50 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.date}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-primary-600 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                        <span>{article.content ? 'Đọc bài viết' : 'Đọc thêm'}</span>
                        {article.content ? <ChevronRight className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-secondary-100">
              <Newspaper className="w-10 h-10 text-secondary-800/20 mx-auto mb-3" />
              <p className="text-secondary-800/50 font-medium">Chua co bai viet nao trong muc nay.</p>
            </div>
          )}
        </section>
      )}

      {/* Why Choose Us */}
      <section id="why-us" className="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto my-8 md:my-12 bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-secondary-50">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="px-4 md:px-8">
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4 md:mb-6 leading-tight">Tại sao chọn Việt Hoàng Hà?</h3>
            <p className="text-secondary-800 opacity-80 mb-6 md:mb-8 font-medium leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực bất động sản tại TP.HCM, chúng tôi cam kết mang lại những giá trị thực nhất cho khách hàng.
            </p>
            <div className="space-y-3 md:space-y-4">
              {[
                'Pháp lý minh bạch, rõ ràng 100%',
                'Hỗ trợ vay vốn ngân hàng đến 70%',
                'Thẩm định giá chuẩn xác thị trường',
                'Hỗ trợ thủ tục công chứng, sang tên'
              ].map((reason, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-600 shrink-0" />
                  <span className="font-semibold text-secondary-900 text-sm md:text-base">{reason}</span>
                </div>
              ))}
            </div>
            <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="inline-block mt-8 md:mt-10 bg-secondary-900 hover:bg-secondary-800 text-white px-7 md:px-8 py-3 md:py-3.5 rounded-full font-semibold transition-all cursor-pointer text-sm md:text-base">
              Liên Hệ Tư Vấn
            </a>
          </div>
          <div className="relative px-4 md:px-0">
            <div className="absolute inset-0 bg-primary-600 rounded-2xl md:rounded-[2rem] translate-x-3 md:translate-x-4 translate-y-3 md:translate-y-4 opacity-10"></div>
            <img
              src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Đội ngũ BĐS Việt Hoàng Hà"
              className="relative z-10 w-full rounded-2xl md:rounded-[2rem] object-cover h-72 md:h-96 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto" onClick={closeArticle}>
          <div
            className="relative w-full max-w-[800px] bg-white min-h-screen md:min-h-0 md:my-8 md:rounded-2xl md:shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'articleSlideUp 0.3s ease-out' }}
          >
            {/* Article Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-secondary-100 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                {selectedArticle.categoryLabel && (
                  <span className="shrink-0 bg-primary-600 text-white text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full">
                    {selectedArticle.categoryLabel}
                  </span>
                )}
                {selectedArticle.date && (
                  <span className="text-secondary-800/50 text-xs md:text-sm font-medium flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedArticle.date}
                  </span>
                )}
              </div>
              <button
                onClick={closeArticle}
                aria-label="Đóng bài viết"
                className="shrink-0 bg-secondary-100 hover:bg-secondary-200 text-secondary-800 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Body */}
            <div className="px-4 md:px-8 py-6 md:py-8">
              {/* Title */}
              <h1 className="font-heading font-bold text-xl md:text-2xl lg:text-[28px] text-secondary-900 leading-tight mb-5 md:mb-6">
                {selectedArticle.title}
              </h1>

              {/* Featured Image */}
              {selectedArticle.image && (
                <div className="mb-6 md:mb-8 -mx-4 md:mx-0">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-auto object-cover md:rounded-xl"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="max-w-[650px] mx-auto">
                {selectedArticle.content && (
                  <div className="text-secondary-800 text-base md:text-[17px] leading-[1.8] whitespace-pre-line font-body">
                    {(() => {
                      const contentImages = selectedArticle.contentImages || [];
                      if (contentImages.length === 0) {
                        return selectedArticle.content;
                      }
                      const paragraphs = selectedArticle.content.split('\n\n');
                      const imageInterval = Math.max(1, Math.floor(paragraphs.length / (contentImages.length + 1)));
                      let imageIdx = 0;
                      return paragraphs.map((para, i) => {
                        const showImage = imageIdx < contentImages.length && (i + 1) % imageInterval === 0 && i > 0;
                        const currentImageIdx = showImage ? imageIdx++ : -1;
                        return (
                          <React.Fragment key={i}>
                            <p className="mb-4 md:mb-5">{para}</p>
                            {showImage && contentImages[currentImageIdx] && (
                              <figure className="my-5 md:my-7 -mx-4 md:mx-0">
                                <img
                                  src={contentImages[currentImageIdx].url || contentImages[currentImageIdx]}
                                  alt={contentImages[currentImageIdx].caption || ''}
                                  className="w-full h-auto object-cover md:rounded-lg"
                                  loading="lazy"
                                />
                                {contentImages[currentImageIdx].caption && (
                                  <figcaption className="text-secondary-800/50 text-xs md:text-sm text-center mt-2 px-4 italic">
                                    {contentImages[currentImageIdx].caption}
                                  </figcaption>
                                )}
                              </figure>
                            )}
                          </React.Fragment>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Article Footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-secondary-100 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
              {selectedArticle.url && (
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Xem bài gốc</span>
                </a>
              )}
              <button
                onClick={closeArticle}
                className="ml-auto bg-secondary-100 hover:bg-secondary-200 text-secondary-800 font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal — fullscreen overlay */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[100] bg-black/90" onClick={closeGallery}>
          {/* Close button — always visible */}
          <button onClick={closeGallery} aria-label="Đóng gallery" className="absolute top-3 right-3 md:top-5 md:right-5 z-20 bg-white/15 hover:bg-white/30 text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Main image area — centered, respects aspect ratio */}
          <div className="absolute inset-0 bottom-auto flex items-center justify-center" style={{ height: 'calc(100vh - 180px)' }} onClick={e => e.stopPropagation()}>
            <img
              src={selectedProperty.images?.[galleryIndex] || selectedProperty.image}
              alt={`${selectedProperty.title} - Ảnh ${galleryIndex + 1}`}
              className="max-w-full max-h-full object-contain p-2 md:p-4"
            />
            {/* Nav arrows */}
            {selectedProperty.images && selectedProperty.images.length > 1 && (
              <>
                <button onClick={galleryPrev} aria-label="Anh truoc" className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 active:scale-95 text-white p-2.5 md:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer">
                  <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
                </button>
                <button onClick={galleryNext} aria-label="Anh tiep theo" className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 active:scale-95 text-white p-2.5 md:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer">
                  <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
                </button>
              </>
            )}
            {/* Counter */}
            {selectedProperty.images && selectedProperty.images.length > 1 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 text-white/90 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium">
                {galleryIndex + 1} / {selectedProperty.images.length}
              </div>
            )}
          </div>

          {/* Bottom panel — thumbnails + info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8" onClick={e => e.stopPropagation()}>
            {/* Thumbnails */}
            {selectedProperty.images && selectedProperty.images.length > 1 && (
              <div className="flex gap-1.5 md:gap-2 px-3 md:px-6 pb-3 overflow-x-auto justify-center">
                {selectedProperty.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIndex(idx)}
                    className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      idx === galleryIndex ? 'border-primary-600 scale-110' : 'border-white/20 opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Property quick info */}
            <div className="flex items-center justify-between gap-3 px-3 md:px-6 pb-4 md:pb-5 pt-2">
              <div className="min-w-0">
                <h3 className="text-white font-heading font-bold text-sm md:text-lg truncate">{selectedProperty.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-primary-600 font-bold text-sm md:text-base">{selectedProperty.price}</span>
                  {selectedProperty.ward && selectedProperty.ward !== selectedProperty.district && (
                    <span className="text-white/50 text-xs md:text-sm">{selectedProperty.ward}, {selectedProperty.district}</span>
                  )}
                  {selectedProperty.beds > 0 && <span className="text-white/50 text-xs md:text-sm">{selectedProperty.beds}PN</span>}
                  {selectedProperty.baths > 0 && <span className="text-white/50 text-xs md:text-sm">{selectedProperty.baths}WC</span>}
                  {selectedProperty.area && selectedProperty.area !== 'Liên hệ' && <span className="text-white/50 text-xs md:text-sm">{selectedProperty.area}</span>}
                </div>
              </div>
              <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 md:px-5 py-2.5 rounded-full transition-all cursor-pointer text-xs md:text-sm">
                <img src="https://cdn.simpleicons.org/zalo/white" alt="Zalo" width="16" height="16" />
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Việt Hoàng Hà<span className="text-primary-600">.</span></h2>
            <p className="text-secondary-50/70 max-w-sm mb-4 md:mb-6 font-medium leading-relaxed text-sm md:text-base">
              Trang thông tin mua bán bất động sản uy tín nhất tại khu vực Gò Vấp, Quận 12, và Tân Bình.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 md:mb-4 text-white">Chuyên Mục</h4>
            <ul className="space-y-2 md:space-y-3 font-medium text-secondary-50/70 text-sm md:text-base">
              <li><button onClick={() => { handleDistrictChange('Gò Vấp'); scrollToProperties(); }} className="hover:text-primary-600 transition-colors cursor-pointer">Nhà Bán Gò Vấp</button></li>
              <li><button onClick={() => { handleDistrictChange('Tân Bình'); scrollToProperties(); }} className="hover:text-primary-600 transition-colors cursor-pointer">Nhà Bán Tân Bình</button></li>
              <li><a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Ký Gửi Nhà Đất</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 md:mb-4 text-white">Liên Hệ</h4>
            <ul className="space-y-2 md:space-y-3 font-medium text-secondary-50/70 text-sm md:text-base">
              <li>Hotline / Zalo: <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors font-bold text-white">0909 222 596</a></li>
              <li>Email: contact@viethoangha.com</li>
              <li>TP. Hồ Chí Minh</li>
              <li className="flex gap-3 pt-2 md:pt-3">
                <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="w-11 h-11 bg-white/10 rounded-full hover:bg-primary-600 hover:-translate-y-1 active:scale-95 transition-all duration-200 text-white flex items-center justify-center">
                  <img src="https://cdn.simpleicons.org/zalo/white" alt="Zalo" width="20" height="20" />
                </a>
                <a href="https://www.facebook.com/viet.hoang.ha.482723" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 bg-white/10 rounded-full hover:bg-primary-600 hover:-translate-y-1 active:scale-95 transition-all duration-200 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://www.youtube.com/channel/UCLLhYG3k9y225mWCQEpbKiw" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-11 h-11 bg-white/10 rounded-full hover:bg-primary-600 hover:-translate-y-1 active:scale-95 transition-all duration-200 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/10 text-center text-secondary-50/50 font-medium text-xs md:text-sm">
          &copy; 2026 Việt Hoàng Hà Real Estate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
