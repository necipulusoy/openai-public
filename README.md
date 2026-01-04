# 🤖 ChatGPT (Kubernetes + Redis + Azure OpenAI)

Bu proje, basit bir sohbet arayüzü (frontend) + API (backend) ile Azure OpenAI’a bağlanır. Sohbet geçmişi ve sol taraftaki chat listesi **Redis** üzerinde tutulur. Böylece pod yeniden başlasa bile geçmiş kaybolmaz.

## Ne İşe Yarar?
- **Chat Arayüzü**:  Web arayüzü ile Azure OpenAI modelleriyle sohbet et.
- **Chat Geçmişi**: Redis'te saklanan geçmiş konuşmalar, uygulama yeniden başlatıldığında kaybolmaz.
- **Kubernetes Deploy**: Local veya bulut ortamında kolayca deploy edilebilir.
- **Token Takibi**: Her yanıtın sonunda kullanılan token sayısı gösterilir (maliyet hesabı için).

## Gereksinimler
- **Kubernetes** (local: OrbStack, Minikube, Kind, EKS, AKS vb.)
- **Docker** (image build için)
- **Azure OpenAI** hesabı + Endpoint + API Key

## Kurulum Adımları

### 1. Azure OpenAI Bilgilerini Hazırla
Azure portal'dan şu bilgileri al:
- `AZURE_OPENAI_ENDPOINT` (örneğin: `https://your-resource.openai.azure.com/`)
- `AZURE_OPENAI_API_KEY` (API Key)
- `AZURE_OPENAI_DEPLOYMENT` (model adı, örneğin: `gpt-4o-mini`)

### 2. Image'ları Build Et
```bash
# Backend
cd backend
docker build -t backend:latest .

# Frontend
cd ../frontend
docker build -t frontend:latest .
```

### 3. Kubernetes Secret Oluştur
API key için secret oluştur:

```bash
kubectl create secret generic azure-openai-secret --from-literal=api-key=YOUR_API_KEY
```

### 4. YAML'larda Endpoint Güncelle
`aksyamls/backend.yml` dosyasında `AZURE_OPENAI_ENDPOINT` değerini kendi endpoint'inle değiştir.

### 5. Deploy Et
```bash
cd aksyamls
kubectl apply -f aksyamls/redis.yml
kubectl apply -f aksyamls/backend.yml
kubectl apply -f aksyamls/frontend.yml
```

### 6. Uygulamayı Aç
```bash
kubectl port-forward svc/openaifrontend-svc 8080:80
```
Tarayıcıda: `http://localhost:8080`

## Kullanım
- Sol tarafta chat listesi görünür.
- Yeni chat başlat: "➕ New Chat"
- Sohbet et: Mesaj yaz, Send'e bas.
- Geçmişe dön: Chat'e tıkla.
- Tümünü temizle: "Clear All Chats"

## Sorun Giderme
- **Pod'lar başlamıyor**: `kubectl get pods` ile durum kontrol et. ImagePull hatası varsa `imagePullPolicy: Never` ekle.
- **Chat geçmişi gelmiyor**: Redis pod'u çalışıyor mu? `kubectl logs -l app=redis`
- **API hatası**: Endpoint ve API anahtarı doğru mu? Backend logları: `kubectl logs -l app=openaibackend`
- **Port forward çalışmıyor**: Başka process mi kullanıyor 8080'i? `lsof -i :8080`

## Teknik Detaylar
- **Frontend**: Node.js + Express, static HTML/JS.
- **Backend**: Python FastAPI + Azure OpenAI SDK.
- **Cache**: Redis (chat geçmişi, 1 saat TTL).
- **K8s**: Deployment'lar, Service'ler, Secret'ler.

İyi sohbetler! 🤖 
