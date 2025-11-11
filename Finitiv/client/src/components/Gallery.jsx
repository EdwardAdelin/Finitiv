import React, {useState} from 'react'

export default function Gallery({photos}){
  const [lightbox, setLightbox] = useState({open:false,index:0})

  const open = (i)=> setLightbox({open:true,index:i})
  const close = ()=> setLightbox({open:false,index:0})
  const next = ()=> setLightbox(s=>({open:true,index:(s.index+1)%photos.length}))
  const prev = ()=> setLightbox(s=>({open:true,index:(s.index-1+photos.length)%photos.length}))

  if (!photos || photos.length === 0) return <p style={{color:'#9aa3b2'}}>No photos yet.</p>

  return (
    <>
      <div id="photo-gallery" className="gallery-grid">
        {photos.map((p,i)=> {
          const cls = i===0 ? 'photo-item featured reveal' : 'photo-item reveal'
          return (
            <article key={p.id||i} className={cls} onClick={()=>open(i)}>
              <img src={p.image_url} alt={p.title} loading="lazy"/>
              <div className="meta">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </article>
          )
        })}
      </div>

      {lightbox.open && photos[lightbox.index] && (
        <div id="lightbox" className="lb-backdrop" onClick={(e)=>{ if(e.target.classList.contains('lb-backdrop')) close() }}>
          <div className="lb-content">
            <button className="lb-close" onClick={close} aria-label="Close">×</button>
            <button className="lb-prev" onClick={prev} aria-label="Previous">‹</button>
            <button className="lb-next" onClick={next} aria-label="Next">›</button>
            <img src={photos[lightbox.index].image_url} alt={photos[lightbox.index].title} />
            <div className="lb-caption">
              <h3>{photos[lightbox.index].title}</h3>
              <p>{photos[lightbox.index].description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
