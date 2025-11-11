import React, {useEffect, useState} from 'react'
import Gallery from './components/Gallery'
import ContactForm from './components/ContactForm'

export default function App(){
  const [photos, setPhotos] = useState([])
  const [theme, setTheme] = useState('dark')

  useEffect(()=>{
    fetch('/api/photos')
      .then(r=>r.json())
      .then(setPhotos)
      .catch(err=>console.error(err))
  },[])

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
  },[theme])

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="/">Finitiv</a>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </nav>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <button className="btn btn-outline" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>Toggle</button>
          </div>
        </div>

        <div className="hero">
          <div className="container hero-inner">
            <h1 className="hero-title">Moments, Crafted.</h1>
            <p className="hero-sub">A bold, modern approach to wedding & event photography — cinematic, editorial and unforgettable.</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#portfolio">Explore the Work</a>
              <a className="btn btn-outline" href="#contact">Inquire</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section container">
          <div className="about-grid">
            <div>
              <h2>About Finitiv</h2>
              <p>We craft images with a cinematic eye for emotion, texture and light. Our work blends modern editorial compositions with authentic moments.</p>
              <p>We shoot with intention—every frame is composed to feel timeless yet fresh.</p>
            </div>
            <div className="about-image" aria-hidden="true"></div>
          </div>
        </section>

        <section id="portfolio" className="section container">
          <h2>Portfolio</h2>
          <Gallery photos={photos} />
        </section>

        <section id="contact" className="section container contact-section">
          <div className="contact-card">
            <h2>Contact</h2>
            <p>Ready to tell your story? Message us and we'll reply with packages and availability.</p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Finitiv</p>
        </div>
      </footer>
    </div>
  )
}
