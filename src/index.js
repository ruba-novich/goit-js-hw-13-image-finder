import './css/styles.css';

import ApiService from './js/apiService';

import photoCardTpl from './templates/photo-card.hbs';
import openModal from './js/open-modal';
import getRefs from './js/get-refs';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { info } from '@pnotify/core';

const apiService = new ApiService ();
const debounce = require('lodash.debounce');
const refs = getRefs();
const observer = new IntersectionObserver(onEntry, {
    rootMargin: '150px',
});

refs.gallery.addEventListener('click', openModal);

apiService.fetchHits()

observer.observe(refs.scroll);

refs.searchInput.addEventListener('input', debounce(onSearch, 500));


function onSearch(e) {
  e.preventDefault();
   
  apiService.query = e.target.value;
 
  if (!apiService.query) {
    clearHits();
    return
  }

  apiService.resetPage();
  clearHits();
  apiService.fetchHits().then(hits => {
    appendHitsMarkup(hits);
    apiService.incrementPage();
  });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(hits));
}

function clearHits() {
  refs.gallery.innerHTML = '';
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '') {
        apiService.fetchHits().then(hits => {
        appendHitsMarkup(hits);
        apiService.incrementPage();
      });
    }
  });
}