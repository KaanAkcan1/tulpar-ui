# Tulpar UI — Marka Varlıkları Entegrasyonu (Brand Assets Integration)

**Tarih:** 2026-06-15
**Durum:** Tasarım (onaylandı, spec aşaması)
**Kapsam:** "Strata Wing" marka kitini (logo, favicon, sosyal görseller) repoya tek
kaynak olarak yerleştirmek ve README'ler, Storybook ve playground'larda kullanmak.

## 1. Bağlam ve Amaç

Marka kiti (`TulparUi-brand-kit_1`) hazır geldi: SVG master vektörler (ikon, mono
siyah/beyaz, badge, lockup light/dark, wordmark), tam favicon/PWA seti, GitHub/npm
avatarları ve sosyal görseller (OG 1200×630, GitHub social 1280×640, README banner
1280×320). Metinler path'e çevrilmiş, production-ready.

**Kritik uyum:** Kitin marka yeşili `#00C57A` = `tulpar-500` = devam eden v0.7
Chromatic Mythology paletinin `brand.default` değeri. Yani kit, üzerinde
çalışılan branch ile birebir uyumlu; renk çatışması yok.

Amaç: bu varlıkları repoda tek bir kaynaktan yönetilebilir hâle getirmek ve
projenin dışa bakan tüm yüzeylerinde (README, docs, demolar) tutarlı şekilde
kullanmak.

### Hedefler

- Marka varlıkları için repo içinde tek bir kaynak (source of truth) klasörü.
- Kök README, Storybook, her iki playground ve paket README'lerinde marka kimliği.
- Favicon / PWA / OG meta'larının ilgili appler için doğru kurulumu.
- GitHub social preview ve avatar dosyalarının hazır + manuel adımların belgelenmesi.

### Hedef Dışı (Out of Scope)

- Yeni renk/token değişikliği — palet v0.7 spec'inin işi; bu spec sadece varlık
  yerleşimi yapar.
- Runtime'da logo gösteren yeni bir Tulpar bileşeni (ör. `<tulpar-logo>`).
- İkinci brand teması görselleri.
- Animasyonlu / Lottie logo varyantları.

## 2. Adlandırma Kararı

- **Kaynak klasör:** `TulparUi-brand-kit_1` (+ `TulparUi-brand-board_1.png`).
- **Repodaki dosya adları:** **kebab-case**. Logo görsel olarak yine "tulparUi"
  render eder; bu karar yalnızca diskteki dosya adıyla ilgilidir. Gerekçe: repodaki
  tüm konvansiyon kebab/küçük harf (`@tulpar-ui/*`, `tulpar-button.ts`, `--tulpar-`),
  ayrıca küçük harf Linux-CI / Windows arasında büyük-küçük harf hatalarına karşı
  güvenli.

### Dosya adı eşlemesi (kaynak → repo)

| Kaynak (PascalCase) | Repo (kebab) |
|---|---|
| `svg/TulparUi-icon.svg` | `svg/tulpar-ui-icon.svg` |
| `svg/TulparUi-icon-mono-black.svg` | `svg/tulpar-ui-icon-mono-black.svg` |
| `svg/TulparUi-icon-mono-white.svg` | `svg/tulpar-ui-icon-mono-white.svg` |
| `svg/TulparUi-badge.svg` | `svg/tulpar-ui-badge.svg` |
| `svg/TulparUi-lockup-light.svg` | `svg/tulpar-ui-lockup-light.svg` |
| `svg/TulparUi-lockup-dark.svg` | `svg/tulpar-ui-lockup-dark.svg` |
| `svg/TulparUi-wordmark.svg` | `svg/tulpar-ui-wordmark.svg` |
| `TulparUi-brand-board.png` | `tulpar-ui-brand-board.png` |
| `brand-board.svg` | `brand-board.svg` (zaten kebab) |
| `png/*`, `social/*` | aynen (zaten lowercase) |
| `BRAND-README.md`, `design-philosophy.md` | aynen (README konvansiyonu) |

## 3. Tek Kaynak: `assets/brand/`

Kit'in tamamı repo köküne `assets/brand/` altına kopyalanır (kebab adlarıyla):

```
assets/brand/
├── BRAND-README.md            # kullanım kuralları + token eşlemesi
├── design-philosophy.md       # "Kinetic Verdure" felsefesi
├── brand-board.svg
├── tulpar-ui-brand-board.png
├── svg/                       # master vektörler (7 dosya)
├── png/                       # favicon/PWA/avatar seti
└── social/                    # og-image, github-social, readme-banner
```

**İlke:** `assets/brand/` değişmez referanstır. Appler servis etmeleri gereken
spesifik dosyaları (favicon vb.) buradan kendi `public/`'lerine **kopyalar** —
build zamanı serve edilebilmesi için. Tek kaynak burada güncellenir; kopyalar
azdır ve nadiren değişir.

## 4. Yüzey Yerleşimleri

### 4.1 Kök README.md

En üste, docs sitesine linkli banner (GitHub relatif path'i render eder):

```md
[![Tulpar UI — Enterprise web components](assets/brand/social/readme-banner-1280x320.png)](https://tulpar-ui-docs.pages.dev)
```

`# Tulpar UI` başlığının hemen üstüne eklenir.

### 4.2 Storybook (apps/docs)

- **`assets/brand/png/`'den** favicon seti + **`svg/tulpar-ui-lockup-light.svg`**
  `apps/docs/.storybook/public/` (veya mevcut public) altına kopyalanır.
- **`.storybook/manager.ts`** (yeni) — `@storybook/theming` ile custom tema:
  - `brandTitle: "Tulpar UI"`
  - `brandUrl: "https://tulpar-ui-docs.pages.dev"`
  - `brandImage`: lockup-light (Storybook manager varsayılan zemini açık)
  - `brandTarget: "_self"`
- **Favicon:** `.storybook/main.ts`'e `staticDirs` ile brand klasörü servis +
  `managerHead` / `preview-head.html`'e `<link rel="icon" …>`.

### 4.3 playground-vue

- `public/favicon.svg` → `assets/brand/svg/tulpar-ui-icon.svg` ile değiştirilir
  (ya da `png/favicon.svg` yoksa icon.svg). Ek olarak `apple-touch-icon-180.png`.
- `index.html`:
  - `<title>` → "Tulpar UI — Vue Playground"
  - OG meta: `og:image` = `og-image-1200x630.png` (public'e kopyalanır),
    `og:title`, `og:description`, `twitter:card`.
- Shell showcase header'ında (topbar brand slot) `tulpar-ui-lockup-dark.svg`
  veya `-light` (tema zeminine göre) gösterilir.

### 4.4 playground-ng

- `public/favicon.ico` → `assets/brand/png/favicon.ico` ile değiştirilir.
- `src/index.html`: `<title>` → "Tulpar UI — Angular Playground", favicon link.
- Header/topbar brand slot'ta lockup gösterilir.

### 4.5 Paket README'leri (7 adet)

`packages/{core,tokens,angular,vue,shell}/README.md` + `apps/playground-{ng,vue}/README.md`
— en üste küçük, merkezî ikon başlık. **Önemli:** npm, relatif görsel path'lerini
render etmez; npm sayfasında görünmesi için **absolute URL** kullanılır
(GitHub raw veya docs sitesi):

```html
<p align="center">
  <img src="https://raw.githubusercontent.com/<owner>/<repo>/main/assets/brand/svg/tulpar-ui-icon.svg" width="48" alt="Tulpar UI" />
</p>
```

Doğru `<owner>/<repo>` ve `main` branch'i implementation sırasında repo
remote'undan doğrulanır.

> Not: `apps/playground-{ng,vue}/README.md` şu an Vite/Vue boilerplate. Bunlar
> kısa, projeye özgü içerikle değiştirilir + ikon başlık eklenir.

### 4.6 GitHub social preview + avatarlar (manuel)

Dosyalar repoda hazır olur ama bunlar repo/org ayarlarıdır, kod ile set edilemez:

- **GitHub social preview:** Repo → Settings → General → Social preview →
  `assets/brand/social/github-social-1280x640.png` yüklenir.
- **GitHub org/profil avatarı:** `assets/brand/png/github-avatar-500.png`.
- **npm org avatarı:** `assets/brand/png/npm-avatar-512.png`.

Bu manuel adımlar `assets/brand/BRAND-README.md` sonuna "Repo kurulum adımları"
başlığı altında ve implementation plan'ın son task'ında checklist olarak yazılır.

## 5. Favicon / PWA Dağıtımı

Her servis edilen app için ilgili dosyalar `public/`'e kopyalanır:

| App | Kopyalanan |
|---|---|
| apps/docs (Storybook) | `favicon.ico`, `favicon-32`, `favicon-16`, lockup-light.svg |
| playground-vue | `tulpar-ui-icon.svg`, `apple-touch-icon-180.png`, `og-image-1200x630.png`, lockup |
| playground-ng | `favicon.ico`, `apple-touch-icon-180.png`, lockup |

PWA manifest (192/512) bu turda **eklenmez** (mevcut applerde manifest yok;
scope dışı). Dosyalar `assets/brand/png/`'de ileride kullanılmak üzere durur.

## 6. Doğrulama (Verification)

- `pnpm build` ve `pnpm lint` temiz geçer (yeni binary asset'ler lint'e takılmaz).
- Storybook lokalde açılır; manager'da wordmark logo ve favicon görünür.
- Her iki playground lokalde açılır; favicon ve header logosu görünür.
- Kök README GitHub önizlemesinde banner render eder (relatif path).
- Paket README'lerindeki ikon absolute URL ile yüklenir (görsel kontrol).
- `assets/brand/` içindeki dosya adlarının tamamı kebab-case (büyük harf yok,
  README/MD dosyaları hariç).

## 7. Riskler / Notlar

- **npm görsel render:** relatif path npm'de çalışmaz → paket README'lerinde
  absolute URL zorunlu (madde 4.5).
- **Storybook 8 manager API:** `brandImage` SVG'yi kabul eder; çözünürlük sorunu
  olursa PNG'ye düşülür.
- **Çift kopya:** `assets/brand/` + app `public/` arasında küçük bir duplikasyon
  var; bu favicon servis modeli için standarttır, kabul edilir.
- **Dosya boyutu:** sosyal PNG'ler ~150–300KB; repo'ya eklenmesi kabul edilebilir,
  Git LFS gerektirmez.
