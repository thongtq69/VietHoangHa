import React, { useState } from 'react';
import { Search, MapPin, BedDouble, Bath, Square, ChevronRight, Phone, Home, Building, Star, CheckCircle, Facebook, Youtube } from 'lucide-react';
import realEstateData from './data.json';

const fakeProperties = [
  {
    id: 1,
    title: 'Biệt Thự Vườn Khu Biệt Thự Làng Hoa',
    district: 'Gò Vấp',
    price: '18.5 Tỷ',
    area: '120m²',
    beds: 4,
    baths: 4,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    tags: ['Sổ hồng', 'Mới'],
    link: realEstateData[0]?.link || '#'
  },
  {
    id: 2,
    title: 'Nhà Phố Thương Mại Lê Văn Khương',
    district: 'Quận 12',
    price: '6.2 Tỷ',
    area: '80m²',
    beds: 3,
    baths: 3,
    image: 'https://images.unsplash.com/photo-1600607687931-cecebd802404?auto=format&fit=crop&w=800&q=80',
    tags: ['Sổ Riêng', 'Kinh Doanh'],
    link: realEstateData[1]?.link || '#'
  },
  {
    id: 3,
    title: 'Căn Hộ Cao Cấp Khu K300',
    district: 'Tân Bình',
    price: '9.8 Tỷ',
    area: '95m²',
    beds: 3,
    baths: 2,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    tags: ['Nội thất cao cấp'],
    link: realEstateData[2]?.link || '#'
  },
  {
    id: 4,
    title: 'Nhà Hẻm Xe Hơi Quang Trung',
    district: 'Gò Vấp',
    price: '7.5 Tỷ',
    area: '65m²',
    beds: 4,
    baths: 4,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tags: ['Đang trống', 'Mới Xây'],
    link: realEstateData[3]?.link || '#'
  },
  {
    id: 5,
    title: 'Mặt Tiền Đường Nguyễn Ảnh Thủ',
    district: 'Quận 12',
    price: '12.5 Tỷ',
    area: '100m²',
    beds: 5,
    baths: 5,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    tags: ['Sinh lời ngay', 'Sổ hồng'],
    link: realEstateData[4]?.link || '#'
  },
  {
    id: 6,
    title: 'Nhà Vườn Sân Thương Hoàng Hoa Thám',
    district: 'Tân Bình',
    price: '15.2 Tỷ',
    area: '110m²',
    beds: 3,
    baths: 3,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
    tags: ['View đẹp', 'Sổ hồng'],
    link: realEstateData[5]?.link || '#'
  }
];

export default function App() {
  const [activeDistrict, setActiveDistrict] = useState('All');

  const filteredProperties = activeDistrict === 'All' 
    ? fakeProperties 
    : fakeProperties.filter(p => p.district === activeDistrict);

  return (
    <div className="min-h-screen font-body bg-secondary-50 select-none">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 flex justify-between items-center rounded-none border-t-0 border-x-0 !shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-secondary-900 tracking-tight">Việt Hoàng Hà<span className="text-primary-600">.</span></h1>
        </div>
        <div className="hidden md:flex gap-8 text-secondary-800 font-medium tracking-wide">
          <a href="#" className="hover:text-primary-600 transition-colors">Mua Bán</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Cho Thuê</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Dự Án</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Thẩm Định Mật Độ</a>
        </div>
        <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md shadow-primary-600/30 flex items-center gap-2 cursor-pointer">
          <Phone className="w-4 h-4" />
          <span>0909.222.596</span>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden mb-12 border border-secondary-50/50 p-2">
          <img src="/banner.jpg" alt="Việt Hoàng Hà Bất Động Sản - Chuyên Mua Bán Nhà Đất Gò Vấp - Q.12" className="w-full h-auto object-contain rounded-2xl" />
        </div>

        {/* Search Bar */}
        <div className="glass-card w-full max-w-3xl p-3 flex flex-col md:flex-row gap-3 rounded-2xl md:rounded-full">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl md:rounded-full">
            <Search className="text-secondary-800 opacity-60 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nhập khu vực, tên dự án..." 
              className="bg-transparent border-none outline-none w-full text-secondary-900 placeholder:text-secondary-800/50 font-medium"
            />
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 md:py-3 rounded-xl md:rounded-full font-semibold transition-all shadow-md cursor-pointer whitespace-nowrap">
            Tìm Kiếm
          </button>
        </div>
      </section>

      {/* Filters (Districts) */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          {['All', 'Gò Vấp', 'Quận 12', 'Tân Bình'].map(district => (
            <button 
              key={district}
              onClick={() => setActiveDistrict(district)}
              className={`px-6 py-3 rounded-full font-medium transition-all cursor-pointer ${
                activeDistrict === district 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30' 
                  : 'bg-white text-secondary-800 hover:bg-primary-50 border border-secondary-50/50'
              }`}
            >
              {district === 'All' ? 'Tất cả khu vực' : district}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-heading font-bold text-secondary-900 mb-2">Bất Động Sản Nổi Bật</h3>
            <p className="text-secondary-800 opacity-70 font-medium">Khám phá các căn nhà đang được săn đón nhất tuần này.</p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors group cursor-pointer">
            Xem tất cả <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-[1.5rem] overflow-hidden group hover:shadow-premium transition-all duration-300 border border-secondary-50">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {property.tags.map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur text-secondary-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                  {property.price}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-secondary-800/70 mb-3 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>{property.district}, TP. Hồ Chí Minh</span>
                </div>
                <h4 className="text-xl font-bold text-secondary-900 mb-5 leading-snug line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
                  {property.title}
                </h4>
                
                <div className="grid grid-cols-3 gap-4 py-5 border-t border-b border-secondary-50/80 mb-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-secondary-900 mb-1">
                      <BedDouble className="w-4 h-4 text-primary-600/80" />
                      <span className="font-bold">{property.beds}</span>
                    </div>
                    <span className="text-xs text-secondary-800/60 font-medium uppercase tracking-wider">Phòng ngủ</span>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-r border-secondary-50/80">
                    <div className="flex items-center gap-2 text-secondary-900 mb-1">
                      <Bath className="w-4 h-4 text-primary-600/80" />
                      <span className="font-bold">{property.baths}</span>
                    </div>
                    <span className="text-xs text-secondary-800/60 font-medium uppercase tracking-wider">Phòng tắm</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-secondary-900 mb-1">
                      <Square className="w-4 h-4 text-primary-600/80" />
                      <span className="font-bold">{property.area}</span>
                    </div>
                    <span className="text-xs text-secondary-800/60 font-medium uppercase tracking-wider">Diện tích</span>
                  </div>
                </div>

                <a 
                  href={property.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full flex items-center justify-center gap-2 bg-secondary-50 hover:bg-secondary-800 hover:text-white text-secondary-900 font-semibold py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Xem tin gốc
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 max-w-7xl mx-auto my-12 bg-white rounded-[2rem] shadow-sm border border-secondary-50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-heading font-bold text-secondary-900 mb-6 leading-tight">Tại sao chọn Việt Hoàng Hà?</h3>
            <p className="text-secondary-800 opacity-80 mb-8 font-medium leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực bất động sản tại TP.HCM, chúng tôi cam kết mang lại những giá trị thực nhất cho khách hàng.
            </p>
            <div className="space-y-4">
              {[
                'Pháp lý minh bạch, rõ ràng 100%', 
                'Hỗ trợ vay vốn ngân hàng đến 70%', 
                'Thẩm định giá chuẩn xác thị trường',
                'Hỗ trợ thủ tục công chứng, sang tên'
              ].map((reason, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-primary-600 shrink-0" />
                  <span className="font-semibold text-secondary-900">{reason}</span>
                </div>
              ))}
            </div>
            <button className="mt-10 bg-secondary-900 hover:bg-secondary-800 text-white px-8 py-3.5 rounded-full font-semibold transition-all cursor-pointer">
              Đăng Ký Tư Vấn
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary-600 rounded-[2rem] translate-x-4 translate-y-4 opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
              alt="Professional Real Estate Team" 
              className="relative z-10 w-full rounded-[2rem] object-cover h-96 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-heading font-bold mb-4">Việt Hoàng Hà<span className="text-primary-600">.</span></h2>
            <p className="text-secondary-50/70 max-w-sm mb-6 font-medium leading-relaxed">
              Trang thông tin mua bán bất động sản uy tín nhất tại khu vực Gò Vấp, Quận 12, và Tân Bình.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Chuyên Mục</h4>
            <ul className="space-y-3 font-medium text-secondary-50/70">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Nhà Bán Gò Vấp</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Nhà Bán Quận 12</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Nhà Bán Tân Bình</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Ký Gửi Nhà Đất</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Liên Hệ</h4>
            <ul className="space-y-3 font-medium text-secondary-50/70">
              <li>Hotline / Zalo: <a href="https://zalo.me/0909222596" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">0909 222 596</a></li>
              <li>Email: contact@viethoangha.com</li>
              <li>Địa chỉ: TP. Hồ Chí Minh</li>
              <li className="flex gap-4 pt-3">
                <a href="https://www.facebook.com/viet.hoang.ha.482723" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-primary-600 hover:-translate-y-1 transition-all text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/channel/UCLLhYG3k9y225mWCQEpbKiw" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-primary-600 hover:-translate-y-1 transition-all text-white">
                  <Youtube className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-secondary-50/50 font-medium text-sm">
          &copy; 2026 Việt Hoàng Hà Real Estate. All rights reserved. (Demo by App)
        </div>
      </footer>
    </div>
  );
}
