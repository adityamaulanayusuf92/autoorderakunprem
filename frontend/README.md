# DOKZ STORE Frontend

Frontend Next.js 14 untuk DOKZ STORE - Premium Account Store.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run development server:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Build untuk Production

```bash
npm run build
npm start
```

## Fitur

- ✨ Dark neon UI dengan Tailwind CSS
- 🎨 Smooth animations dengan Framer Motion
- 📱 Mobile-first responsive design
- 🔐 Authentication dengan JWT
- 🛒 Shopping cart management
- 📦 Order tracking  
- 👥 User dashboard
- 🎛️ Admin panel

## Struktur

```
app/
├── (auth)/          - Auth pages (login, register)
├── (main)/          - Main pages (home, products, cart, dashboard)
├── admin/           - Admin panel
└── layout.jsx       - Root layout

components/
├── Navbar.jsx       - Navigation
├── Footer.jsx       - Footer
├── ProductCard.jsx  - Product display
└── ...

lib/
├── api.js           - API calls
├── store.js         - Zustand store
└── utils.js         - Utilities
```

## Pages

- `/` - Home
- `/products` - Product listing
- `/cart` - Shopping cart
- `/dashboard` - User dashboard
- `/login` - Login
- `/register` - Register
- `/admin` - Admin panel
- `/orders/[id]` - Order detail
