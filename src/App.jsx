import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tight text-slate-800">Arctic Appliances</Link>
          <nav className="flex items-center gap-6 text-slate-600">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <Link to="/products" className="hover:text-slate-900">Products</Link>
            <Link to="/contact" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Hero({ settings }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              {settings?.hero_title || 'Premium White Goods'}
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              {settings?.hero_subtitle || 'Reliable appliances for every home.'}
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/products" className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition">Shop Now</Link>
              <a href="#featured" className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-white">Explore</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop" alt="Appliances" className="w-full h-full object-cover opacity-70"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 hover:shadow-lg transition bg-white">
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
        <img src={p.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop'} alt={p.name} className="w-full h-full object-cover"/>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-slate-900">{p.brand} {p.name}</h3>
        <p className="text-slate-600 text-sm line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">${p.price.toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded ${p.in_stock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{p.in_stock ? 'In stock' : 'Out of stock'}</span>
        </div>
      </div>
    </div>
  )
}

function ProductsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products`)
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function ContactPage() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setStatus(data)
      if (res.ok) setForm({ name: '', email: '', message: '' })
    } catch (e) {
      setStatus({ error: e.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Message</label>
          <textarea value={form.message} onChange={(e)=>setForm(f=>({...f,message:e.target.value}))} rows="5" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" required />
        </div>
        <button disabled={submitting} className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50">{submitting ? 'Sending...' : 'Send Message'}</button>
      </form>
      {status && (
        <div className="mt-4 text-sm bg-slate-50 border border-slate-200 p-3 rounded">
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

function Home() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [settings, setSettings] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          fetch(`${baseUrl}/api/settings`).then(r=>r.json()),
          fetch(`${baseUrl}/api/products`).then(r=>r.json())
        ])
        setSettings(s)
        setProducts(p.slice(0, 6))
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  return (
    <>
      <Hero settings={settings} />
      <section id="featured" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link to="/products" className="text-slate-700 hover:text-slate-900">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-sm text-slate-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Arctic Appliances</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Shell() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
