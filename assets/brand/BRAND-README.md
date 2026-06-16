# TulparUi — Brand Kit v1.0.0 ("Strata Wing")

Bu kit **TulparUi** wordmark varyasyonu için bağımsız ve eksiksizdir.

## Renk paleti (design token eşleşmesi)
| Token | Hex | Kullanım |
|---|---|---|
| tulpar-200 | #8CF5C6 | Mint vurgu, dark zeminde ikincil metin |
| tulpar-500 | #00C57A | **Primary** — marka rengi, "Ui" wordmark |
| tulpar-600 | #00A468 | Hover, orta stratum |
| tulpar-700 | #0B7E52 | Active, alt stratum |
| tulpar-950 | #07291F | Zemin, koyu yüzeyler, "Tulpar" wordmark (light) |

## Dosyalar
- `svg/` — Master vektörler: icon, mono siyah/beyaz, badge, TulparUi lockup light/dark, TulparUi wordmark (metinler path'e çevrildi)
- `png/` — npm avatar 512, GitHub avatar 500, apple-touch-icon 180, PWA 192/512, favicon.ico (16/32/48)
- `social/` — GitHub social preview 1280×640, OG image 1200×630, README banner 1280×320 (TulparUi ile)
- `brand-board.svg` / `tulpar-ui-brand-board.png` — marka sunum panosu

> Not: Bu repoda dosya adları **kebab-case**'e çevrilmiştir
> (`svg/tulpar-ui-icon.svg`, `svg/tulpar-ui-lockup-light.svg` vb.). Logo görsel
> olarak yine "tulparUi" render eder; bu yalnız diskteki ad konvansiyonudur.

## Kullanım kuralları
1. Min. boyut: icon 16px, lockup 96px genişlik.
2. Koruma alanı: işaretin her yanında en az bir stratum kalınlığı boşluk.
3. Açı (−18.4°), kademe ve stratum sırası değiştirilmez; işaret döndürülmez, yansıtılmaz.
4. "Ui" daima tulpar-500 yeşilidir; "Tulpar" light zeminde tulpar-950, dark zeminde beyazdır.
5. Renkli/karmaşık zeminlerde mono varyantları kullanın.

## Repo kurulum adımları (manuel — kod ile yapılamaz)

Bu varlıklar repoda hazır; aşağıdaki adımlar repo/organizasyon ayarı olduğundan
elle yapılmalıdır:

1. **GitHub social preview:** Repo → Settings → General → Social preview →
   `assets/brand/social/github-social-1280x640.png` yükle.
2. **GitHub profil/org avatarı:** Settings → Profile/Organization →
   `assets/brand/png/github-avatar-500.png`.
3. **npm org avatarı:** npmjs.com → org/profil ayarları →
   `assets/brand/png/npm-avatar-512.png`.

## Kullanılmayan (parke) varlıklar

`png/pwa-icon-192.png`, `png/pwa-icon-512.png` ve `png/favicon-48.png` şu an hiçbir
yerde referans edilmiyor (applerde PWA manifest yok; `.ico` zaten 16/32/48 içerir).
İleride PWA manifest eklenirse kullanılmak üzere burada duruyorlar.
