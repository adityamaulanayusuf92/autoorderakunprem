# ⚡ QUICK START GUIDE

## 🚀 Mulai Develop dalam 5 Menit

### Step 1: Setup
```bash
cd /workspaces/autoorderakunprem/frontend
npm install --legacy-peer-deps
npm run dev
# Visit http://localhost:3000
```

---

## 📦 Komponen yang Sering Dipakai

### Import Component
```jsx
import FloatingBackground from '@/components/FloatingBackground';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
```

---

## 🎨 CSS Classes Cheat Sheet

### Glassmorphism
```jsx
<div className="glass rounded-lg p-4">Light glass</div>
<div className="glass-md rounded-xl p-6">Medium glass</div>
<div className="glass-lg rounded-2xl p-8">Heavy glass</div>
```

### Glow Effects
```jsx
<div className="glow-primary">Blue glow</div>
<div className="glow-neon-pink">Pink glow</div>
<h1 className="glow-text">Text glow</h1>
```

### Gradients
```jsx
<button className="gradient-primary text-white">Primary</button>
<div className="gradient-neon">Neon gradient</div>
<h1 className="gradient-text">Text gradient</h1>
```

### Animations
```jsx
<div className="animate-fade-up">Fade up</div>
<div className="animate-shimmer">Shimmer</div>
<div className="animate-float">Float</div>
```

---

## ⚡ Framer Motion Quick Tips

### Fade Up on Scroll
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
>
  Content
</motion.div>
```

### Button Hover
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.button>
```

### Stagger Children
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {items.map((item) => (
    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🔔 Notifications

### Success
```jsx
toast.success('✅ Berhasil!');
```

### Error
```jsx
toast.error('❌ Error!');
```

### Loading
```jsx
const id = toast.loading('⏳ Loading...');
// Later:
toast.success('Done!', { id });
```

---

## 📱 Responsive Utilities

### Hide/Show
```jsx
<div className="hidden md:block">Tablet+</div>
<div className="md:hidden">Mobile only</div>
```

### Grid Responsive
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(...)}
</div>
```

### Padding Responsive
```jsx
<div className="px-4 md:px-8 lg:px-12">
  Content
</div>
```

---

## 🧠 Common Patterns

### Loading State Pattern
```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState([]);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const res = await api.get();
    setData(res.data);
  } catch (err) {
    setError(err.message);
    toast.error('Failed to load');
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {loading && <LoadingSkeleton />}
    {error && <EmptyState icon="❌" onRetry={loadData} />}
    {!loading && !error && data.length === 0 && <EmptyState />}
    {!loading && data.length > 0 && <GridView items={data} />}
  </>
);
```

---

## 🎯 File Structure

```
frontend/
├── app/
│   ├── layout.jsx          ← ToastProvider di sini
│   ├── globals.css         ← Semua CSS di sini
│   ├── page.jsx            ← Home page
│   └── (main)/
│       ├── products/page.jsx
│       ├── cart/page.jsx
│       └── ...
├── components/
│   ├── FloatingBackground.jsx  (new)
│   ├── EmptyState.jsx          (new)
│   ├── LoadingSkeleton.jsx
│   ├── ProductCard.jsx
│   ├── Navbar.jsx
│   └── ...
├── lib/
│   ├── api.js
│   └── store.js
├── tailwind.config.js      ← Themes & animations
└── package.json
```

---

## 🔥 Hot Tips

### 1. Always use `glass` untuk cardsmodern
```jsx
// Jarang: <div className="bg-dark-light border">
// Often: <div className="glass rounded-lg">
```

### 2. Add glow ke primary buttons
```jsx
<button className="gradient-primary glow-primary hover:glow-primary-xl">
```

### 3. Use FloatingBackground di halaman penting
```jsx
export default function Page() {
  return (
    <div className="relative">
      <FloatingBackground />
      <div className="relative z-10">Content</div>
    </div>
  );
}
```

### 4. Wrap API calls dengan error handling
```jsx
try {
  await api.call();
  toast.success('Done');
} catch (error) {
  toast.error(error.message);
}
```

### 5. Use proper animation durations
```jsx
transition={{ duration: 0.3 }}     // Micro-interactions
transition={{ duration: 0.6 }}     // Page transitions
transition={{ duration: 2 }}       // Background animations
```

---

## 🚨 Common Mistakes

### ❌ Wrong - SSR Issue
```jsx
if (window.innerWidth > 768) { ... }
```

### ✅ Right - SSR Safe
```jsx
if (typeof window !== 'undefined' && window.innerWidth > 768) { ... }
```

---

### ❌ Wrong - Bad Animation Performance
```jsx
whileHover={{ marginLeft: 20 }}  // Causes layout thrash
```

### ✅ Right - GPU Accelerated
```jsx
whileHover={{ x: 20 }}  // Uses transform
```

---

### ❌ Wrong - Missing Toast Provider
```jsx
// No ToastProvider in layout
toast.success('This wont show');
```

### ✅ Right - Proper Setup
```jsx
// In layout.jsx
<ToastProvider />
```

---

## 📚 Resources

- **Colors**: `tailwind.config.js`
- **Animations**: `tailwind.config.js` keyframes
- **CSS Utils**: `app/globals.css`
- **Components**: `components/` folder
- **Docs**: `DEVELOPER_GUIDE.md`

---

## 💡 Examples

### Full Featured Page
```jsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import FloatingBackground from '@/components/FloatingBackground';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // API call here
      setData([...]);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <FloatingBackground />
      <div className="relative z-10 min-h-screen py-12 px-4">
        {loading && <LoadingSkeleton />}
        {error && <EmptyState icon="❌" onRetry={loadData} />}
        {!loading && !error && data.length === 0 && <EmptyState />}
        {data.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Content */}
          </motion.div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎉 You're Ready!

Start building amazing pages! 🚀

**Questions?** Check `DEVELOPER_GUIDE.md` for detailed info.

---

Last Updated: April 27, 2026
