# Design System & UI Specification: PRM UKM (Soft Neo-Brutalism)

Dokumen ini berisi spesifikasi sistem desain visual (**UI/UX Design System**) untuk **Sistem Informasi Pendaftaran & Monitoring UKM (PRM)** dengan menerapkan konsep **Soft Neo-Brutalism** — kombinasi antara kontur tegas Neo-Brutalist dengan sentuhan ramah, ceria, modern, dan sangat bersih.

---

## 🎨 1. Filosofi & Karakter Visual Utama

* **Aliran:** Soft Neo-Brutalism (Perpaduan kontur tegas + warna cerah + sudut membulat `rounded-xl` / `1rem`).
* **Vibe:** Berani, enerjik, tidak kaku (non-klinis), ramah mahasiswa, interaktif, dan sangat *clean*.
* **Ciri Khas Utama:**
  * **Border Hitam Dark Ink:** Garis tepi 3px - 5px (`#1D1C1C`).
  * **Hard Drop Shadow:** Bayangan tegas solid tanpa blur (`box-shadow: 0 4px 0 #1D1C1C` / `shadow-[4px_4px_0px_#1D1C1C]`).
  * **Tipografi Raksasa Bold:** Font judul rapat dan kuat (Inter Tight / Plus Jakarta Sans) dalam huruf KAPITAL (*UPPERCASE*).
  * **Highlight Badges Miring (Tilted Badges):** Kata kunci dibungkus blok berwarna kontras dengan rotasi `-2°` atau `-3°`.
  * **Background Noise & Gradient:** Animated soft gradient (`#83F582` → `#FFF48D` → `#FFB88C`) dengan bintik grid radial transparan.

---

## 🎨 2. Palet Warna (Color Palette)

| Kategori | Nama Warna | Hex Code | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Dark Ink (Kontras)** | Charcoal Black | `#1D1C1C` / `#2B2A28` | Teks utama, border 3px-5px, hard drop shadow solid. |
| **Animated Background Gradient** | Neon Green → Warm Yellow → Peach | `#83F582` → `#FFF48D` → `#FFB88C` | Latar belakang utama dengan animasi perubahan posisi gradien pelan. |
| **Accent Primary** | Bright Warm Yellow | `#FFF48D` | Kartu sorotan, tombol utama (Submit), blok kata miring (*tilted badge*). |
| **Accent Secondary** | Light Cyan / Blue | `#7AF7F7` | Stiker melayang *"100% Anonim / Terverifikasi"*, badge filter. |
| **Accent Warm** | Peach / Warm Orange | `#FFB88C` | Kartu fitur terverifikasi, aksen kutipan & banner. |
| **Emergency / Crisis** | Coral Red | `#D64545` | Tombol batal, status penolakan (`REJECTED`), alert error. |
| **Card White** | Pure / Cream White | `#FFFFFF` / `#FAF7F2` | Latar belakang kartu form, modal, & tombol sekunder. |

---

## 📦 3. Komponen & Aturan UI (UI Components)

### A. Kartu Brutalist (`.brutalist-card`)
Semua elemen kartu, container form, dan kotak input wajib menggunakan aturan ini:

```css
.brutalist-card {
  border: 3px solid #1D1C1C;
  box-shadow: 0 4px 0 #1D1C1C;
  border-radius: 1rem; /* 16px membulat agar ramah & modern */
  background-color: #FFFFFF;
}

.brutalist-card-interactive {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.brutalist-card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 0 #1D1C1C;
}
```

### B. Tilted Highlight Badge (Blok Teks Miring)
Kata kunci utama dibungkus dalam blok berwarna kontras dengan rotasi miring:

```html
<span class="inline-block bg-[#1D1C1C] text-[#FFF48D] px-5 py-1.5 rounded-[2rem] font-black text-sm uppercase tracking-wider transform -rotate-2 border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]">
  1 MAHASISWA = 1 UKM
</span>
```

### C. Stiker Melayang (Circular Floating Badge)
Elemen lingkaran ber-border 4px dengan rotasi dan bayangan solid:

```html
<div class="w-20 h-20 bg-[#7AF7F7] border-4 border-[#1D1C1C] rounded-full flex items-center justify-center font-black text-xs uppercase text-center transform rotate-12 shadow-[4px_4px_0px_#1D1C1C]">
  Resmi Kampus
</div>
```

### D. Latar Belakang Gradien Beranimasi (`.animated-gradient`)
```css
@keyframes gradient-bg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(121deg, #83F582 0%, #FFF48D 50%, #FFB88C 100%);
  background-size: 200% 200%;
  animation: gradient-bg 12s ease infinite;
}
```

### E. Noise Texture Overlay (Dot Grid Matrix)
```html
<div class="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#1D1C1C_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none z-0"></div>
```

---

## ⚡ 4. Spesifikasi Komponen React / Tailwind (Starter Components)

### 1. Primary Button (`BrutalistButton.tsx`)
```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'green' | 'cyan' | 'red';
  children: React.ReactNode;
}

export const BrutalistButton: React.FC<ButtonProps> = ({
  variant = 'yellow',
  children,
  className = '',
  ...props
}) => {
  const bgColors = {
    yellow: 'bg-[#FFF48D] hover:bg-[#ffe83d]',
    green: 'bg-[#83F582] hover:bg-[#62f261]',
    cyan: 'bg-[#7AF7F7] hover:bg-[#4ff5f5]',
    red: 'bg-[#D64545] text-white hover:bg-[#c33333]',
  };

  return (
    <button
      className={`border-3 border-[#1D1C1C] ${bgColors[variant]} text-[#1D1C1C] font-extrabold px-6 py-3.5 rounded-xl shadow-[4px_4px_0px_#1D1C1C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1D1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 2. Input Control (`BrutalistInput.tsx`)
```tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const BrutalistInput: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-black text-xs uppercase tracking-wider text-[#1D1C1C] flex items-center gap-1.5">
        <span className="w-2 h-2 bg-[#1D1C1C] rounded-full"></span>
        {label}
      </label>
      <input
        className={`bg-white border-3 border-[#1D1C1C] p-3.5 font-bold text-[#1D1C1C] rounded-xl shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/20 focus:shadow-[5px_5px_0px_#1D1C1C] transition-all placeholder:text-stone-400 ${className}`}
        {...props}
      />
    </div>
  );
};
```

### 3. Status Badge (`StatusBadge.tsx`)
```tsx
import React from 'react';

type StatusType = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  const styles = {
    PENDING: 'bg-[#FFF48D] text-[#1D1C1C] -rotate-1',
    ACCEPTED: 'bg-[#83F582] text-[#1D1C1C] rotate-1',
    REJECTED: 'bg-[#D64545] text-white -rotate-1',
    CANCELLED: 'bg-stone-200 text-stone-700 rotate-1',
  };

  const labels = {
    PENDING: '⏳ Menunggu Verifikasi',
    ACCEPTED: '✅ Disetujui (Anggota)',
    REJECTED: '❌ Ditolak',
    CANCELLED: '🚫 Dibatalkan',
  };

  return (
    <span className={`inline-block border-2 border-[#1D1C1C] px-3.5 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_#1D1C1C] transform ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};
```

---

## 🛠️ Stack Teknis Rekomendasi
* **Framework:** Next.js (App Router) + Tailwind CSS
* **Motion & Animation:** `framer-motion` (Spring pop-up & ambient hover)
* **Smooth Scroll:** `lenis`
* **Icons:** `lucide-react`
