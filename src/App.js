import React, { useState, useEffect, useRef } from 'react';

// --- Firebase SDK (Harus diinstall via npm/yarn) ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc, increment, addDoc, serverTimestamp, query, orderBy, getDoc, limit, setDoc, deleteDoc } from 'firebase/firestore';


// --- KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDcLmds3v8CbpwvyW3EZR2GEkgdgMbCf9M",
  authDomain: "satukubah.firebaseapp.com",
  projectId: "satukubah",
  storageBucket: "satukubah.appspot.com",
  messagingSenderId: "683577690723",
  appId: "1:683577690723:web:a9c58f7317ab51be304656",
  measurementId: "G-CSF2WY6JFY"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// --- KOMPONEN IKON (SVG) ---
const ArrowLeftIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> );
const StarIcon = ({ filled }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> );
const ChevronDownIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> );
const CloseIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> );
const BankIcon = ({ className = "h-8 w-8" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor"><defs><linearGradient id="bankIconGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor: '#0f8242', stopOpacity:1}} /><stop offset="100%" style={{stopColor: '#0c6b36', stopOpacity:1}} /></linearGradient></defs><path stroke="url(#bankIconGradient)" strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /><circle cx="12" cy="14" r="1.5" fill="url(#bankIconGradient)" stroke="none" /></svg> );
const ShareIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> );
const MapPinIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> );
const HeartIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> );
const ShoppingBagIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> );
const TrashIcon = ({ className = 'h-4 w-4' }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PencilIcon = ({ className = 'h-4 w-4' }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const LogoutIcon = ({ className = 'h-5 w-5' }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

// --- KOMPONEN-KOMPONEN KECIL ---
const PrayerCard = ({ name, message }) => ( <div className="bg-white p-4 rounded-lg shadow mb-3"><p className="font-bold text-gray-800">{name}</p><p className="text-gray-600 italic">"{message}"</p></div> );
const Rating = ({ rating }) => ( <div className="flex items-center">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating} />)}<span className="ml-2 text-sm text-gray-600 font-semibold">{rating ? rating.toFixed(1) : '0'}/5.0</span></div> );
const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return ( <div className="border-y"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left"><span className="font-semibold text-gray-800">{title}</span><ChevronDownIcon className={`h-6 w-6 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div className="pb-4 text-gray-600 text-sm">{children}</div>}</div> );
};
const PaymentMethodModal = ({ isOpen, onClose, onSelect, paymentMethods, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end" onClick={onClose}>
            <div className={`absolute bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-gray-50 rounded-t-2xl h-[85vh] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
                <header className="p-4 flex items-center justify-between flex-shrink-0 z-10 bg-[#0f8242] text-white rounded-t-2xl"><h2 className="text-xl font-bold text-center flex-grow">Metode Pembayaran</h2><button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><CloseIcon /></button></header>
                <div className="overflow-y-auto bg-white">{loading ? <div className="p-4 text-center">Memuat...</div> : paymentMethods.map((method) => {
                        if (method.type === 'header') { return <div key={method.id} className="px-4 py-3 bg-gray-100 text-sm font-bold text-gray-600">{method.name}</div>; }
                        return <button key={method.id} onClick={() => onSelect({ name: method.name, logo: method.logo })} className="w-full flex items-center p-4 border-b hover:bg-gray-50"><img src={method.logo} alt={method.name} className="h-6 w-auto max-w-[80px] mr-4 object-contain" /><span className="text-gray-700">{method.name}</span></button>;
                })}</div>
            </div>
        </div>
    );
};
const ShareButton = ({ campaignTitle }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const handleShare = async () => {
        const shareData = { title: campaignTitle || 'Bantu Pembangunan Masjid', text: `Mari ikut berpartisipasi dalam program "${campaignTitle || 'Pembangunan Masjid'}". Setiap bantuan Anda sangat berarti.`, url: window.location.href };
        try {
            if (navigator.share) { await navigator.share(shareData); }
            else { 
                await navigator.clipboard.writeText(window.location.href); 
                setShowTooltip(true); 
                setTimeout(() => setShowTooltip(false), 2000); 
            }
        } catch (err) { console.error("Share failed:", err.message); }
    };
    return (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
            <p className="text-xs font-semibold text-gray-600 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">Bagikan ke saudara & teman anda</p>
            <button onClick={handleShare} className="bg-[#0f8242] text-white p-3 rounded-lg shadow-lg hover:bg-[#0c6b36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f8242] transition-transform hover:scale-110" aria-label="Bagikan Halaman"><ShareIcon /></button>
            {showTooltip && <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg">Link disalin!</div>}
        </div>
    );
};
const LiveNotification = ({ notification }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!notification || !isVisible) return null;

    const isDonation = notification.type === 'donation';
    const actionText = isDonation ? 'baru saja Donasi' : 'baru saja Checkout';
    const message = ` ${actionText} ${notification.detail || ''}`;
    
    return (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl flex items-center w-11/12 max-w-sm transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className={`flex-shrink-0 p-2 rounded-full ${isDonation ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                {isDonation ? <HeartIcon className="h-5 w-5"/> : <ShoppingBagIcon className="h-5 w-5"/>}
            </div>
            <div className="ml-3 text-sm text-gray-800">
                <p><span className="font-bold">{notification.name}</span>{message}</p>
            </div>
        </div>
    );
};


// --- HALAMAN-HALAMAN APLIKASI ---
const DonationPage = ({ onBack, onDonate, paymentMethods, loadingPaymentMethods }) => {
  const [amount, setAmount] = useState(100000);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleSelectPayment = (method) => {
      setSelectedPayment(method);
      setPaymentModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPayment) { alert("Silakan pilih metode pembayaran."); return; }
    if (!amount || amount <= 0) { alert("Silakan masukkan jumlah donasi yang valid."); return; }
    if (!isAnonymous && !name.trim()) { alert("Nama lengkap harus diisi."); return; }
    if (!phone.trim()) { alert("Nomor Whatsapp atau Handphone harus diisi."); return; }
    onDonate({ amount, name: isAnonymous ? 'Sahabat Masjid' : name, message, isAnonymous, paymentMethod: selectedPayment.name, type: 'donation' });
  };

  return (
    <>
      <PaymentMethodModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSelect={handleSelectPayment} paymentMethods={paymentMethods} loading={loadingPaymentMethods}/>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4 flex items-center border-b bg-white flex-shrink-0">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
          <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">Bantu Pembangunan Masjid</h1>
          <div className="w-10"></div>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Pilih Nominal Donasi</h2>
            <div className="grid grid-cols-2 gap-4">
              {[35000, 50000, 100000, 500000].map((val) => (<button type="button" key={val} onClick={() => setAmount(val)} className={`p-3 border rounded-lg text-center font-semibold ${amount === val ? 'bg-[#0f8242] text-white border-[#0f8242]' : 'bg-white text-gray-700 border-gray-300'}`}>{`Rp ${val.toLocaleString('id-ID')}`}{val === 100000 && <span className="block text-xs font-normal">sering dipilih</span>}</button>))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Data Donatur</h2>
            <div className="bg-green-50 border border-green-200/50 rounded-lg p-3 shadow-sm">
                <button type="button" onClick={() => setPaymentModalOpen(true)} className="w-full flex items-center">
                    <div className="p-2 bg-white rounded-lg shadow-sm mr-4"><BankIcon /></div>
                    <div className="flex-grow text-left">
                        <span className="font-semibold text-gray-700">{selectedPayment ? selectedPayment.name : 'Metode Pembayaran'}</span>
                    </div>
                    <div className="flex items-center text-green-600 font-semibold border border-green-200/80 bg-white px-3 py-1 rounded-md shadow-sm">
                        <span>Pilih</span><ChevronDownIcon />
                    </div>
                </button>
            </div>
            <input type="text" placeholder="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} disabled={isAnonymous} className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"/>
            <div className="flex items-center"><input type="checkbox" id="anonymous" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} className="mr-3 h-5 w-5 accent-[#0f8242]" /><label htmlFor="anonymous" className="text-gray-700">Sembunyikan nama saya (Sahabat Masjid)</label></div>
            <input type="tel" placeholder="No Whatsapp atau Handphone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
            <textarea placeholder="Tuliskan pesan atau doa (optional)" value={message} onChange={e => setMessage(e.target.value)} rows="3" className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
          </div>
        </form>
        <div className="p-4 sticky bottom-0 bg-white border-t flex-shrink-0">
          <button onClick={handleSubmit} className="w-full bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Lanjutkan Pembayaran</button>
        </div>
      </div>
    </>
  );
};
const ProductDetailPage = ({ product, onBack, onCheckout }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);

    const touchStart = useRef(0);
    const touchEnd = useRef(0);
    
    const minSwipeDistance = 50; 

    const onTouchStart = (e) => {
        touchEnd.current = 0;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe && product.images && selectedIndex < product.images.length - 1) {
            setSelectedIndex(prev => prev + 1);
        }
        if(isRightSwipe && selectedIndex > 0){
             setSelectedIndex(prev => prev - 1);
        }
    };

    const handleProceedToCheckout = () => {
        const selectedColor = product.availableColors && product.availableColors[selectedIndex] ? product.availableColors[selectedIndex] : null;
        if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
            alert("Silakan pilih ukuran terlebih dahulu.");
            return;
        }
        onCheckout(product, selectedColor, selectedSize);
    };

    return (
        <div className="flex flex-col h-full bg-white">
             <div className="p-4 flex items-center border-b flex-shrink-0">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                 <h1 className="text-xl font-bold text-gray-800 text-center flex-grow truncate px-2">{product.name || 'Detail Produk'}</h1>
                 <div className="w-10"></div>
             </div>
             <div className="flex-grow overflow-y-auto">
                 <div 
                     className="relative w-full aspect-square bg-gray-200 overflow-hidden"
                     onTouchStart={onTouchStart}
                     onTouchMove={onTouchMove}
                     onTouchEnd={onTouchEnd}
                 >
                     <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${selectedIndex * 100}%)` }}>
                         {product.images?.map((img, i) => (
                            <img key={i} src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover flex-shrink-0" />
                         ))}
                     </div>
                 </div>
                 <div className="p-4 space-y-4">
                     <h2 className="text-2xl font-bold text-gray-900">Rp {typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : '-'}</h2>
                     
                     <div className="space-y-4 pt-2">
                         {product.availableColors && product.availableColors.length > 0 && (
                             <div>
                                 <h3 className="text-sm font-semibold text-gray-700 mb-2">Warna: <span className="font-normal">{product.availableColors[selectedIndex]}</span></h3>
                                 <div className="flex flex-wrap gap-2">
                                     {(product.colorThumbnails || product.images).map((imgUrl, index) => (
                                     <button key={index} onClick={() => setSelectedIndex(index)} className={`h-14 w-14 rounded-md border-2 overflow-hidden transition-all ${selectedIndex === index ? 'border-[#0f8242]' : 'border-gray-200'}`}>
                                         <img src={imgUrl} alt={product.availableColors[index]} className="w-full h-full object-cover"/>
                                     </button>
                                     ))}
                                 </div>
                             </div>
                         )}
                         {product.availableSizes && product.availableSizes.length > 0 && (
                             <div>
                             <h3 className="text-sm font-semibold text-gray-700 mb-2">Ukuran:</h3>
                             <div className="flex flex-wrap gap-2">
                                 {product.availableSizes.map(size => (
                                 <button key={size} onClick={() => setSelectedSize(size)} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedSize === size ? 'bg-[#0f8242] text-white' : 'bg-gray-200 text-gray-800'}`}>
                                     {size}
                                 </button>
                                 ))}
                             </div>
                             </div>
                         )}
                     </div>

                     <Rating rating={product.rating} />
                     <Accordion title="Spesifikasi & Deskripsi">
                         <p className="font-semibold mb-2">Deskripsi:</p>
                         <p className="mb-4 whitespace-pre-wrap">{product.description || 'Tidak ada deskripsi.'}</p>
                         <p className="font-semibold mb-2">Spesifikasi:</p>
                         <p className="whitespace-pre-wrap">{product.specifications || 'Tidak ada spesifikasi.'}</p>
                     </Accordion>
                 </div>
             </div>
             <div className="p-4 sticky bottom-0 bg-white border-t flex-shrink-0">
                 <button onClick={handleProceedToCheckout} className="w-full bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Beli Sekarang</button>
             </div>
        </div>
    );
};
const CheckoutPage = ({ onBack, onPurchase, product, paymentMethods, loadingPaymentMethods, initialColor, initialSize }) => {
    const [quantity] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');
    const [selectedColor] = useState(initialColor || '');
    const [selectedSize] = useState(initialSize || '');

    const API_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

    useEffect(() => {
        fetch(`${API_BASE_URL}/provinces.json`).then(res => res.json()).then(setProvinces).catch(err => console.error("Failed to fetch provinces:", err));
    }, []);

    const handleProvinceChange = (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedCity('');
        setCities([]);
    };
    
    const handleCityChange = (cityId) => {
        setSelectedCity(cityId);
        setSelectedDistrict('');
        setDistricts([]);
    };

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedVillage('');
        setVillages([]);
    };
    
    useEffect(() => {
        if (!selectedProvince) return;
        setCities([]); setDistricts([]); setVillages([]); setSelectedCity(''); setSelectedDistrict(''); setSelectedVillage('');
        fetch(`${API_BASE_URL}/regencies/${selectedProvince}.json`).then(res => res.json()).then(setCities).catch(err => console.error("Failed to fetch cities:", err));
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedCity) return;
        setDistricts([]); setVillages([]); setSelectedDistrict(''); setSelectedVillage('');
        const fetchShippingCost = async () => {
            try {
                const costRef = doc(db, "shippingCostsByCity", selectedCity);
                const docSnap = await getDoc(costRef);
                setShippingCost(docSnap.exists() ? docSnap.data().cost || 0 : 0);
            } catch (error) {
                console.error("Error fetching shipping cost:", error);
                setShippingCost(0);
            }
        };
        fetchShippingCost();
        fetch(`${API_BASE_URL}/districts/${selectedCity}.json`).then(res => res.json()).then(setDistricts).catch(err => console.error("Failed to fetch districts:", err));
    }, [selectedCity]);

    useEffect(() => {
        if (!selectedDistrict) return;
        setVillages([]); setSelectedVillage('');
        fetch(`${API_BASE_URL}/villages/${selectedDistrict}.json`).then(res => res.json()).then(setVillages).catch(err => console.error("Failed to fetch villages:", err));
    }, [selectedDistrict]);

    
    const price = typeof product.price === 'number' ? product.price : 0;
    const total = (price * quantity) + shippingCost;
    const handleSelectPayment = (method) => {
        setSelectedPayment(method);
        setPaymentModalOpen(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !phone || !selectedVillage || !streetAddress) { alert("Harap lengkapi data penerima dan alamat."); return; }
        if (!selectedPayment) { alert("Silakan pilih metode pembayaran."); return; }
        
        onPurchase({
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            totalPrice: total,
            customerName: name,
            customerPhone: phone,
            customerAddress: `${streetAddress}, ${villages.find(v=>v.id===selectedVillage)?.name || ''}, ${districts.find(d=>d.id===selectedDistrict)?.name || ''}, ${cities.find(c=>c.id===selectedCity)?.name || ''}, ${provinces.find(p=>p.id===selectedProvince)?.name || ''}`,
            message: message,
            color: selectedColor,
            size: selectedSize,
            paymentMethod: selectedPayment.name,
            type: 'purchase'
        });
    };
    
    const colorIndex = product.availableColors ? product.availableColors.indexOf(initialColor) : -1;
    const displayImage = colorIndex !== -1 && product.images ? product.images[colorIndex] : (product.images ? product.images[0] : 'https://placehold.co/768x768/cccccc/ffffff?text=Gambar');

    return (
        <>
            <PaymentMethodModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSelect={handleSelectPayment} paymentMethods={paymentMethods} loading={loadingPaymentMethods} />
            <div className="flex flex-col h-full">
                <div className="p-4 flex items-center border-b bg-white flex-shrink-0">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                    <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">Checkout</h1>
                    <div className="w-10"></div>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h2 className="font-semibold">Detail Produk</h2>
                        <div className="flex gap-4">
                            <img src={displayImage} alt={product.name} className="w-20 h-20 rounded-md object-cover"/>
                            <div>
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-gray-600">Rp {price.toLocaleString('id-ID')}</p>
                                {selectedColor && <p className="text-sm text-gray-500">Warna: {selectedColor}</p>}
                                {selectedSize && <p className="text-sm text-gray-500">Ukuran: {selectedSize}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h2 className="font-semibold">Data Penerima</h2>
                        <input type="text" placeholder="Nama Lengkap Penerima" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
                        <input type="tel" placeholder="No Whatsapp atau Handphone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h2 className="font-semibold">Alamat Pengiriman</h2>
                        <select value={selectedProvince} onChange={e => handleProvinceChange(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option value="">Pilih Provinsi</option>{provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                        <select value={selectedCity} onChange={e => handleCityChange(e.target.value)} disabled={!selectedProvince} className="w-full p-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100"><option value="">Pilih Kota/Kabupaten</option>{cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                        <select value={selectedDistrict} onChange={e => handleDistrictChange(e.target.value)} disabled={!selectedCity} className="w-full p-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100"><option value="">Pilih Kecamatan</option>{districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                        <select value={selectedVillage} onChange={e => setSelectedVillage(e.target.value)} disabled={!selectedDistrict} className="w-full p-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100"><option value="">Pilih Desa/Kelurahan</option>{villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
                        <textarea placeholder="Detail Alamat (Nama Jalan, RT/RW, dll)" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" rows="3"></textarea>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h2 className="font-semibold">Pembayaran</h2>
                        <div className="bg-green-50 border border-green-200/50 rounded-lg p-3 shadow-sm">
                            <button type="button" onClick={() => setPaymentModalOpen(true)} className="w-full flex items-center">
                                <div className="p-2 bg-white rounded-lg shadow-sm mr-4"><BankIcon /></div>
                                <div className="flex-grow text-left"><span className="font-semibold text-gray-700">{selectedPayment ? selectedPayment.name : 'Metode Pembayaran'}</span></div>
                                <div className="flex items-center text-green-600 font-semibold border border-green-200/80 bg-white px-3 py-1 rounded-md shadow-sm"><span>Pilih</span><ChevronDownIcon /></div>
                            </button>
                        </div>
                        <textarea placeholder="Tuliskan pesan atau doa (optional)" value={message} onChange={e => setMessage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" rows="3"></textarea>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow space-y-2">
                        <h2 className="font-semibold mb-2">Rincian Belanja</h2>
                        <div className="flex justify-between"><span>Harga (1 barang)</span><span>Rp {price.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Ongkos Kirim</span> <span>Rp {shippingCost.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total Pembayaran</span> <span>Rp {total.toLocaleString('id-ID')}</span></div>
                    </div>
                </form>
                <div className="p-4 sticky bottom-0 bg-white border-t flex-shrink-0">
                     <button onClick={handleSubmit} className="w-full bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Lanjutkan Pembayaran</button>
                </div>
            </div>
        </>
    );
};
const MainPage = ({ donationProps, productProps, prayerProps, sliderProps, onAboutClick, onAdminClick, isAdmin }) => (
    <div className="flex-grow overflow-y-auto">
        <div className="w-full aspect-video sm:aspect-[4/3] bg-gray-200 relative group overflow-hidden">
            {sliderProps.loading ? <div className="flex items-center justify-center h-full text-gray-500">Memuat gambar...</div> : (
                sliderProps.sliderImages.map((src, index) => <img key={`${src.id}`} src={src.imageUrl} alt={`Gambar Masjid ${index + 1}`} className={`w-full h-full object-cover absolute transition-opacity duration-1000 ${index === sliderProps.currentMainImageIndex ? 'opacity-100' : 'opacity-0'}`} />)
            )}
        </div>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{donationProps.loading ? 'Memuat judul...' : donationProps.title}</h1>
          {donationProps.mapsUrl && (
            <a href={donationProps.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-500 hover:text-[#0f8242] transition-colors py-1">
                <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="font-semibold text-xs">Masjid Nurul Iman</span>
            </a>
          )}
          <div className="mt-1 flex justify-between items-center text-sm text-gray-600 mb-1"><p><span className="font-bold text-[#0f8242]">Rp {donationProps.totalDonations.toLocaleString('id-ID')}</span> dan masih terus dikumpulkan</p></div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 my-2"><div className="bg-[#0f8242] h-2.5 rounded-full" style={{ width: `${donationProps.progress}%` }}></div></div>
          <div className="flex justify-between items-center text-sm text-gray-600"><p><span className="font-bold">{donationProps.donorCount}</span> Donasi</p><p><span className="font-bold">∞</span> hari lagi</p></div>
          <button onClick={() => productProps.navigate('donate')} className="w-full mt-4 bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Donasi Sekarang</button>
        </div>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Dukung Lewat Produk</h2>
          {productProps.loading ? <div className="text-center p-8 text-gray-500">Memuat produk...</div> : (
            <div className="space-y-6">
              {productProps.products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <img src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://placehold.co/768x768/cccccc/ffffff?text=Gambar'} alt={product.name || 'Produk'} className="w-full aspect-square object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/768x768/cccccc/ffffff?text=Gambar+Error' }}/>
                      <div className="p-4">
                          <h3 className="font-bold text-lg">{product.name || 'Nama Produk Tidak Tersedia'}</h3>
                          <p className="text-gray-700 text-md mb-3">Rp {typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : '-'}</p>
                          <button onClick={() => productProps.handleSelectProduct(product)} className="w-full bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Beli Sekarang</button>
                      </div>
                  </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pesan dan Doa</h2>
          {prayerProps.loading ? <div className="text-center text-gray-500">Memuat doa...</div> : (
            <div className="space-y-3 max-h-72 overflow-y-auto">{prayerProps.prayers.map((p) => <PrayerCard key={p.id} name={p.name} message={p.message} />)}</div>
          )}
        </div>
        <div className="text-center p-4">
            <button onClick={onAboutClick} className="text-sm text-gray-500 hover:text-[#0f8242]">Tentang Kami</button>
        </div>
        {isAdmin && (
         <div className="text-center px-4 pb-4">
             <button onClick={onAdminClick} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                Masuk Halaman Admin
             </button>
         </div>
        )}
    </div>
);
const AboutUsPage = ({ onBack, aboutContent }) => {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 flex items-center border-b flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">Tentang Kami</h1>
                <div className="w-10"></div>
            </div>
            <div className="flex-grow overflow-y-auto p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {aboutContent || "Memuat konten..."}
            </div>
        </div>
    );
};

// --- Halaman Admin (diperbarui) ---
const ProductEditModal = ({ product, onSave, onClose, isLoading }) => {
    const [editedProduct, setEditedProduct] = useState(product);

    useEffect(() => {
        setEditedProduct({
            ...product,
            images: Array.isArray(product.images) ? product.images.join(', ') : '',
            availableColors: Array.isArray(product.availableColors) ? product.availableColors.join(', ') : '',
            availableSizes: Array.isArray(product.availableSizes) ? product.availableSizes.join(', ') : '',
        });
    }, [product]);

    const handleChange = (e, field) => {
        setEditedProduct({ ...editedProduct, [field]: e.target.value });
    };

    const handleSave = () => {
        const productToSave = {
            ...editedProduct,
            price: Number(editedProduct.price) || 0,
            rating: Number(editedProduct.rating) || 0,
            images: editedProduct.images.split(',').map(s => s.trim()).filter(s => s),
            availableColors: editedProduct.availableColors.split(',').map(s => s.trim()).filter(s => s),
            availableSizes: editedProduct.availableSizes.split(',').map(s => s.trim()).filter(s => s),
        };
        onSave(productToSave);
    };
    
    const AdminInput = ({ label, value, onChange, placeholder }) => ( <div className="mb-2"><label className="text-xs font-bold text-gray-600">{label}</label><input type="text" value={value} onChange={onChange} placeholder={placeholder || label} className="w-full p-1.5 border border-gray-400 rounded-sm" /></div> );
    const AdminTextarea = ({ label, value, onChange, placeholder }) => ( <div className="mb-2"><label className="text-xs font-bold text-gray-600">{label}</label><textarea value={value} onChange={onChange} placeholder={placeholder || label} rows="3" className="w-full p-1.5 border border-gray-400 rounded-sm" /></div> );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <header className="p-3 border-b flex justify-between items-center">
                    <h2 className="font-bold">Edit Produk</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon/></button>
                </header>
                <div className="p-4 space-y-2 overflow-y-auto">
                    <AdminInput label="Nama Produk" value={editedProduct.name} onChange={e => handleChange(e, 'name')} />
                    <AdminInput label="Harga Produk" value={editedProduct.price} onChange={e => handleChange(e, 'price')} />
                    <AdminTextarea label="Deskripsi Produk" value={editedProduct.description} onChange={e => handleChange(e, 'description')} />
                    <AdminTextarea label="Spesifikasi Produk" value={editedProduct.specifications} onChange={e => handleChange(e, 'specifications')} />
                    <AdminInput label="Rating Produk" value={editedProduct.rating} onChange={e => handleChange(e, 'rating')} />
                    <AdminTextarea label="URL Gambar (pisahkan dgn koma)" value={editedProduct.images} onChange={e => handleChange(e, 'images')} />
                    <AdminInput label="Warna (pisahkan dgn koma)" value={editedProduct.availableColors} onChange={e => handleChange(e, 'availableColors')} />
                    <AdminInput label="Ukuran (pisahkan dgn koma)" value={editedProduct.availableSizes} onChange={e => handleChange(e, 'availableSizes')} />
                </div>
                 <footer className="p-3 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300">Batal</button>
                    <button onClick={handleSave} disabled={isLoading} className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

const AdminPage = ({ onBack, onLogout, allOrders, ...props }) => {
    const { campaignData, aboutContent, sliderImages, paymentMethods, products } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form states
    const [sliderUrl, setSliderUrl] = useState('');
    const [campaignTitle, setCampaignTitle] = useState('');
    const [mapsUrl, setMapsUrl] = useState('');
    const [aboutText, setAboutText] = useState('');
    const [payment, setPayment] = useState({ name: '', logo: '', type: 'e-wallet', order: 100 });
    const [product, setProduct] = useState({ name: '', price: '', description: '', specifications: '', rating: '', images: '', availableColors: '', availableSizes: '' });

    // --- Efek Notifikasi Suara ---
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (allOrders.length > 0) {
            const playSound = () => {
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                    oscillator.connect(audioContext.destination);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                } catch(e) {
                    console.error("Gagal memainkan suara:", e);
                }
            };
            playSound();
        }
    }, [allOrders]);


    useEffect(() => {
        setCampaignTitle(campaignData.title || '');
        setMapsUrl(campaignData.mapsUrl || '');
        setAboutText(aboutContent || '');
    }, [campaignData.title, campaignData.mapsUrl, aboutContent]);

    const handleAction = async (action, data) => {
        setIsLoading(true);
        try {
            await action(data);
            alert('Sukses!');
        } catch (error) {
            console.error("Firebase Error:", error);
            alert(`Error: ${error.message}`);
        }
        setIsLoading(false);
    };
    
    // --- Actions ---
    const addSliderImage = async () => { if (!sliderUrl) return alert('URL Gambar Slide tidak boleh kosong.'); await addDoc(collection(db, 'sliderImages'), { imageUrl: sliderUrl, createdAt: serverTimestamp() }); setSliderUrl(''); };
    const deleteSliderImage = async (id) => await deleteDoc(doc(db, 'sliderImages', id));
    const updateCampaign = async () => { if (!campaignTitle) return alert('Judul Campaign tidak boleh kosong.'); await updateDoc(doc(db, 'campaign', 'main'), { title: campaignTitle, mapsUrl: mapsUrl }); };
    const addProduct = async () => { if (!product.name || !product.price) return alert('Nama dan Harga produk tidak boleh kosong.'); const newProduct = { ...product, price: Number(product.price), rating: Number(product.rating), images: product.images.split(',').map(s => s.trim()), availableColors: product.availableColors.split(',').map(s => s.trim()), availableSizes: product.availableSizes.split(',').map(s => s.trim()), createdAt: serverTimestamp() }; await addDoc(collection(db, 'products'), newProduct); setProduct({ name: '', price: '', description: '', specifications: '', rating: '', images: '', availableColors: '', availableSizes: '' }); };
    const updateProduct = async (productToUpdate) => { const { id, ...data } = productToUpdate; await updateDoc(doc(db, 'products', id), data); setEditingProduct(null); };
    const deleteProduct = async (id) => await deleteDoc(doc(db, 'products', id));
    const addPaymentMethod = async () => { if (!payment.name || !payment.logo) return alert('Nama dan URL logo tidak boleh kosong.'); await addDoc(collection(db, 'paymentMethods'), payment); setPayment({ name: '', logo: '', type: 'e-wallet', order: 100 }); };
    const deletePaymentMethod = async (id) => await deleteDoc(doc(db, 'paymentMethods', id));
    const updateAboutUs = async () => await setDoc(doc(db, 'aboutUs', 'main'), { content: aboutText });

    const AdminInput = ({ label, value, onChange, placeholder, disabled = false }) => ( <div className="mb-2"><label className="text-xs font-bold text-gray-600">{label}</label><input type="text" value={value} onChange={onChange} placeholder={placeholder || label} disabled={disabled} className="w-full p-1.5 border border-gray-400 rounded-sm disabled:bg-gray-100 disabled:text-gray-500" /></div> );
    const AdminTextarea = ({ label, value, onChange, placeholder }) => ( <div className="mb-2"><label className="text-xs font-bold text-gray-600">{label}</label><textarea value={value} onChange={onChange} placeholder={placeholder || label} rows="4" className="w-full p-1.5 border border-gray-400 rounded-sm" /></div> );
    const AdminButton = ({ onClick, children, color = 'green' }) => ( <button onClick={() => handleAction(onClick)} disabled={isLoading} className={`w-full p-1.5 text-white rounded-sm bg-${color}-600 hover:bg-${color}-700 disabled:bg-gray-400`}>{isLoading ? 'Menyimpan...' : children}</button> );

    return (
        <>
            {editingProduct && <ProductEditModal product={editingProduct} onSave={(updated) => handleAction(updateProduct, updated)} onClose={() => setEditingProduct(null)} isLoading={isLoading} />}
            <div className="flex flex-col h-full bg-gray-100 font-sans">
                <header className="p-4 flex items-center bg-white border-b sticky top-0 z-10">
                    <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-200"><ArrowLeftIcon className="h-5 w-5" /></button>
                    <h1 className="text-lg font-bold text-gray-800 text-center flex-grow">Halaman Admin</h1>
                    <button onClick={onLogout} className="p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600" title="Logout"><LogoutIcon /></button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-2 sm:p-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                           <AdminSection title="Pesanan Masuk">
                                <OrderList items={allOrders} />
                           </AdminSection>
                           <AdminSection title="Daftar Produk Saat Ini">
                               <ItemList items={products} onEdit={setEditingProduct} onDelete={(id) => handleAction(deleteProduct, id)} displayProp="name" />
                           </AdminSection>
                            <AdminSection title="Campaign">
                                <AdminInput label="Judul" value={campaignTitle} onChange={e => setCampaignTitle(e.target.value)} />
                                <AdminInput label="URL Google Maps" value={mapsUrl} onChange={e => setMapsUrl(e.target.value)} />
                                <AdminInput label="Total Donasi (Otomatis)" value={`Rp ${(campaignData.totalDonations || 0).toLocaleString('id-ID')}`} disabled />
                                <AdminInput label="Jumlah Donatur (Otomatis)" value={campaignData.donorCount || 0} disabled />
                                <AdminButton onClick={updateCampaign}>Update Campaign</AdminButton>
                            </AdminSection>
                        </div>
                        <div className="space-y-4">
                            <AdminSection title="Tambah Produk Baru">
                                <AdminInput label="Nama Produk" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} />
                                <AdminInput label="Harga Produk" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} />
                                <AdminTextarea label="Deskripsi Produk" value={product.description} onChange={e => setProduct({...product, description: e.target.value})} />
                                <AdminTextarea label="Spesifikasi Produk" value={product.specifications} onChange={e => setProduct({...product, specifications: e.target.value})} />
                                <AdminInput label="Rating Produk" value={product.rating} onChange={e => setProduct({...product, rating: e.target.value})} />
                                <AdminTextarea label="URL Gambar (pisahkan dgn koma)" value={product.images} onChange={e => setProduct({...product, images: e.target.value})} />
                                <AdminInput label="Warna (pisahkan dgn koma)" value={product.availableColors} onChange={e => setProduct({...product, availableColors: e.target.value})} />
                                <AdminInput label="Ukuran (pisahkan dgn koma)" value={product.availableSizes} onChange={e => setProduct({...product, availableSizes: e.target.value})} />
                                <AdminButton onClick={addProduct}>Tambah Produk</AdminButton>
                            </AdminSection>
                            <AdminSection title="Gambar Slide">
                                <AdminInput label="URL Gambar Slide" value={sliderUrl} onChange={e => setSliderUrl(e.target.value)} />
                                <AdminButton onClick={addSliderImage}>Tambah Gambar</AdminButton>
                                <ItemList items={sliderImages} onDelete={(id) => handleAction(deleteSliderImage, id)} displayProp="imageUrl" />
                            </AdminSection>
                            <AdminSection title="Metode Pembayaran">
                                <div className="grid grid-cols-2 gap-2">
                                    <AdminInput label="URL Logo" value={payment.logo} onChange={e => setPayment({...payment, logo: e.target.value})} />
                                    <AdminInput label="Nama Bank/QRIS" value={payment.name} onChange={e => setPayment({...payment, name: e.target.value})} />
                                </div>
                                <AdminButton onClick={addPaymentMethod}>Tambah Metode</AdminButton>
                                 <ItemList items={paymentMethods} onDelete={(id) => handleAction(deletePaymentMethod, id)} displayProp="name" />
                            </AdminSection>
                            <AdminSection title="Tentang Kami">
                                 <AdminTextarea label="Konten Tentang Kami" value={aboutText} onChange={e => setAboutText(e.target.value)} />
                                 <AdminButton onClick={updateAboutUs}>Update Tentang Kami</AdminButton>
                            </AdminSection>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const AdminSection = ({ title, children }) => (
    <div className="bg-white p-3 border border-gray-300">
        <h2 className="text-base font-bold mb-2 border-b pb-1">{title}</h2>
        {children}
    </div>
);

const ItemList = ({ items, onEdit, onDelete, displayProp }) => (
    <div className="mt-2 text-xs border-t pt-2 max-h-40 overflow-y-auto">
        {(items || []).map(item => (
            <div key={item.id} className="flex justify-between items-center p-1 hover:bg-gray-50">
                <span className="truncate pr-2">{item[displayProp]}</span>
                <div className="flex gap-2">
                    {onEdit && <button onClick={() => onEdit(item)} className="p-1 text-blue-500 hover:text-blue-700"><PencilIcon/></button>}
                    <button onClick={() => onDelete(item.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                </div>
            </div>
        ))}
    </div>
);

const OrderList = ({ items }) => (
    <div className="text-xs max-h-60 overflow-y-auto">
        {(items || []).length === 0 
            ? <p className="text-gray-500 p-2">Belum ada pesanan.</p>
            : (items || []).map(item => (
                <div key={item.id} className="p-2 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="flex justify-between font-bold">
                        <span>{item.customerName}</span>
                        <span>Rp {item.totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-gray-600">{item.productName}</p>
                    <p className="text-gray-500 text-[10px]">{item.customerAddress}</p>
                </div>
            ))
        }
    </div>
);


const PaymentConfirmationPage = ({ onBack, onConfirm, pendingTransaction }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!pendingTransaction) {
        return (
            <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
                <p className="text-gray-600">Tidak ada data transaksi.</p>
                <button onClick={onBack} className="mt-4 text-blue-600">Kembali ke Beranda</button>
            </div>
        );
    }
    
    const { amount, paymentMethod, type, productName, totalPrice } = pendingTransaction;
    const isDonation = type === 'donation';
    const finalAmount = isDonation ? amount : totalPrice;

    const handleConfirm = async () => {
        setIsProcessing(true);
        await onConfirm(pendingTransaction);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 flex items-center bg-white border-b">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">Konfirmasi Pembayaran</h1>
                <div className="w-10"></div>
            </header>
            <div className="flex-grow overflow-y-auto p-4 space-y-6 text-center">
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-800">Selesaikan Pembayaran Anda</h2>
                    <p className="text-gray-500 mt-1">Lakukan pembayaran sejumlah:</p>
                    <p className="text-4xl font-bold text-[#0f8242] my-4">Rp {finalAmount.toLocaleString('id-ID')}</p>
                    <p className="text-gray-500">melalui <span className="font-bold">{paymentMethod}</span></p>

                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <p className="font-semibold">Instruksi (Contoh)</p>
                        <img src="https://placehold.co/200x200/png?text=Scan+QRIS" alt="QRIS Code" className="mx-auto my-2 rounded-md" />
                        <p className="text-xs text-gray-600">atau transfer ke nomor rekening 123-456-7890 a/n Yayasan Masjid</p>
                    </div>
                </div>
                 <div className="p-4">
                    <button 
                        onClick={handleConfirm} 
                        disabled={isProcessing}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                        {isProcessing ? 'Memproses...' : 'Saya Sudah Bayar'}
                    </button>
                    <p className="text-xs text-gray-500 mt-3">Dengan menekan tombol ini, Anda mengkonfirmasi bahwa Anda telah menyelesaikan pembayaran.</p>
                 </div>
            </div>
        </div>
    );
};

// Halaman Login BARU
const LoginPage = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await onLogin(email, password);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
                    {error && <p className="bg-red-100 text-red-700 p-2 rounded-md text-sm mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const getRouteFromHash = () => window.location.hash.slice(1).replace(/^\//, '') || 'main';
  const [page, setPage] = useState(getRouteFromHash());

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const handleHashChange = () => { setPage(getRouteFromHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
            const adminDocRef = doc(db, 'admins', user.uid);
            const adminDoc = await getDoc(adminDocRef);
            setIsAdmin(adminDoc.exists() && adminDoc.data().role === 'admin');
        } else {
            setIsAdmin(false);
        }
        setAuthLoading(false);
    });

    return () => {
        window.removeEventListener('hashchange', handleHashChange);
        unsubscribeAuth();
    };
  }, []);

  const navigate = (path) => { window.location.hash = `#/${path}`; };
  const goBack = () => { window.history.back(); };

  // Data State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [campaignData, setCampaignData] = useState({ title: 'Memuat...', totalDonations: 0, donorCount: 0, mapsUrl: '' });
  const [prayers, setPrayers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [aboutContent, setAboutContent] = useState('');
  const [notificationList, setNotificationList] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  const [initialProductOptions, setInitialProductOptions] = useState({ color: '', size: '' });
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

  
  const progress = campaignData.totalDonations > 0 ? (campaignData.totalDonations % 50000000) / 50000000 * 100 : 0;

  useEffect(() => {
    const listeners = [
        onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snapshot) => { setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setLoadingProducts(false); }, (error) => { console.error(error); setLoadingProducts(false); }),
        onSnapshot(query(collection(db, "sliderImages"), orderBy("createdAt", "desc")), (snapshot) => { setSliderImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setLoadingSlider(false); }, (error) => { console.error(error); setLoadingSlider(false); }),
        onSnapshot(doc(db, "campaign", "main"), (doc) => { if (doc.exists()) setCampaignData(doc.data()); setLoadingCampaign(false); }, (error) => { console.error(error); setLoadingCampaign(false); }),
        onSnapshot(query(collection(db, "prayers"), orderBy("createdAt", "desc")), (snapshot) => { setPrayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setLoadingPrayers(false); }, (error) => { console.error(error); setLoadingPrayers(false); }),
        onSnapshot(query(collection(db, "paymentMethods"), orderBy("order", "asc")), (snapshot) => { setPaymentMethods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setLoadingPaymentMethods(false); }, (error) => { console.error(error); setLoadingPaymentMethods(false); }),
        onSnapshot(doc(db, "aboutUs", "main"), (doc) => { if(doc.exists()) setAboutContent(doc.data().content); }, (error) => console.error(error)),
        onSnapshot(query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(10)), (snapshot) => setNotificationList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse()), (error) => console.error(error)),
        onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) => setAllOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))))
    ];
    return () => { listeners.forEach(unsubscribe => unsubscribe()); };
  }, []);

  useEffect(() => {
    if (notificationList.length === 0) return;
    let index = 0;
    const intervalId = setInterval(() => { setCurrentNotification(notificationList[index]); index = (index + 1) % notificationList.length; }, 7000);
    return () => clearInterval(intervalId);
  }, [notificationList]);

  useEffect(() => {
    if (sliderImages.length > 1) {
        const sliderInterval = setInterval(() => { setCurrentMainImageIndex(prevIndex => (prevIndex + 1) % sliderImages.length); }, 5000);
        return () => clearInterval(sliderInterval);
    }
  }, [sliderImages]);
  
  const handleLogin = async (email, password) => {
      setLoginError('');
      try {
          await signInWithEmailAndPassword(auth, email, password);
          navigate('eska'); 
      } catch (error) {
          console.error("Login Error:", error.code);
          setLoginError("Email atau password salah.");
      }
  };
  
  const handleLogout = async () => {
      await signOut(auth);
      navigate('main');
  };

  const processConfirmedTransaction = async (transactionData) => {
    if (transactionData.type === 'donation') {
        const { amount, name, message, isAnonymous, paymentMethod } = transactionData;
        try {
            await updateDoc(doc(db, "campaign", "main"), { totalDonations: increment(amount), donorCount: increment(1) });
            if (message.trim() !== '') { await addDoc(collection(db, "prayers"), { name, message, createdAt: serverTimestamp() }); }
            await addDoc(collection(db, "donations"), { name, amount, message, isAnonymous, paymentMethod, createdAt: serverTimestamp() });
            await addDoc(collection(db, "notifications"), { name, type: 'donation', detail: `Rp ${amount.toLocaleString('id-ID')}`, createdAt: serverTimestamp() });
            alert('Jazakumullah Khairan Katsiran. Donasi Anda telah diterima.');
        } catch(error) { console.error("Error processing donation: ", error); alert('Maaf, terjadi kesalahan saat memproses donasi Anda.'); }
    } else if (transactionData.type === 'purchase') {
        try {
            await addDoc(collection(db, "orders"), { ...transactionData, createdAt: serverTimestamp(), status: "pending" });
            await addDoc(collection(db, "notifications"), { name: transactionData.customerName, type: 'purchase', detail: transactionData.productName, createdAt: serverTimestamp() });
            alert('Terima kasih! Pembelian Anda sedang diproses.');
        } catch (error) { console.error("Error processing purchase:", error); alert('Maaf, terjadi kesalahan saat memproses pembelian Anda.'); }
    }
    setPendingTransaction(null);
    navigate('main');
  };

  const startTransaction = (transactionData) => { setPendingTransaction(transactionData); navigate('payment'); };
  const handleSelectProduct = (product) => { setSelectedProduct(product); navigate('productDetail'); };
  const handleCheckout = (product, color, size) => { setSelectedProduct(product); setInitialProductOptions({ color, size }); navigate('checkout'); };
  
  if (authLoading) {
      return <div className="flex h-screen items-center justify-center">Memuat...</div>;
  }

  const renderPage = () => {
      if ((page === 'productDetail' || page === 'checkout') && !selectedProduct) {
          navigate('main');
          return null;
      }

      switch(page) {
          case 'productDetail': return <ProductDetailPage product={selectedProduct} onBack={goBack} onCheckout={handleCheckout} />;
          case 'checkout': return <CheckoutPage product={selectedProduct} onBack={goBack} onPurchase={startTransaction} paymentMethods={paymentMethods} loadingPaymentMethods={loadingPaymentMethods} initialColor={initialProductOptions.color} initialSize={initialProductOptions.size}/>;
          case 'donate': return <DonationPage onBack={goBack} onDonate={startTransaction} paymentMethods={paymentMethods} loadingPaymentMethods={loadingPaymentMethods}/>;
          case 'about': return <AboutUsPage onBack={goBack} aboutContent={aboutContent} />;
          case 'eska':
            return isAdmin ? <AdminPage onBack={goBack} onLogout={handleLogout} campaignData={campaignData} aboutContent={aboutContent} sliderImages={sliderImages} paymentMethods={paymentMethods} products={products} allOrders={allOrders} /> : <LoginPage onLogin={handleLogin} error={loginError}/>;
          case 'payment': return <PaymentConfirmationPage onBack={goBack} onConfirm={processConfirmedTransaction} pendingTransaction={pendingTransaction} />;
          case 'main': 
          default:
              return <MainPage 
                donationProps={{ ...campaignData, loading: loadingCampaign, progress }}
                productProps={{navigate, handleSelectProduct, products, loading: loadingProducts }}
                prayerProps={{prayers, loading: loadingPrayers}} 
                sliderProps={{sliderImages, loading: loadingSlider, currentMainImageIndex}}
                onAboutClick={() => navigate('about')}
                onAdminClick={() => navigate('eska')} 
                isAdmin={isAdmin}
              />;
      }
  };

  return (
    <div className="bg-gray-50 font-sans">
        {page === 'main' && <ShareButton campaignTitle={campaignData.title}/>}
        {page === 'main' && <LiveNotification notification={currentNotification} />}
        <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen flex flex-col">
            {renderPage()}
        </div>
    </div>
  );
}
