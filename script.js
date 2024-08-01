'use strict';

const countriesContainer = document.querySelector('.countries--container');
const searchBar = document.querySelector('.search-box');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalCloseBtn = document.querySelector('.modal--button-close');
const modalCountryName = document.querySelector('.modal--country-name');
const neighboringContainer = document.querySelector(
  '.modal--neighboring-container'
);
const neighboringFlags = document.querySelector('.modal--neighboring-flags');
const modalPop = document.querySelector('.modal--population');
const modalLang = document.querySelector('.modal--language');
const modalHeaderImg = document.querySelector('.modal--header-img');

//for testing
const h1 = document.querySelector('h1');

// Event lisiners
class App {
  #countries = [];

  constructor() {
    this._renderCountries();

    searchBar.addEventListener('keyup', this._searchForCountry.bind(this));
    countriesContainer.addEventListener('click', this._openModal.bind(this));
    modalCloseBtn.addEventListener('click', this._closeModal.bind(this));

    //for testing
    h1.addEventListener('click', this.test.bind(this));
  }
  ///////////////////////////////////////////
  // Getting & displaying countries
  async _getAllCountries() {
    try {
      const res = await fetch('https://restcountries.com/v3.1/all');
      if (!res.ok) throw new Error('Could not find countries');

      const data = res.json();

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  _renderCountries() {
    this._getAllCountries().then(res => {
      this.#countries.push(res);
      res.forEach(country => {
        this._renderCountry(country);
      });
    });
  }

  _renderCountry(country) {
    let cur = Object.values(country.currencies || {})[0];
    let curSymbol;
    let region;

    if (cur !== undefined) {
      cur = Object.values(country.currencies || {})[0].name;
      curSymbol = Object.values(country.currencies || {})[0].symbol;
    }

    if (country.subregion) region = country.subregion;
    else region = country.region;

    const html = `
    <div class="country" data-id = "${country.altSpellings[0]}">
        <img
          class="country-flag"
          src="${country.flags.svg}"
          alt="${country.flags.alt}"
        />

        <div class="country--location">
          <h2 class="country--name">${country.name.common}</h2>
          <span class="country--continent">${region}</span>
        </div>

        <div class="country--summary">

          <div class="country--summary-data">
            <span class="country--summary-data-label">Population:</span>
            <span class="country--summary-data-value">${(
              country.population / 1000000
            ).toFixed(2)}M</span>
          </div>

          <div class="country--summary-data">
            <span class="country--summary-data-label">Language:</span>
            <span>${Object.values(country.languages || {})[0]}</span>
          </div>

          <div class="country--summary-data">
            <span class="country--summary-data-label">Currency:${cur}</span>
            <span>
           </span>
          </div>
     
        </div>
    </div>
`;

    countriesContainer.insertAdjacentHTML('afterbegin', html);
  }

  ///////////////////////////////////////////
  // Searching for countries
  _searchForCountry() {
    this.#countries[0].forEach(country => {
      const element = document.querySelector(
        `[data-id="${country.altSpellings[0]}"]`
      );
      element.classList.remove('hidden');
      if (
        country.name.common.slice(0, searchBar.value.length).toLowerCase() !==
        String(searchBar.value).toLowerCase()
      )
        element.classList.add('hidden');
    });
  }

  async test() {
    const res = await fetch();
  }

  ///////////////////////////////////////////
  // Modal
  _openModal(e) {
    if (!e.target.closest('.country')) return;

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');

    const elemetID = e.target.closest('.country').dataset.id;

    this._displayModalData(elemetID);
  }

  _closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');

    neighboringFlags.innerHTML = '';
    modalLang.innerHTML = '';
  }

  _displayModalData(elementID) {
    this.#countries[0].find(country => {
      if (country.altSpellings[0] === elementID) {
        modalCountryName.innerHTML = country.name.common;
        modalHeaderImg.src = country.flags.svg;
        modalPop.innerHTML = country.population;

        let languagePlaceholder = '';
        Object.values(country.languages).forEach(language => {
          languagePlaceholder = languagePlaceholder + `${language}, `;
        });
        modalLang.innerHTML = languagePlaceholder.slice(0, -2);

        if (!country.borders) return;
        country.borders.forEach(neighbour => {
          this._findNeighbors(neighbour).then(res => {
            const html = `
            <img class="modal--neighboring-flags-img" src=${res[0].flags.svg} alt=${res[0].flags.alt}/>
            `;
            neighboringFlags.insertAdjacentHTML('beforeend', html);
          });
        });
      }
    });
  }

  async _findNeighbors(neighbour) {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighbour}`
    );
    const data = res.json();
    return data;
  }
}

const app = new App();
