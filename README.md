# RESTful API S4E Project 🚀

Bu proje, S4E (Student for Everyone) platformu için geliştirilmiş fullstack bir web uygulamasıdır. Modern web teknolojileri kullanılarak RESTful API prensiplerine uygun olarak tasarlanmıştır.

## 📁 Proje Yapısı

```
restfulapis4e/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/       # ❌ Git'e dahil değil
├── frontend/               # React/Vue.js client application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/       # ❌ Git'e dahil değil
├── README.md
└── .gitignore
```

## ⚠️ Önemli Not: node_modules Klasörü

`node_modules` klasörleri **kasıtlı olarak** Git repository'sine dahil edilmemiştir. Bunun nedenleri:

- 📦 **Boyut**: node_modules binlerce dosya içerir (100-500 MB+)
- 🔄 **Yeniden oluşturulabilir**: `npm install` ile kolayca yeniden oluşturulur
- 🖥️ **Platform bağımsızlık**: Farklı işletim sistemlerinde uyumluluk sorunları yaşanmaz
- ⚡ **Performans**: Repository klonlama ve push işlemleri çok daha hızlı olur

## 🛠️ Kurulum Talimatları

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/wolman243/restfulapis4e.git
cd restfulapis4e
```

### 2. Backend Kurulumu
```bash
cd backend
npm install          # node_modules klasörü otomatik oluşur
npm start            # veya npm run dev
```

Backend varsayılan olarak `http://localhost:5000` üzerinde çalışır.

### 3. Frontend Kurulumu
```bash
cd frontend
npm install          # node_modules klasörü otomatik oluşur
npm start            # veya npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` üzerinde çalışır.

## 📋 Gereksinimler

- **Node.js** (v14 veya üstü)
- **npm** (v6 veya üstü)
- **Git**

## 🔧 Geliştirme Ortamı

### İlk Kez Çalıştırıyorsanız:
1. Node.js'in yüklü olduğundan emin olun: `node --version`
2. npm'in yüklü olduğundan emin olun: `npm --version`
3. Repository'yi klonlayın
4. Backend ve frontend için ayrı ayrı `npm install` çalıştırın

### Günlük Geliştirme:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 📝 API Endpoints

Backend API endpoints hakkında detaylı bilgi için `backend/` klasörünü kontrol edin.

Örnek endpoints:
- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/users/:id` - Belirli kullanıcıyı getir
- `PUT /api/users/:id` - Kullanıcı bilgilerini güncelle
- `DELETE /api/users/:id` - Kullanıcıyı sil

## 🚫 .gitignore Açıklaması

Aşağıdaki dosya ve klasörler Git'e dahil edilmemiştir:

```
# Dependency klasörleri
backend/node_modules/
frontend/node_modules/

# Environment variables (hassas bilgiler)
backend/.env
frontend/.env.local

# Log dosyaları
*.log

# Build çıktıları
backend/dist/
frontend/build/

# IDE ayar dosyaları
.vscode/
.idea/
```
Environment Variables

```bash
# .env.local
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL_INTERNAL=http://flask_app:5000

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

## 🔄 Yeni Geliştirici Rehberi

Eğer bu projeyi yeni klonladıysanız:

1. **Panik yapmayın!** `node_modules` klasörleri yok, bu normal
2. Her iki klasörde de `npm install` çalıştırın
3. Dependencies otomatik olarak `package.json`'dan yüklenecek
4. `package-lock.json` dosyası tam versiyonları garanti eder

## 🤝 Katkı Sağlama

1. Bu repository'yi fork edin
2. Feature branch oluşturun: `git checkout -b feature/YeniOzellik`
3. Değişikliklerinizi commit edin: `git commit -m 'Yeni özellik eklendi'`
4. Branch'inizi push edin: `git push origin feature/YeniOzellik`
5. Pull Request oluşturun

### Commit Mesaj Formatı:
- `feat:` - Yeni özellik
- `fix:` - Bug düzeltmesi
- `docs:` - Dokümantasyon değişikliği
- `style:` - Kod formatı (mantık değişikliği yok)
- `refactor:` - Kod refaktörü
- `test:` - Test ekleme/düzeltme

## 🐛 Sorun Giderme

### "node_modules bulunamadı" Hatası:
```bash
npm install
```

### Port çakışması:
- Backend için: `PORT=3001 npm start`
- Frontend için: Port seçimi otomatik önerilir

### Package güncellemeleri:
```bash
npm update
# veya
npm install package-name@latest
```

## 📊 Proje İstatistikleri

- 📂 **Backend**: RESTful API sunucusu
- 🎨 **Frontend**: Modern kullanıcı arayüzü  
- 🔗 **Integration**: Tam entegre fullstack uygulama
- 📱 **Responsive**: Mobil uyumlu tasarım

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👤 Geliştirici

**wolman243**
- 🐙 GitHub: [@wolman243](https://github.com/wolman243)
- 📧 İletişim: GitHub üzerinden mesaj gönderebilirsiniz

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan açık kaynak toplulukları ve kütüphanelere teşekkürler.

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**
