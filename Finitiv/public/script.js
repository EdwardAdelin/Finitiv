document.addEventListener('DOMContentLoaded', function() {
    fetchPhotos();
    setupContactForm();
});

function fetchPhotos() {
    fetch('/api/photos')
        .then(response => response.json())
        .then(photos => {
            displayPhotos(photos);
        })
        .catch(error => {
            console.error('Error fetching photos:', error);
        });
}

function displayPhotos(photos) {
    const gallery = document.getElementById('photo-gallery');
    gallery.innerHTML = '';

    // Use masonry column layout for a staggered presentation on wide screens
    const useMasonry = window.innerWidth > 760;
    if (useMasonry) gallery.classList.add('masonry'); else gallery.classList.remove('masonry');

    photos.forEach((photo, idx) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item reveal';

        photoItem.innerHTML = `
            <img src="${photo.image_url}" alt="${photo.title}" loading="lazy" data-index="${idx}">
            <div class="meta">
              <h3>${photo.title}</h3>
              <p>${photo.description}</p>
            </div>
        `;

        // open lightbox on click
        photoItem.addEventListener('click', () => openLightbox(photo, idx));

        gallery.appendChild(photoItem);
    });

    // reveal on scroll
    observeReveals();
}

// Lightweight lightbox
function openLightbox(photo, index) {
        let lb = document.getElementById('lightbox');
        if (!lb) {
                lb = document.createElement('div');
                lb.id = 'lightbox';
                lb.innerHTML = `
                    <div class="lb-backdrop" id="lb-backdrop">
                        <div class="lb-content">
                            <button class="lb-close" id="lb-close" aria-label="Close">×</button>
                            <button class="lb-prev" id="lb-prev" aria-label="Previous">‹</button>
                            <button class="lb-next" id="lb-next" aria-label="Next">›</button>
                            <img id="lb-img" src="" alt="">
                            <div class="lb-caption">
                                <h3 id="lb-title"></h3>
                                <p id="lb-desc"></p>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(lb);

                // close handlers
                document.getElementById('lb-backdrop').addEventListener('click', (e)=>{
                    if (e.target.id === 'lb-backdrop' || e.target.id === 'lb-close') closeLightbox();
                });
                document.getElementById('lb-close').addEventListener('click', closeLightbox);
                document.getElementById('lb-prev').addEventListener('click', ()=>navigateLightbox(-1));
                document.getElementById('lb-next').addEventListener('click', ()=>navigateLightbox(1));
                document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeLightbox(); if (e.key==='ArrowLeft') navigateLightbox(-1); if (e.key==='ArrowRight') navigateLightbox(1); });
        }

        document.getElementById('lb-img').src = photo.image_url;
        document.getElementById('lb-img').alt = photo.title;
        document.getElementById('lb-title').textContent = photo.title;
        document.getElementById('lb-desc').textContent = photo.description;
            lb.style.display = 'block';
            // store current index
            lb.dataset.current = index;
            preloadAdjacent(index);
}

function closeLightbox(){
        const lb = document.getElementById('lightbox');
        if (lb) lb.style.display = 'none';
}

function navigateLightbox(delta){
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const current = parseInt(lb.dataset.current || '0', 10);
    // grab gallery images to compute next index
    const imgs = Array.from(document.querySelectorAll('#photo-gallery img'));
    if (!imgs.length) return;
    let next = (current + delta + imgs.length) % imgs.length;
    const nextImg = imgs[next];
    if (nextImg) {
        const photo = { image_url: nextImg.src, title: nextImg.alt, description: nextImg.dataset.desc || '' };
        document.getElementById('lb-img').src = photo.image_url;
        document.getElementById('lb-img').alt = photo.title;
        document.getElementById('lb-title').textContent = photo.title;
        document.getElementById('lb-desc').textContent = photo.description;
        lb.dataset.current = next;
        preloadAdjacent(next);
    }
}

function preloadAdjacent(index){
    const imgs = Array.from(document.querySelectorAll('#photo-gallery img'));
    const prev = (index - 1 + imgs.length) % imgs.length;
    const next = (index + 1) % imgs.length;
    [prev, next].forEach(i=>{
        const img = new Image();
        img.src = imgs[i].src;
    });
}

function observeReveals(){
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)){
        items.forEach(i=>i.classList.add('in-view'));
        return;
    }
    const obs = new IntersectionObserver((entries, o)=>{
        entries.forEach(e=>{
            if (e.isIntersecting){
                e.target.classList.add('in-view');
                o.unobserve(e.target);
            }
        });
    },{threshold:0.12});
    items.forEach(i=>obs.observe(i));
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    const responseDiv = document.getElementById('form-response');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                responseDiv.innerHTML = '<p style="color: green;">' + result.message + '</p>';
                form.reset();
            } else {
                responseDiv.innerHTML = '<p style="color: red;">Error: ' + result.error + '</p>';
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            responseDiv.innerHTML = '<p style="color: red;">Error submitting form. Please try again.</p>';
        });
    });
}