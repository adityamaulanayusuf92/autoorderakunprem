# 👨‍💻 DEVELOPER GUIDE - Komponen & Utilities Baru

## 📦 Komponen Baru

### 1. FloatingBackground Component

**File**: `components/FloatingBackground.jsx`

**Usage**:
```jsx
import FloatingBackground from '@/components/FloatingBackground';

export default function Page() {
  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      {/* Your content with z-10 or higher */}
      <div className="relative z-10">Content here</div>
    </div>
  );
}
```

**Features**:
- 3 animasi blobs dengan durasi berbeda
- Smooth float animation
- Opacity 0.05 untuk subtle effect
- Gradient dari biru → ungu → pink

**Customization**:
```javascript
// Edit blobs array untuk mengubah:
- size: width/height pixel
- top/left: position
- color: gradient class
- duration: animation duration in seconds
- delay: stagger delay
```

---

### 2. EmptyState Component

**File**: `components/EmptyState.jsx`

**Usage**:
```jsx
import EmptyState from '@/components/EmptyState';

// Basic empty state
<EmptyState 
  icon="📦"
  title="Tidak Ada Produk"
  description="Produk tidak tersedia saat ini"
/>

// With retry button
<EmptyState
  icon="❌"
  title="Gagal Memuat"
  description="Silakan coba lagi"
  onRetry={() => loadProducts()}
/>
```

**Props**:
- `icon` (string): Emoji/icon untuk ditampilkan
- `title` (string): Main heading
- `description` (string): Deskripsi
- `onRetry` (function, optional): Callback untuk retry button

**Features**:
- Animated floating icon
- Glow ring animation
- Retry button optional
- Responsive design

---

### 3. LoadingSkeleton Component (Upgraded)

**File**: `components/LoadingSkeleton.jsx`

**Usage**:
```jsx
import LoadingSkeleton from '@/components/LoadingSkeleton';

// Default 6 items
{loading ? <LoadingSkeleton /> : <Contents />}

// Custom count
<LoadingSkeleton count={12} />
```

**Props**:
- `count` (number, default: 6): Berapa skeleton cards

**Features**:
- Modern shimmer animation
- Stagger animation untuk items
- Grid layout matching products
- Smooth fade-in

---

### 4. Navbar Component (Enhanced)

**Features Added**:
- ✅ Sticky positioning dengan blur on scroll
- ✅ Logo rotate hover animation
- ✅ Link underline animation
- ✅ Mobile menu smooth slide
- ✅ Menu icon rotate animation
- ✅ Cart badge scale animation

**Usage**: Sudah terintegrasi di `layout.jsx`

**Customization**:
```jsx
// Edit categories/links
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
];
```

---

### 5. ProductCard Component (Enhanced)

**Features Added**:
- ✅ Glassmorphism border
- ✅ Hover scale animation
- ✅ Ripple effect on click
- ✅ Glow animation
- ✅ Micro-interactions
- ✅ Gradient price text

**Usage**:
```jsx
import ProductCard from '@/components/ProductCard';

<ProductCard 
  product={product}
  onBuy={handleBuy}
/>
```

**Props**:
- `product` (object): Product data
- `onBuy` (function): Callback saat klik beli

---

### 6. ToastProvider Component (Enhanced)

**Features Added**:
- ✅ Center positioning (top-center)
- ✅ Glassmorphism background
- ✅ Glow border effect
- ✅ Per-state styling
- ✅ Smooth animations

**Usage**: Sudah terintegrasi di `layout.jsx`

**Toast Notifikasi**:
```jsx
import toast from 'react-hot-toast';

// Success
toast.success('✅ Berhasil!');

// Error
toast.error('❌ Error!');

// Loading
toast.loading('⏳ Loading...');

// Custom
toast((t) => (
  <div>Custom Content</div>
));
```

---

## 🎨 CSS Utilities

### Glassmorphism Classes

```css
/* Light glass */
.glass {
  background: rgba(10, 14, 39, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* Medium glass */
.glass-md {
  background: rgba(10, 14, 39, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 102, 241, 0.25);
}

/* Heavy glass */
.glass-lg {
  background: rgba(10, 14, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.3);
}
```

**Usage**:
```jsx
<div className="glass rounded-lg p-4">
  Content dengan glass effect
</div>
```

---

### Glow Effects

```css
.glow-primary          /* Blue glow 20px */
.glow-primary-xl       /* Blue glow 30px */
.glow-secondary        /* Purple glow */
.glow-neon-blue        /* Cyan glow */
.glow-neon-pink        /* Pink glow */
.glow-text             /* Text shadow glow */
.glow-text-neon        /* Neon text glow */
.glow-pulse            /* Pulsing animation */
.glow-pulse-fast       /* Fast pulsing */
```

**Usage**:
```jsx
<button className="glow-primary hover:glow-primary-xl">
  Button dengan glow
</button>
```

---

### Gradient Classes

```css
.gradient-primary      /* Blue → Purple */
.gradient-neon         /* Cyan → Pink */
.gradient-dark         /* Dark background */
.gradient-text         /* Text gradient (requires bg-clip) */
```

**Usage**:
```jsx
<button className="gradient-primary text-white">
  Tombol Gradient
</button>

<h1 className="gradient-text">
  Text dengan Gradient
</h1>
```

---

### Shadow Classes

```css
.soft-shadow          /* 8px soft shadow + glow */
.soft-shadow-lg       /* Larger soft shadow + glow */
```

---

### Animation Classes

```css
.animate-fade-up       /* Fade up animation */
.animate-fade-down     /* Fade down animation */
.animate-fade-in       /* Simple fade */
.animate-glow-pulse    /* Pulsing glow */
.animate-float         /* Floating effect */
.animate-shimmer       /* Shimmer animation */
```

**Usage**:
```jsx
<div className="animate-fade-up">
  Element dengan fade up animation
</div>
```

---

## 🎬 Animation Patterns

### Stagger Container + Items

```jsx
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay antar child
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Usage
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

### Scroll Reveal Animation

```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  Content muncul saat scroll ke view
</motion.div>
```

---

### Hover Scale Animation

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Scalable Button
</motion.button>
```

---

### Loading State Pattern

```jsx
const [loading, setLoading] = useState(true);

return (
  <>
    {loading ? (
      <LoadingSkeleton count={6} />
    ) : error ? (
      <EmptyState 
        icon="❌"
        title="Error"
        onRetry={handleRetry}
      />
    ) : data.length === 0 ? (
      <EmptyState
        icon="📦"
        title="Empty"
      />
    ) : (
      <ProductGrid products={data} />
    )}
  </>
);
```

---

## 🎯 Best Practices

### 1. Always Use Relative Z-Index for FloatingBackground

```jsx
<div className="relative">
  <FloatingBackground />
  <div className="relative z-10">Your content</div>
</div>
```

### 2. Wrap Toast Calls with Error Handling

```jsx
try {
  const result = await api.call();
  toast.success('✅ Success!');
} catch (error) {
  toast.error('❌ ' + error.message);
}
```

### 3. Always Set Retry Limit

```jsx
const handleRetry = () => {
  if (retryCount < 3) {
    setRetryCount(retryCount + 1);
    loadData();
  } else {
    toast.error('Max retries reached');
  }
};
```

### 4. Use Glass for Modern UI

```jsx
// ❌ Don't do this:
<div className="bg-dark-light border border-primary/30">

// ✅ Do this:
<div className="glass rounded-lg">
```

### 5. Always Add Glow on Prime Buttons

```jsx
// ❌ Wrong:
<button className="gradient-primary">

// ✅ Right:
<button className="gradient-primary glow-primary hover:glow-primary-xl">
```

---

## 📱 Responsive Utilities

### Tailwind Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Usage**:
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

<div className="hidden md:block">
  Only show on tablet+
</div>
```

---

## 🔍 Troubleshooting

### "window is not defined" Error
```jsx
// ❌ Wrong (SSR issue):
if (window.innerWidth > 768) { ... }

// ✅ Right:
if (typeof window !== 'undefined' && window.innerWidth > 768) { ... }
```

---

### Toast Not Appearing
```jsx
// Make sure ToastProvider di layout.jsx
<Toaster position="top-center" />
```

---

### Animation Not Smooth
```jsx
// ✅ Use transform instead of position
whileHover={{ x: 10 }}        // Good
whileHover={{ marginLeft: 10 }} // Bad (layout thrash)
```

---

### Glassmorphism Not Working
```jsx
// ✅ Make sure parent has overflow hidden or proper bg
<div className="overflow-hidden">
  <div className="glass">Content</div>
</div>
```

---

## 📚 Additional Resources

### Tailwind Config
- Location: `tailwind.config.js`
- Extended colors, animations, shadows

### Global Styles
- Location: `app/globals.css`
- All custom CSS utilities defined here

### Framer Motion Docs
- https://www.framer.com/motion/

### Tailwind CSS Docs
- https://tailwindcss.com/

---

## 🚀 Performance Tips

1. **Use transform + opacity** untuk animations (GPU accelerated)
2. **Lazy load images** dengan built-in Next.js Image component
3. **Use motion.div sparingly** untuk complex animations
4. **Memoize heavy components** yang tidak perlu re-render
5. **Use will-change sparingly** hanya untuk frequently animated elements

---

**Last Updated**: April 27, 2026
**Status**: ✅ Complete & Ready
