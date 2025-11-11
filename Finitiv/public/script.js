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

    photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        photoItem.innerHTML = `
            <img src="${photo.image_url}" alt="${photo.title}">
            <h3>${photo.title}</h3>
            <p>${photo.description}</p>
        `;

        gallery.appendChild(photoItem);
    });
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