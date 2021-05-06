import './css/styles.css';

import ApiService from './js/apiService';

import photoCardTpl from './templates/photo-card.hbs';
import openModal from './js/open-modal';
import getRefs from './js/get-refs';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

const apiService = new ApiService ();

const refs = getRefs();
const observer = new IntersectionObserver(onEntry, {
    rootMargin: '150px',
});

refs.gallery.addEventListener('click', openModal);



observer.observe(refs.scroll);

refs.searchInput.addEventListener('submit', onSearch);

async function onSearch(e) {
  try {
    e.preventDefault();
   
    apiService.query = e.currentTarget.elements.query.value;
 
    if (apiService.query === '' || !apiService.query.trim()) {
      onSearchError()
      return
    }

    await apiService.resetPage();

    await clearHits();
    
    const hits = await apiService.fetchHits({})
    // console.log(hits);
    if(hits.length === 0){
      onSearchError()
      return
    }
    await appendHitsMarkup(hits)
    
    } catch (err){
      onFetchError()
    }
    
}

function appendHitsMarkup (hits) {
    hitsMarkup(hits)
    apiService.incrementPage()
  }

function hitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(hits));
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (apiService.query !== '') {
        apiService.fetchHits()
        .then(hits => {
          hitsMarkup(hits);
          apiService.incrementPage();
        });
    }
  });
}

function onFetchError() {
  error({
    title: 'Fetch Error',
    text: 'Runtime errors'
  });
}

function onSearchError() {
  error({
    title: 'Search Error',
    text: 'Incorrect search value. Please enter a more precise value!'
  });
}

function clearHits() {
  refs.gallery.innerHTML = '';
}