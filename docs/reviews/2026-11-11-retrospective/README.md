# Tulpar UI — Geçmişe dönük inceleme (v0.1 → v0.15)

- **Tarih:** 11.11.2026
- **İncelenen durum:** `review/retro-2026-11-11` (yerel dal) = `main` + `feat/v0.15-select-completion` + `chore/skills-and-housekeeping` + `chore/node-26-lts`. Bu, birleştirme sonrası durumdur.
- **Kapsam:** kod (5 paket), tokenlar, wrapper'lar, erişilebilirlik, iki playground, Storybook, altyapı, yayın süreci, tüm `.md` belgeleri, spec ve plan kayıtları, mimari kararlar.
- **Yöntem:** 8 paralel inceleme ajanı, alan başına bir ajan. Ajanlar yalnız okudu; repoda hiçbir dosyayı değiştirmedi. Ana bulguları ayrıca kendim doğruladım (bkz. «Doğrulama»).
- **Ekler:** [ekler/](ekler/) klasöründe 8 ayrıntılı rapor (İngilizce), 181 bulgunun makine okunur listesi (`findings.json`) ve ajan talimatı.

---

## 1. Karar

> **Bu faz tamam değil. «Tamam» diyemem.**

- Kod düzenli, testler çok ve yeşil (2.117 test). Görsel dil iki temada da tutarlı.
- Ama kütüphanenin **sözleşme katmanı** zayıf: erişilebilir ad, form entegrasyonu, wrapper davranışı ve yayınlanan paket.
- Testler bu sorunları yakalamıyor. Testler öznitelik metnini kontrol ediyor; tarayıcının hesapladığı erişilebilirlik ağacını kontrol etmiyor.
- 181 bulgu var: **21 Blocker, 84 Major, 61 Minor, 10 Nit, 4 Info.** Bulguların çoğu aynı 10 kök nedene bağlanıyor (bölüm 4).
- Blocker'ların çoğu v0.15'ten önce de vardı; `main` dalında duruyorlar.

---

## 2. Dal birleştirme önerisi

| Dal | Öneri | Gerekçe |
|---|---|---|
| `chore/skills-and-housekeeping` | **Birleştirin** | Yalnız beceri dosyaları. Hiçbir bulgu bu dala ait değil. |
| `chore/node-26-lts` | **Birleştirin** (önce push edip CI'ı görün) | Node 26 artık LTS. Build, lint, tüm testler ve iki playground derlemesi Node 26'da geçti. |
| `feat/v0.15-select-completion` | **Şimdi birleştirmeyin** | 9 bulgu birleşmeyi engelliyor (bölüm 3). Düzeltmeyi aynı dalda yapın. |

Üç dal `main` üzerine çakışmasız birleşiyor. Bunu yerel inceleme dalında denedim.

---

## 3. v0.15'i engelleyen bulgular

Bu 9 bulgu doğrudan v0.15 Select'e ait. Hepsi tarayıcıda doğrulandı.

| # | Sorun | Kaynak bulgular | Doğru çözüm |
|---|---|---|---|
| 1 | Arama kutusu (`role=combobox`) ve durum satırları `role=listbox` içinde. ARIA'ya aykırı; axe «critical» veriyor. | K1, CB-3, AX-5, DOC-9 | Popup rolsüz bir kap (ya da etiketli `role=dialog`) olsun. Arama kutusu ve listbox bu kabın içinde **kardeş** öğe olsun. Durum satırı listbox'ın dışında, kalıcı bir canlı bölge olsun. Tetikleyici `role=button` + `aria-haspopup="dialog"`. Kaynak: WAI-ARIA APG «Editable Combobox With List Autocomplete»; React Aria, Ark UI ve Primer SelectPanel aynı yapıyı kullanıyor. |
| 2 | **Spec yanlış.** v0.15 spec'i arama kutusunu «listbox'ın içine» koymayı şart koşuyor ve tetikleyici rolü konusunda kendi içinde çelişiyor. | DOC-9 | Önce spec'i düzeltin, sonra kodu. Hata koddan değil spec'ten geliyor. |
| 3 | Sorgu varken slot'a eklenen seçenek **gizleniyor** (`!undefined` = `true`). | CB-4 b | Slot değişince `_filterResult` değerini yeniden hesaplayın. |
| 4 | Veri modunda «No options» satırı önceki render'dan hesaplanıyor; yeni seçeneklerle birlikte ekranda kalıyor. | CB-4 a | Durum satırını aynı render'daki veriden hesaplayın. |
| 5 | Yeniden açılışta aktif satır eski filtreye göre seçiliyor. | CB-4 c | Kapanışta sorguyu ve aktif indeksi birlikte sıfırlayın. |
| 6 | Arama kutusunda Home/End imleci değil, seçeneği hareket ettiriyor. | CB-4 d, AX-18 | Arama kutusunda Home/End'i tutmayın. APG bu tuşları metin imlecine ayırır. |
| 7 | Katlama tablosu büyük aksanlı harfleri (É, Ñ) içermiyor ve asimetrik. | CB-4 e, CB-12 | Tabloyu elle yazmayın; `toLocaleLowerCase(locale).normalize("NFD")[0]` ile üretin. 1:1 indeks eşlemesi korunur. |
| 8 | Eşleşme vurgusu aktif satırda görünmüyor (koyu 1,32:1, açık 1,12:1). Renk token yerine `color-mix` ile sabit yazılmış. | K8, VIS-6 | Yeni anlamsal tokenlar ekleyin: `color.highlight.text` ve `color.highlight.bg`. Vurguyu kutu ile değil metin rengiyle verin. Forced-colors için `Mark` dalını koruyun. |
| 9 | Slot modunda ve arama kutusunda `aria-activedescendant` shadow sınırını geçiyor ve hiçbir öğeyi göstermiyor. Tetikleyicinin erişilebilir adı yok. | AX-2, AX-4, CB-1, CB-2 | Bölüm 4.1'deki ortak çözüm. Bu iki sorun v0.14'ten geliyor, ama Select'i aynı dalda düzeltin. |

---

## 4. Kök nedenler

Her başlık, birden çok ajanın bağımsız olarak bulduğu aynı sorunu toplar.

### 4.1 ARIA referansları shadow DOM sınırını geçemiyor — **en büyük sorun**

- **Belirti:** Checkbox, Radio, Select, ikon butonlar ve Progress'in erişilebilir adı yok. Select'te aktif seçenek ekran okuyucuya bildirilmiyor. Shell'in atlama bağlantısı odağı taşımıyor. Rail modunda menü bağlantılarının adı yok.
- **Bulgular:** CB-1, CB-2, CA-6, CA-7, CA-12, CA-14, AX-1, AX-2, AX-3, AX-4, AX-9, AX-14.
- **Neden:** `<label for>`, `aria-labelledby` ve `aria-activedescendant` ID ile çalışır. ID bir shadow root'tan diğerine geçmez. `<label>` bir `<span role=checkbox>` ya da `<div role=combobox>` öğesini etiketleyemez.
- **Neden testler yakalamadı:** Testler `getAttribute()` ile metni kontrol ediyor. Tarayıcının hesapladığı ağaç hiç test edilmiyor.
- **Doğru çözüm:**
  1. Etiket ile kontrol aynı shadow root'ta olsun ve `aria-labelledby` ile bağlansın. Bu, bugün tüm tarayıcılarda çalışır.
  2. Light DOM'daki öğelere referans için ARIA element reflection (`ariaActiveDescendantElement`, `ariaLabelledByElements`) kullanın. Bu Baseline 2025.
  3. Host'taki `aria-label` değerini içteki gerçek kontrole aktarın, ya da `label` özelliği ekleyin (Web Awesome ve Spectrum böyle yapıyor).
  4. Her etkileşimli bileşene erişilebilirlik ağacı testi ve axe testi ekleyin (`chai-a11y-axe` ya da WTR + axe).
- **Karar sizde:** kontrol mimarisi (bölüm 6, karar 1).

### 4.2 Form sözleşmesi eksik

- **Belirti:** `required`, `min`, `max`, `pattern` hiçbir gönderimi durdurmuyor. Önceden dolu bir alan FormData'ya girmiyor. `form.reset()` ve `<fieldset disabled>` alanlara ulaşmıyor. Maskeli alan `input` olayı göndermiyor; Vue `v-model` güncellenmiyor.
- **Bulgular:** CA-1, CA-2, CA-3, CA-4, CA-5, CA-8, CA-9, CA-11.
- **Doğru çözüm:** `ElementInternals` sözleşmesini tamamlayın: her değer veya kısıt değişiminde `setValidity()` ve `setFormValue()`; `formResetCallback`, `formDisabledCallback`, `formStateRestoreCallback`. Odak için `delegatesFocus`. Shoelace/Web Awesome ve Lion bu sözleşmeyi uygular.
- **Maske motoru:** imleç ve seçim aralığını yok sayıyor, Türkçe harfleri reddediyor, IME desteklemiyor. Doğrusu: ya motoru `input` olayı üzerinde seçim aralığına duyarlı olarak yeniden yazın ya da olgun bir kütüphane (Maskito) kullanın (karar 8).

### 4.3 Angular wrapper mimarisi ve form desteği yanlış

- **Belirti:** `tulparTooltip` bir `*-ng` wrapper üzerinde ekranın sol üst köşesinde açılıyor. `formControlName` ve `ngModel` çalışmıyor. `change` adlı çıktılar iki kez tetikleniyor. ButtonGroup Angular butonlarını görmüyor.
- **Bulgular:** WR-2, WR-3, WR-4, WR-5, WR-9, DOC-18, DOC-19.
- **Neden 1:** Her wrapper iki öğe çiziyor: dışta `display:contents` olan `<tulpar-x-ng>`, içte gerçek öğe. Dış öğenin dikdörtgeni 0×0.
- **Neden 2:** CLAUDE.md «form-associated öğeler Reactive Forms'a kendiliğinden bağlanır» diyor. Bu yanlış. Angular formları `ElementInternals` okumaz. Pakette hiç `ControlValueAccessor` yok.
- **Doğru çözüm:**
  1. Ionic/Stencil «proxy component» deseni: Angular bileşeninin seçicisi doğrudan `tulpar-button` olsun, şablonu `<ng-content/>`. Fazladan öğe oluşmaz. CLAUDE.md'deki «aynı seçici sonsuz döngü yapar» iddiası yanlış.
  2. Angular 22 için `FormValueControl` / `FormCheckboxControl` uygulayın. Bu tek kontrol Signal, Reactive ve Template-driven formlarla çalışır.
- **Uyarı:** Seçici değişikliği kırıcı bir değişikliktir. 1.0'dan önce yapın (karar 2).

### 4.4 Vue wrapper'ları core varsayılanlarını siliyor

- **Belirti:** Vue'da TextInput, Textarea ve NumberInput etiketi görünmüyor. Vue NumberInput hiç çizilmiyor (`RangeError`). Tag ve Chip ton dolgusunu kaybediyor. Switch'in `on-color` değeri çekirdeğe ulaşmıyor.
- **Bulgular:** WR-1, WR-6, VIS-1, VIS-7, VIS-11.
- **Neden:** 24 dosyada `:x="prop ?? undefined"` var. Vue bu durumda özelliğe boş metin (`''`) yazıyor ve çekirdeğin varsayılanını eziyor. Boş slot taşıyıcıları her zaman çiziliyor. Vue, `onColor` adını olay dinleyicisi sanıyor.
- **Doğru çözüm:** Yalnız ayarlanmış özellikleri iletin (`undefined` anahtarları atan bir `computed` + `v-bind`). Slot taşıyıcısını yalnız slot doluyken çizin (`v-if="$slots.label"`; doğru desen `TulparSelect.vue` içinde zaten var). Çekirdek de `''` değerini «ayarlanmamış» saysın. `on-color` adını `checked-color` olarak değiştirin.

### 4.5 Renk ve tema sözleşmesi

- **Belirti:** 364 renk çiftinin 57'si WCAG AA'yı geçmiyor. Odak halkası açık temada 1,88:1 (gereken 3:1). Seçim bileşenlerinin hata metni koyu temada okunmuyor. Koyu temada tonal ve ghost butonlar aynı görünüyor. Firefox ve Safari'de avatar ve özel tonlar koyu temaya geçmiyor. Doğal form kontrolleri ve kaydırma çubukları koyu temada açık kalıyor.
- **Bulgular:** TOK-1…TOK-11, TOK-13, AX-7, AX-8, AX-12, AX-13, VIS-5, VIS-8, CA-19, DOC-21.
- **Doğru çözüm:**
  1. Odak halkası: opak bir token, `outline: 2px solid` + `outline-offset: 2px`. Outline forced-colors modunda da görünür; box-shadow görünmez.
  2. Ton tokenlarında dolgu ve metin rolünü ayırın (`fill`, `on-fill`, `text`, `border`). Marka yeşili metin olarak 3,2:1 veriyor; metin için koyu bir ton gerekiyor (karar 5).
  3. Token dosyasında modlara göre `color-scheme` tanımlayın. `:host-context(.dark)` yerine `light-dark()` ya da kendiliğinden dönen tokenlar kullanın. Ek olarak «sistem teması» modu ekleyin.
  4. Seçim mesajı satırı tanımsız tokenları (`--tulpar-selection-message-*`) okuyor. Ortak bir `--tulpar-field-message-*` rolü kullanın.
  5. Kontrast testini 11 token grubunun hepsine genişletin ve saydamlığı hesaba katın.

### 4.6 Adlandırma dağınık

- **Belirti:** Aynı kavram için `severity` / `tone` / `color`, `warn` / `warning`, `outlined` / `outline`, `tonal` / `soft-tonal`. «Uyarı» girişlerde turuncu, toast ve etiketlerde altın; altın aynı zamanda «premium».
- **Bulgular:** CA-10, DOC-20, TOK-13.
- **Doğru çözüm:** Tek bir kütüphane sözlüğü. Roadmap'te kilitli olan `tone` sözlüğü doğru; Button bu sözlüğe hiç taşınmamış. 1.0'dan önce Button'ı taşıyın ve tek bir uyarı tonu seçin (karar 4).

### 4.7 Overlay ve bildirim davranışı

- **Belirti:** Toast ve Message butonlarına klavyeyle ulaşılamıyor. F6 tuşu ilk toast'tan sonra sayfanın tamamında kalıcı olarak engelleniyor. Fareyle açılan tooltip Escape ile kapanmıyor (WCAG 1.4.13). Tooltip, toggletip ve popover kaydırmada yeniden konumlanmıyor. Her Tag bir canlı bölge (`role=status`). Chip, bir butonu başka bir buton rolünün içine koyuyor.
- **Bulgular:** AX-6, CB-6…CB-11, CB-13, AX-11, AX-15, VIS-4, VIS-20.
- **Doğru çözüm:** Toast host'undan `tabindex=-1` değerini kaldırın; bölgeyi F6 ile ulaşılabilir bir landmark yapın; F6'yı yalnız toast varken yakalayın. Konumlamayı kaydırma ve boyut değişiminde güncelleyin. CSS Anchor Positioning Ocak 2026'da Baseline oldu; bunu ilerletme katmanı olarak ekleyin (karar 7). Tag'den `role=status` rolünü kaldırın. Chip'te kaldırma butonunu ana etkileşimin kardeşi yapın.

### 4.8 Yayınlanan paket bozuk — **npm'e yayından önce düzeltin**

- **INF-1:** Angular paketi «full» derleme modunda. Angular, npm kütüphaneleri için `"compilationMode": "partial"` şart koşuyor. npm'deki 0.6.0 da böyle.
- **INF-2:** `shell` dist'i kendi lit-html kopyasını içeriyor. Neden: `vite.config` yalnız `lit` ve `lit/decorators.js` yollarını harici tutuyor. **«Lit directive cross-instance crash» sorununun gerçek kaynağı bu;** tüketici bundler'ı değil. Doğru çözüm: harici bağımlılıkları desenle tanımlayın (`/^lit($|\/)/`, `/^@lit\//`).
- **INF-4:** Angular paketi `dist` yerine kök klasörden, elle yazılmış exports ile yayınlanıyor. Doğrusu: `publishConfig.directory: "dist"`.
- **INF-5 / CA-20:** Geliştirici uyarıları yayınlanan pakette kalıcı olarak kapalı (`{DEV:false, PROD:true}` derlemeye gömülmüş). Doğrusu: `development` export koşulu ya da `esm-env`.
- **INF-3 / WR-8:** Angular, «isteğe bağlı» bağımlılık olan `@angular/router` paketini statik import ediyor.
- **INF-6 / WR-7:** Wrapper'larda tree-shaking yok; tek giriş noktası tüm bileşenleri kaydediyor. `sideEffects` alanı da yok.
- **DOC-4:** Palet yeniden yazımı 0.6.0'daki 21 renk ailesini kaldırdı ve marka rengini değiştirdi, ama hiçbir changeset bunu kaydetmiyor. Geçiş kılavuzu ise «kırıcı değişiklik yok» diyor.
- **DOC-5:** Bekleyen changeset'lerde yanlış API adları var; bunlar yayında CHANGELOG'a dönüşecek.
- **INF-8:** Yayın uzun ömürlü `NPM_TOKEN` kullanıyor, provenance yok, CI'a bağlı değil. Doğrusu: npm Trusted Publishing (OIDC).

### 4.9 Araç zinciri ve test altyapısı

- **Bulgular:** INF-9…INF-18, INF-21, TOK-17, CA-26, CB-26, WR-17, DOC-17.
- **Durum:**
  - Aynı repoda Vite 5 ve 8, Vitest 1.6 ve 3.2, happy-dom 14 ve 20 var.
  - pnpm kataloğu yalnız 2 bağımlılığı kapsıyor.
  - typescript-eslint 7 resmî olarak ESLint 9'u desteklemiyor.
  - Testler yalnız Chromium'da koşuyor.
  - axe testi ve görsel regresyon testi yok.
  - CI'da typecheck adımı yok.
  - Storybook iki ana sürüm geride; a11y ayarı (`test: "error"`) hiçbir şey yapmıyor.
  - Yayındaki playground'larda bilinen güvenlik açığı olan sürümler var (15 high). Dependabot ya da Renovate yok.
- **K5 (Windows test hatası):** Vue paketi Vitest 1.6 kullanıyor. Bu sürüm geçici dosyaya atomik olmayan yazma yapıyor. Vitest 3 bu sorunu çözüyor.
- **CRLF gürültüsü:** `.gitattributes` yok. Ayrıca `sync-exports.ts` her derlemede `package.json` dosyasını yeniden yazıyor.
- **Doğru çözüm:** Tüm ortak bağımlılıkları kataloğa alın ve `catalogMode: strict` açın. Tek Vite ve Vitest sürümüne geçin. Firefox ve WebKit'i CI'a ekleyin. axe testlerini zorunlu yapın. `.gitattributes` ekleyin. Renovate kurun. CI'a `permissions` bloğu ve SHA ile sabitlenmiş action'lar ekleyin.

### 4.10 Belgeler ve süreç kaydı güvenilir değil

- **CLAUDE.md eski (K3, DOC-1):** «v0.6 in progress», 5 bileşen, TypeScript 5.4, Vue 3.4. Gerçekte 22 core + 5 shell öğesi var, TypeScript 6, Vue 3.5. Out-of-scope listesi teslim edilmiş bileşenleri (Tooltip, Badge) hâlâ «kapsam dışı» sayıyor.
- **Planlar (DOC-7):** 19 planda 1.767 onay kutusunun hiçbiri işaretli değil. CLAUDE.md'deki «ilk işaretsiz görevden devam et» kuralı bu yüzden her zaman 1. göreve döner.
- **Spec'ler (DOC-8):** 22 spec'in 21'i hâlâ «Draft» ya da «Approved»; hiçbiri «Implemented» değil.
- **README'ler (DOC-2, DOC-3, WR-14):** Var olmayan API'leri anlatıyor (`<tulpar-popover-ng>`, `TulparPopover`, `v-tulpar-popover-ref`). Teslim edilen yüzeyin yalnız üçte birini kapsıyor.
- **Tüketici belgeleri (DOC-16, INF-7, WR-16):** Custom Elements Manifest yok; bu yüzden otomatik API tablosu ve IDE desteği yok. Tarayıcı destek tablosu, a11y beyanı, sürüm politikası, CONTRIBUTING ve SECURITY dosyaları yok.
- **Sürüm adları (DOC-6, K4):** İç sürüm adları (v0.7…v0.15) semver ile çakışıyor. npm hâlâ 0.6.0'da; birikmiş 9 changeset tek bir 0.7.0 olarak çıkacak.
- **Diğer:** 25'ten fazla kırık bağlantı (DOC-22). Belgelerde Türkçe ve İngilizce karışık (DOC-23). Repoda `build-output.txt` ve eski bir worktree kopyası (`.claire/`) commit edilmiş; 31 commit mesajı yalnız «.» (DOC-24, INF-20).
- **Doğru çözüm:**
  1. Onay kutusunu görevle aynı commit'te işaretleyin.
  2. Her spec'e kapanış bloğu ekleyin: durum, birleşme commit'i, sapmalar.
  3. Kalıcı kararları ADR olarak kaydedin (MADR formatı).
  4. CLAUDE.md dosyasını baştan yazın.
  5. Custom Elements Manifest üretin; README API tablolarını ve wrapper parite kontrolünü bundan türetin.

### Playground'lar (ürün yüzeyi)

- **Parite iyi:** 23 sayfanın 21'inde başlıklar ve bileşen sayıları birebir aynı.
- **Sorunlar (VIS-2, VIS-3, VIS-9…VIS-18):**
  - Mobilde kapalı menü ve kapalı configurator klavyeyle odaklanabiliyor.
  - Sayfalar arası geçişte kaydırma konumu korunuyor.
  - Playground'lar Tulpar'ın kendi kontrolleri yerine 59 doğal `<select>` kullanıyor.
  - 375 px genişlikte 3 sayfa yatay kayıyor.
  - Açılış sayfası ve 404 sayfası yok.
  - İki ayrı elle yazılmış sayfa seti var (her biri yaklaşık 6.500 satır CSS).
- **Doğru çözüm:** Sayfa içeriğini tek bir ortak kaynaktan üretin ve CI'a parite kontrolü ekleyin (karar 12).

---

## 5. Önerilen sıra

Yeni bileşene (Combobox) geçmeden önce bir **sağlamlaştırma fazı** yapın. Combobox, MultiSelect ve DatePicker aynı listbox, form ve ARIA temelini kullanacak; bozuk temel her yeni bileşene kopyalanır.

1. **v0.15'i kapatın.** Önce spec'i, sonra Select'i düzeltin (bölüm 3). Sonra dalı birleştirin.
2. **Yayın engellerini kapatın** (bölüm 4.8). Changeset içeriklerini düzeltin. Ancak bundan sonra npm'e yayın yapın.
3. **Erişilebilirlik temeli** (4.1). Kontrol mimarisine karar verin. Erişilebilirlik ağacı ve axe testlerini zorunlu yapın.
4. **Form sözleşmesi** (4.2) ve Angular form desteği (4.3).
5. **Wrapper düzeltmeleri** (4.3, 4.4). Önce Vue'daki kullanıcıyı durduran hataları düzeltin. Angular mimari kararından sonra proxy desenine geçin.
6. **Renk ve tema** (4.5, 4.6).
7. **Overlay ve bildirim** (4.7) ve shell (VIS-2, VIS-3, CA-13, CA-15).
8. **Araç zinciri ve CI** (4.9).
9. **Belgeler** (4.10). CLAUDE.md'yi bu adımı beklemeden hemen düzeltin.

---

## 6. Kararı sizde olan konular

Her madde için önerim yazılı; karar sizindir.

| # | Konu | Önerim |
|---|---|---|
| 1 | Kontrol mimarisi (4.1) | Etiket ve kontrolü aynı shadow root'ta tutun; light DOM referansları için element reflection kullanın. Doğal `<input>` gerektiren yerde (checkbox, radio) içte gerçek doğal öğe kullanın. |
| 2 | Angular proxy deseni (4.3) | Evet, 1.0'dan önce. Seçici değişikliği kırıcıdır; 1.0'dan sonra daha pahalı olur. |
| 3 | Angular form API'si | `FormValueControl` / `FormCheckboxControl`. Checkbox ve Switch'teki `value` girdisinin adını değiştirin, çünkü `FormCheckboxControl` bu adı yasaklıyor. |
| 4 | Ortak sözlük (4.6) | `tone` her yerde; Button 1.0'dan önce taşınsın; tek uyarı tonu. |
| 5 | Marka yeşili | Metin için ayrı, koyu bir token; dolgu için mevcut yeşil. |
| 6 | Yayın düzeni | Önce 4.8'i düzeltin, sonra yayınlayın. npm sürümü kilometre taşını izlesin; iç «v0.x» adlarını bırakın ya da `milestone-NN` yapın. |
| 7 | Overlay motoru | JS motoru kalsın; kaydırma ve boyut değişiminde güncelleme ekleyin; CSS Anchor ilerletme katmanı olsun. |
| 8 | Maske motoru | Olgun bir kütüphane (Maskito) kullanın. Kendi motorunuzu yeniden yazmanın maliyeti yüksek. |
| 9 | Aksiyonlu toast | Varsayılan olarak açık kalsın. 5 saniyede kaybolan bir aksiyona klavye kullanıcısı yetişemez. |
| 10 | i18n kaydı | Şimdi ekleyin. Combobox ve DatePicker daha çok metin getirecek. |
| 11 | Token kaynak formatı | DTCG 2025.10 formatına geçin ya da en azından DTCG dışa aktarımı ekleyin. Figma ve Style Dictionary uyumu ticari yol için gerekli. |
| 12 | Playground içeriği | Tek kaynaktan üretin. İki elle yazılmış set bakımda kayıyor. |
| 13 | Tarayıcı matrisi | Firefox ve WebKit'i şimdi ekleyin. `:host-context` hatası bunun neden gerekli olduğunu gösteriyor. |

---

## 7. İyi yapılanlar

- Lit yapılandırması (`experimentalDecorators`, `useDefineForClassFields: false`) doğru ve güncel. Değiştirmeyin.
- Core ve shell'de bileşen başına subpath exports var, CI'da sapma kontrolü var.
- 3 katmanlı token niyeti net. İlkel token kullanımını engelleyen lint kuralı var.
- Reduced motion animasyonu kapatmak yerine sakin bir alternatife geçiyor.
- Popover ve tooltip odak yönetimi ve Escape davranışı APG'ye uygun.
- Radio group ve ButtonGroup klavye gezintisi doğru çalışıyor.
- Listener temizliği disiplinli. Modül kapsamında `window`/`document` kullanımı yok (SSR güvenli).
- Saf ve test edilebilir çekirdek birimler var: keymap, active-index, filter, positioner, queue.
- Angular wrapper'ları tamamen sinyal tabanlı; RxJS bağımlılığı yok.
- Vue router entegrasyonu örnek alınacak düzeyde; Angular bunu kopyalamalı.
- Playground paritesi 23 sayfanın 21'inde mekanik olarak birebir.

---

## 8. Doğrulama

Ajan bulgularının en ağırlarını kendim yeniden kontrol ettim:

| Bulgu | Kontrol | Sonuç |
|---|---|---|
| K1 | `tulpar-select.ts` `_renderListbox` | Arama kutusu `role=listbox` içinde. Doğru. |
| CB-2 / AX-2 | `form-field-base.ts:268` | `<label for="control">` bir `div` öğesini gösteriyor. Doğru. |
| CB-1 / AX-4 | `active-descendant-controller.ts:87` | ID metni ile atanıyor. Doğru. |
| TOK-1 | tokens paketinde `selection-message` araması | Token yok. Doğru. |
| TOK-8 | core'da `:host-context` sayımı | 36 kullanım. Doğru. |
| CA-1 | `setValidity` araması | 0 sonuç. Doğru. |
| CA-20 / INF-5 | `dist/warn-dev-*.js` | `{DEV:false, PROD:true}` gömülü. Doğru. |
| INF-1 | Angular dist | 0 `ɵɵngDeclareComponent`, 25 `ɵɵdefineComponent`. Doğru. |
| INF-2 | shell dist | `litHtmlVersions` içeriyor. Doğru. |
| DOC-19 / WR-4 | Angular'da CVA araması | 0 dosya. Doğru. |
| DOC-2 | Angular README:72 | `<tulpar-popover-ng>` var, kodda yok. Doğru. |
| WR-1 | Vue playground ekran görüntüsü | TextInput etiketleri görünmüyor. Doğru. |
| VIS-1 | Vue playground ekran görüntüsü | NumberInput çizilmiyor. Doğru. |

Testler: build, lint ve tüm paket testleri inceleme dalında geçti (tokens 197, core 1.371, shell 103, angular 202, vue 244).

---

## 9. Bu inceleme sırasında yapılan değişiklikler

- `chore/node-26-lts` dalı (commit `1f20184`, push edilmedi): `.nvmrc` 26.13.0, `engines` ≥ 26.13.0, `deploy.yml` artık `.nvmrc` okuyor, `@types/node` ^26, CLAUDE.md Node satırı.
- `review/retro-2026-11-11` yerel dalı. Push edilmeyecek; incelemeden sonra silinebilir.
- `graphify-out/` yalnız yerel `.git/info/exclude` dosyasına eklendi.
- `stash@{0}`: `packages/core/package.json` CRLF farkı (içerik farkı yok).
- Bu klasör (`docs/reviews/2026-11-11-retrospective/`) henüz commit edilmedi.
- Ekran görüntüleri (71 MB) repoya konmadı; oturumun geçici klasöründe duruyor.
