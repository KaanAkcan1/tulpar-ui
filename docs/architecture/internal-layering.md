# `_internal` Layering Decision (v0.6, kalıcı)

**Karar tarihi:** v0.6a — "for now" çözümü değil, bağlayıcı kural.

## Kurallar

1. Her paketin `src/_internal/` dizini **paket-özelidir**: hiçbir public
   entry'den re-export edilmez, `exports` map'ine girmez, dokümante edilmez.
2. Bir paket başka bir paketin `_internal`'ından **asla import edemez**
   (ESLint ile zorlanır).
3. İki paket aynı iç koda ihtiyaç duyarsa:
   - Kod ≤ ~50 satırsa **kopyalanır** (her kopya kendi paketinde test edilir).
   - Daha büyükse `@tulpar-ui/base` adlı yayınlanan ama dokümante edilmeyen
     bir paket oluşturulur ve kod oraya taşınır. Bu paket ilk gerçek ikinci
     tüketici ortaya çıktığında kurulur — önden kurulmaz (YAGNI).
4. Bilinen ilk aday: shell'in rail flyout pozisyonlama mantığı ↔ gelecekteki
   public Tooltip. Tooltip yapılırken kural 3 uygulanır.

## Gerekçe

- Premature paylaşım paketi = sürüm/yayın yükü, API donması.
- Kontrolsüz cross-import = packlenmiş dist'lerde kırık path'ler, gizli API
  sözleşmeleri. İkisi de reddedildi; eşik kuralı (50 satır) ikisinin ortası.
