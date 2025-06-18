import React, { useState, useEffect } from 'react';

// --- Firebase SDK (Harus diinstall via npm) ---
// npm install firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc, increment, addDoc, serverTimestamp, query, orderBy, getDoc, limit } from 'firebase/firestore';


// --- KONFIGURASI FIREBASE ---
// PERBAIKAN: Mengembalikan kunci API langsung untuk mengatasi error 'process not defined'
const firebaseConfig = {
  apiKey: "AIzaSyDcLmds3v8CbpwvyW3EZR2GEkgdgMbCf9M",
  authDomain: "satukubah.firebaseapp.com",
  projectId: "satukubah",
  storageBucket: "satukubah.appspot.com",
  messagingSenderId: "683577690723",
  appId: "1:683577690723:web:a9c58f7317ab51be304656",
  measurementId: "G-CSF2WY6JFY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// --- KOMPONEN IKON ---
const ArrowLeftIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> );
const ArrowRightIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg> );
const StarIcon = ({ filled }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> );
const ChevronDownIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> );
const CloseIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> );
const BankIcon = ({ className = "h-8 w-8" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor"><defs><linearGradient id="bankIconGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor: '#0f8242', stopOpacity:1}} /><stop offset="100%" style={{stopColor: '#0c6b36', stopOpacity:1}} /></linearGradient></defs><path stroke="url(#bankIconGradient)" strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /><circle cx="12" cy="14" r="1.5" fill="url(#bankIconGradient)" stroke="none" /></svg> );
const ShareIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> );
const MapPinIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> );
const HeartIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> );
const ShoppingBagIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> );


// --- KOMPONEN KECIL ---
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
        const shareData = { title: campaignTitle || 'Bantu Pembangunan Masjid', text: 'Mari ikut berpartisipasi.', url: window.location.href };
        try {
            if (navigator.share) { await navigator.share(shareData); } 
            else { await navigator.clipboard.writeText(window.location.href); setShowTooltip(true); setTimeout(() => setShowTooltip(false), 2000); }
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
    const actionText = isDonation ? 'baru saja berdonasi' : 'baru saja membeli';
    const message = ` ${actionText} ${notification.detail || ''}`;
    
    return (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 p-2 bg-white rounded-lg shadow-xl flex items-center max-w-sm transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className={`flex-shrink-0 p-1.5 rounded-full ${isDonation ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                {isDonation ? <HeartIcon className="h-4 w-4"/> : <ShoppingBagIcon className="h-4 w-4"/>}
            </div>
            <div className="ml-2 text-xs text-gray-700">
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
    onDonate({ amount, name, message, isAnonymous });
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const nextImage = () => product.images && product.images.length > 1 && setCurrentIndex(prev => (prev + 1) % product.images.length);
    const prevImage = () => product.images && product.images.length > 1 && setCurrentIndex(prev => (prev - 1 + product.images.length) % product.images.length);

    return (
        <div className="flex flex-col h-full bg-white">
             <div className="p-4 flex items-center border-b flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                <h1 className="text-xl font-bold text-gray-800 text-center flex-grow truncate px-2">{product.name || 'Detail Produk'}</h1>
                <div className="w-10"></div>
            </div>
            <div className="flex-grow overflow-y-auto">
                <div className="relative w-full aspect-square bg-gray-200 group">
                    <img src={product.images && product.images.length > 0 ? product.images[currentIndex] : 'https://placehold.co/768x768/cccccc/ffffff?text=Gambar'} alt={product.name} className="w-full h-full object-cover" />
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ArrowLeftIcon /></button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRightIcon /></button>
                </div>
                <div className="p-4 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Rp {typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : '-'}</h2>
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
                <button onClick={() => onCheckout(product)} className="w-full bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Beli Sekarang</button>
            </div>
        </div>
    );
};
const CheckoutPage = ({ product, onBack, onPurchase, paymentMethods, loadingPaymentMethods }) => {
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
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const API_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

    useEffect(() => {
        fetch(`${API_BASE_URL}/provinces.json`).then(res => res.json()).then(setProvinces);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`${API_BASE_URL}/regencies/${selectedProvince}.json`).then(res => res.json()).then(setCities);
            setSelectedCity(''); setDistricts([]); setVillages([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCity) {
            const fetchShippingCost = async () => {
                try {
                    const costRef = doc(db, "shippingCostsByCity", selectedCity);
                    const docSnap = await getDoc(costRef);
                    if (docSnap.exists()) {
                        setShippingCost(docSnap.data().cost || 0);
                    } else {
                        setShippingCost(0);
                    }
                } catch (error) {
                    setShippingCost(0);
                }
            };
            fetchShippingCost();
            fetch(`${API_BASE_URL}/districts/${selectedCity}.json`).then(res => res.json()).then(setDistricts);
            setSelectedDistrict(''); setVillages([]);
        }
    }, [selectedCity]);
    
    useEffect(() => {
        if (selectedDistrict) {
            fetch(`${API_BASE_URL}/villages/${selectedDistrict}.json`).then(res => res.json()).then(setVillages);
            setSelectedVillage('');
        }
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
        if (product.availableColors && product.availableColors.length > 0 && !selectedColor) { alert("Silakan pilih warna produk."); return; }
        if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) { alert("Silakan pilih ukuran produk."); return; }
        
        onPurchase({
            productName: product.name,
            quantity: quantity,
            totalPrice: total,
            customerName: name,
            customerPhone: phone,
            customerAddress: `${streetAddress}, ${villages.find(v=>v.id===selectedVillage)?.name}, ${districts.find(d=>d.id===selectedDistrict)?.name}, ${cities.find(c=>c.id===selectedCity)?.name}, ${provinces.find(p=>p.id===selectedProvince)?.name}`,
            message: message,
            color: selectedColor,
            size: selectedSize,
        });
    };

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
                            <img src={product.images && product.images[0]} alt={product.name} className="w-20 h-20 rounded-md object-cover"/>
                            <div>
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-gray-600">Rp {price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        {product.availableColors && product.availableColors.length > 0 && (
                            <div>
                                <label className="font-medium text-sm">Pilih Warna:</label>
                                <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="w-full p-3 mt-1 border border-gray-300 rounded-lg bg-white">
                                    <option value="">-- Pilih Warna --</option>
                                    {product.availableColors.map(color => <option key={color} value={color}>{color}</option>)}
                                </select>
                            </div>
                        )}
                        {product.availableSizes && product.availableSizes.length > 0 && (
                             <div>
                                <label className="font-medium text-sm">Pilih Ukuran:</label>
                                <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="w-full p-3 mt-1 border border-gray-300 rounded-lg bg-white">
                                    <option value="">-- Pilih Ukuran --</option>
                                    {product.availableSizes.map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h2 className="font-semibold">Data Penerima</h2>
                        <input type="text" placeholder="Nama Lengkap Penerima" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
                        <input type="tel" placeholder="No Whatsapp atau Handphone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h2 className="font-semibold">Alamat Pengiriman</h2>
                        <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option value="">Pilih Provinsi</option>{provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!selectedProvince} className="w-full p-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100"><option value="">Pilih Kota/Kabupaten</option>{cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                        <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedCity} className="w-full p-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100"><option value="">Pilih Kecamatan</option>{districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
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
                        <div className="flex justify-between"><span>Harga (1 barang)</span> <span>Rp {price.toLocaleString('id-ID')}</span></div>
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
const MainPage = ({ donationProps, productProps, prayerProps, sliderProps, onAboutClick }) => (
    <div className="flex-grow overflow-y-auto">
        <div className="w-full aspect-video sm:aspect-[4/3] bg-gray-200 relative group overflow-hidden">
            {sliderProps.loading ? <div className="flex items-center justify-center h-full text-gray-500">Memuat gambar...</div> : (
                sliderProps.sliderImages.map((src, index) => <img key={`${src}-${index}`} src={src} alt={`Gambar Masjid ${index + 1}`} className={`w-full h-full object-cover absolute transition-opacity duration-1000 ${index === sliderProps.currentMainImageIndex ? 'opacity-100' : 'opacity-0'}`} />)
            )}
        </div>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{donationProps.loading ? 'Memuat judul...' : donationProps.title}</h1>
          <a href="https://maps.app.goo.gl/RFh8PX7rq5HrZqdB9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-500 hover:text-[#0f8242] transition-colors my-2 py-1">
            <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="font-semibold text-sm">Masjid Nurul Iman</span>
          </a>
          <div className="mt-2 flex justify-between items-center text-sm text-gray-600 mb-2"><p><span className="font-bold text-[#0f8242]">Rp {donationProps.totalDonations.toLocaleString('id-ID')}</span> dan masih terus dikumpulkan</p></div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2"><div className="bg-[#0f8242] h-2.5 rounded-full" style={{ width: `${donationProps.progress}%` }}></div></div>
          <div className="flex justify-between items-center text-sm text-gray-600"><p><span className="font-bold">{donationProps.donorCount}</span> Donasi</p><p><span className="font-bold">∞</span> hari lagi</p></div>
          <button onClick={() => productProps.setPage('donate')} className="w-full mt-4 bg-[#0f8242] text-white font-bold py-3 rounded-lg hover:bg-[#0c6b36]">Donasi Sekarang!</button>
        </div>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Dukung Lewat Produk</h2>
          {productProps.loading ? <div className="text-center p-8 text-gray-500">Memuat produk...</div> : productProps.fetchError ? <div className="text-center p-6 text-red-700 bg-red-100 border border-red-200 rounded-lg mx-4"><p className="font-bold">Gagal Memuat Produk</p><p className="text-sm mt-1">{productProps.fetchError}</p></div> : (
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


// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const [page, setPage] = useState('main');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchProductsError, setFetchProductsError] = useState(null);

  const [sliderImages, setSliderImages] = useState([]);
  const [loadingSlider, setLoadingSlider] = useState(true);

  const [campaignData, setCampaignData] = useState({ title: '', totalDonations: 0, donorCount: 0 });
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  
  const [prayers, setPrayers] = useState([]);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  
  const [aboutContent, setAboutContent] = useState('');
  const [loadingAbout, setLoadingAbout] = useState(true);

  const [notificationList, setNotificationList] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  
  const progress = (campaignData.totalDonations % 50000000) / 50000000 * 100;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
      } catch (error) { setFetchProductsError("Gagal memuat produk."); } finally { setLoadingProducts(false); }
    };
    
    const fetchSliderImages = async () => {
        setLoadingSlider(true);
        try {
            const imagesCollection = collection(db, "sliderImages");
            const imageSnapshot = await getDocs(imagesCollection);
            const imageUrls = imageSnapshot.docs.map(doc => doc.data().imageUrl);
            setSliderImages(imageUrls);
        } finally { setLoadingSlider(false); }
    };

    fetchProducts();
    fetchSliderImages();
  }, []);
  
  useEffect(() => {
    const campaignRef = doc(db, "campaign", "main");
    const unsubCampaign = onSnapshot(campaignRef, (doc) => {
        if (doc.exists()) { setCampaignData(doc.data()); }
        setLoadingCampaign(false);
    });

    const prayersQuery = query(collection(db, "prayers"), orderBy("createdAt", "desc"));
    const unsubPrayers = onSnapshot(prayersQuery, (querySnapshot) => {
      setPrayers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingPrayers(false);
    });
    
    const paymentMethodsQuery = query(collection(db, "paymentMethods"), orderBy("order", "asc"));
    const unsubPayments = onSnapshot(paymentMethodsQuery, (snapshot) => {
        setPaymentMethods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoadingPaymentMethods(false);
    });
    
    const aboutUsRef = doc(db, "aboutUs", "main");
    const unsubAbout = onSnapshot(aboutUsRef, (doc) => {
        if(doc.exists()){ setAboutContent(doc.data().content); }
        setLoadingAbout(false);
    });

    const notificationsQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(10));
    const unsubNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotificationList(notifs.reverse());
    });

    return () => {
        unsubCampaign();
        unsubPrayers();
        unsubPayments();
        unsubNotifications();
        unsubAbout();
    };
  }, []);

  useEffect(() => {
    if (notificationList.length === 0) return;

    let index = 0;
    const intervalId = setInterval(() => {
        setCurrentNotification(notificationList[index]);
        index = (index + 1) % notificationList.length;
    }, 7000);

    return () => clearInterval(intervalId);
  }, [notificationList]);

  const handleNavigate = (pageName) => {
    window.scrollTo(0, 0);
    setPage(pageName);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    handleNavigate('productDetail');
  };
  const handleCheckout = (product) => {
    setSelectedProduct(product);
    handleNavigate('checkout');
  }

  const updateDonation = async (amount) => {
    const campaignRef = doc(db, "campaign", "main");
    try { await updateDoc(campaignRef, { totalDonations: increment(amount), donorCount: increment(1) }); } 
    catch (error) { console.error("Error updating donation: ", error); alert("Gagal memperbarui donasi."); }
  }
  
  const handleAddPrayer = async (name, message) => {
    if (message && message.trim() !== '') {
        try { await addDoc(collection(db, "prayers"), { name, message, createdAt: serverTimestamp() }); } 
        catch (error) { console.error("Error adding prayer: ", error); }
    }
  }
  
  const addNotification = async (type, name, detail) => {
    try {
        await addDoc(collection(db, "notifications"), {
            name, type, detail, createdAt: serverTimestamp()
        });
    } catch (e) { console.error("Error adding notification:", e); }
  }

  const handlePurchase = async (purchaseData) => {
    const { customerName, productName, message, amount } = purchaseData;
    const displayName = "Sahabat Masjid";
    const donationPart = amount * 0.1; 
    await updateDonation(donationPart);
    await handleAddPrayer(displayName, message);
    await addNotification('purchase', displayName, `produk ${productName || 'kami'}`);
    
    try {
        await addDoc(collection(db, "orders"), {
            ...purchaseData,
            createdAt: serverTimestamp()
        });
    } catch (e) { console.error("Error saving order:", e)}
    
    alert(`Terima kasih ${customerName} atas pembeliannya.`);
    handleNavigate('main');
  };
   const handleNewDonation = async ({ amount, name, message, isAnonymous }) => {
    const displayName = isAnonymous ? "Sahabat Masjid" : name;
    await updateDonation(amount);
    await handleAddPrayer(displayName, message);
    await addNotification('donation', displayName, 'untuk membantu pembangunan Masjid Nurul Iman');
    alert(`Terima kasih ${name} atas donasinya.`);
    handleNavigate('main');
  };

   useEffect(() => {
    if (sliderImages.length === 0) return;
    const autoSlideInterval = setInterval(() => {
        setCurrentMainImageIndex(prev => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(autoSlideInterval); 
  }, [sliderImages]);

  const renderPage = () => {
      switch(page) {
          case 'productDetail': return <ProductDetailPage product={selectedProduct} onBack={() => handleNavigate('main')} onCheckout={handleCheckout} />;
          case 'checkout': return <CheckoutPage product={selectedProduct} onBack={() => handleNavigate('productDetail')} onPurchase={handlePurchase} paymentMethods={paymentMethods} loadingPaymentMethods={loadingPaymentMethods}/>;
          case 'donate': return <DonationPage onBack={() => handleNavigate('main')} onDonate={handleNewDonation} paymentMethods={paymentMethods} loadingPaymentMethods={loadingPaymentMethods}/>;
          case 'about': return <AboutUsPage onBack={() => handleNavigate('main')} aboutContent={aboutContent} />;
          case 'main': 
          default:
              return <MainPage 
                donationProps={{ totalDonations: campaignData.totalDonations, donorCount: campaignData.donorCount, title: campaignData.title, loading: loadingCampaign, progress }}
                productProps={{setPage: handleNavigate, handleSelectProduct, products, loading: loadingProducts, fetchError: fetchProductsError}}
                prayerProps={{prayers, loading: loadingPrayers}}
                sliderProps={{sliderImages, loading: loadingSlider, currentMainImageIndex}}
                onAboutClick={() => handleNavigate('about')}
              />;
      }
  };

  return (
    <div className="bg-[linear-gradient(to_bottom,rgba(15,130,66,0.05),#ffffff)] font-sans">
        {page === 'main' && <ShareButton campaignTitle={campaignData.title}/>}
        {page === 'main' && <LiveNotification notification={currentNotification} />}
        <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen flex flex-col">
            {renderPage()}
        </div>
    </div>
  );
}