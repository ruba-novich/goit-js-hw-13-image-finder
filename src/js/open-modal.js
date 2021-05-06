import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';


export default function openModal(e) {
    e.preventDefault();
    console.log(e.target.dataset.source);

    if (e.target.nodeName !== 'IMG') {
        return 
    }
    else {
        basicLightbox.create(
            `<div class="modal">
            <p>
            <img src="${e.target.dataset.source}">
            </p>
            </div>`
        ).show()
    }
}

