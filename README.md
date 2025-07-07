# Story Share - Frontend Application

Aplikasi web progresif (PWA) untuk berbagi cerita dengan lokasi menggunakan teknologi modern. Aplikasi ini memungkinkan pengguna untuk membuat, melihat, dan menyimpan cerita dengan foto dan lokasi geografis.

## 🚀 Fitur Utama

- **Autentikasi Pengguna**: Login dan registrasi dengan auto-login
- **Manajemen Cerita**: Buat, lihat, dan kelola cerita dengan foto
- **Geolokasi**: Integrasi peta interaktif dengan multiple tile layers
- **Camera Integration**: Ambil foto langsung dari kamera atau upload file
- **Offline Support**: PWA dengan service worker dan caching
- **Push Notifications**: Notifikasi real-time untuk pengguna
- **Bookmark/Favorites**: Simpan cerita favorit dengan IndexedDB
- **Responsive Design**: UI yang responsif untuk semua perangkat
- **View Transitions**: Animasi halaman yang smooth

## 🛠️ Teknologi yang Digunakan

### Frontend
- **JavaScript ES6+**: Bahasa pemrograman utama
- **Webpack**: Module bundler dan build tool
- **Babel**: JavaScript transpiler
- **CSS3**: Styling dengan custom properties dan animations
- **Leaflet**: Library peta interaktif
- **MapTiler API**: Tile layers untuk peta
- **Feather Icons**: Icon library
- **Workbox**: Service worker untuk PWA

### Backend Integration
- **Dicoding Story API**: RESTful API untuk manajemen cerita
- **VAPID Push Notifications**: Web push notifications
- **IndexedDB**: Local storage untuk offline functionality

## 📁 Struktur Proyek

```
TheFinal_v2/
├── src/
│   ├── index.html              # HTML template utama
│   ├── scripts/
│   │   ├── index.js            # Entry point aplikasi
│   │   ├── config.js           # Konfigurasi API
│   │   ├── data/
│   │   │   └── api.js          # API service layer
│   │   ├── pages/
│   │   │   ├── app.js          # Main application class
│   │   │   ├── home/           # Halaman beranda
│   │   │   ├── auth/           # Halaman autentikasi
│   │   │   ├── add-story/      # Halaman tambah cerita
│   │   │   ├── favorites/      # Halaman favorit
│   │   │   ├── about/          # Halaman tentang
│   │   │   └── not-found/      # Halaman 404
│   │   ├── presenters/         # MVP pattern - Presenters
│   │   ├── routes/             # Routing system
│   │   └── utils/              # Utility functions
│   ├── styles/
│   │   └── styles.css          # Main stylesheet
│   └── public/
│       ├── manifest.json       # PWA manifest
│       ├── sw.js              # Service worker
│       └── images/            # Asset gambar
├── webpack.common.js           # Webpack common config
├── webpack.dev.js             # Webpack development config
├── webpack.prod.js            # Webpack production config
└── package.json               # Dependencies dan scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 atau lebih tinggi)
- npm atau yarn
- Browser modern dengan support untuk:
  - ES6+ modules
  - Service Workers
  - IndexedDB
  - Camera API
  - Geolocation API

### Installation

1. Clone repository:
   ```bash
   git clone [repository-url]
   cd TheFinal_v2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Konfigurasi API Key:
   - Buka file `STUDENT.txt`
   - Pastikan `MAP_SERVICE_API_KEY` sudah diisi dengan API key MapTiler yang valid

## 📜 Available Scripts

### Development
```bash
npm run start-dev
```
Menjalankan development server dengan hot reload pada port 9000.

### Production Build
```bash
npm run build
```
Membuat production build yang dioptimasi di folder `dist`.

### Serve Production
```bash
npm run serve
```
Menyajikan production build menggunakan http-server.

## 🎯 Penggunaan

### Autentikasi
1. Akses aplikasi di `http://localhost:9000`
2. Klik "Login/Register" untuk membuat akun atau masuk
3. Setelah login, navigation akan terupdate otomatis

### Membuat Cerita
1. Klik tombol floating "Buat Cerita" atau navigasi ke "Add Story"
2. Isi deskripsi cerita
3. Ambil foto menggunakan kamera atau upload file
4. Pilih lokasi di peta dengan mengklik
5. Klik "Publikasikan Cerita"

### Fitur Lanjutan
- **Favorites**: Bookmark cerita dengan tombol "Simpan"
- **Offline**: Aplikasi tetap berfungsi saat offline
- **Push Notifications**: Aktifkan notifikasi dengan tombol bell
- **Multiple Map Layers**: Ganti layer peta di kontrol layer

## 🔧 Konfigurasi

### Environment Variables
File `STUDENT.txt` berisi:
- `APP_URL`: URL deployment aplikasi
- `MAP_SERVICE_API_KEY`: API key untuk MapTiler

### API Configuration
File `src/scripts/config.js`:
```javascript
const CONFIG = {
  BASE_URL: "https://story-api.dicoding.dev/v1/",
};
```

## 📱 PWA Features

### Service Worker
- Precaching static assets
- Runtime caching untuk API responses
- Offline fallback
- Push notification handling

### Web App Manifest
- Installable sebagai aplikasi native
- Custom splash screen
- Shortcut actions
- Screenshots untuk app stores

## 🗺️ Integrasi Peta

### Supported Tile Layers
1. **OpenStreetMap**: Default layer
2. **MapTiler Satellite**: Satellite imagery
3. **MapTiler Streets**: Enhanced street view
4. **MapTiler Topography**: Topographic maps

### Features
- Interactive markers
- Click to select location
- Responsive map containers
- Custom popup styling

## 💾 Offline Storage

### IndexedDB Implementation
- Database: `storyshare-db`
- Object Store: `favorites`
- Blob storage untuk gambar offline

### Caching Strategy
- **Cache First**: Static assets (CSS, JS, images)
- **Network First**: API responses
- **Precaching**: Essential app shell files

## 🔔 Push Notifications

### Setup
1. VAPID public key dikonfigurasi di `src/scripts/utils/push-notification.js`
2. Service worker handles notification events
3. Subscription management melalui API

### Features
- Subscribe/unsubscribe toggle
- Notification click handling
- Background sync support

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Teal-based palette dengan dark/light variants
- **Typography**: Poppins font family
- **Icons**: Feather icons untuk konsistensi
- **Animations**: CSS transitions dan view transitions

### Responsive Design
- Mobile-first approach
- Breakpoint di 768px dan 1000px
- Adaptive navigation drawer
- Optimized touch interactions

## 🔒 Security

### Authentication
- JWT token storage di localStorage
- Authorization headers untuk API calls
- Auto-redirect untuk protected routes

### Data Validation
- Input sanitization
- File type validation
- Location data validation

## 🚀 Deployment

### Build Process
1. Webpack optimizes dan minifies assets
2. Babel transpiles ES6+ ke ES5
3. CSS extraction dan optimization
4. Service worker generation

### Hosting Requirements
- HTTPS untuk PWA features
- Proper MIME types untuk manifest
- Service worker scope configuration

## 📊 Performance Optimizations

### Loading Performance
- Code splitting dengan dynamic imports
- Lazy loading untuk gambar
- Preload critical resources
- Optimized bundle sizes

### Runtime Performance
- Efficient DOM manipulation
- Debounced event handlers
- Memory leak prevention
- Optimized map rendering

## 🛠️ Development Guidelines

### Code Architecture
- **MVP Pattern**: Separation of concerns
- **Module System**: ES6 imports/exports
- **Event-Driven**: Decoupled components
- **Error Handling**: Comprehensive try-catch blocks

### Best Practices
- Semantic HTML markup
- Accessible UI components
- Progressive enhancement
- Clean code principles

## 🐛 Troubleshooting

### Common Issues

1. **Camera tidak berfungsi**
   - Pastikan HTTPS atau localhost
   - Berikan permission camera
   - Check browser compatibility

2. **Peta tidak muncul**
   - Verify MapTiler API key
   - Check network connectivity
   - Inspect console errors

3. **Notifikasi tidak berfungsi**
   - Enable notification permission
   - Check service worker registration
   - Verify VAPID configuration

## 📄 License

Proyek ini dibuat untuk keperluan edukasi dan portfolio.

## 👨‍💻 Author

**Taufiq Hidayatullah**
- Universitas: Universitas Amikom Yogyakarta
- Program Studi: S1-Informatika
- Email: [email-placeholder]

## 🙏 Acknowledgments

- Dicoding Academy untuk API dan learning resources
- MapTiler untuk tile services
- Leaflet community untuk mapping library
- Feather icons untuk icon set

---

*Aplikasi ini dibuat sebagai bagian dari pembelajaran