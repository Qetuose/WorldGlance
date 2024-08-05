'use strict';

const countriesContainer = document.querySelector('.countries--container');
const searchBar = document.querySelector('.search-box');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const neighboringContainer = document.querySelector(
  '.modal--neighboring-container'
);
const modalCloseBtn = document.querySelector('.modal--button-close');
const modalCountryName = document.querySelector('.modal--country-name');
const neighboringFlags = document.querySelector('.modal--neighboring-flags');
const modalPop = document.querySelector('.modal--population');
const modalLang = document.querySelector('.modal--language');
const modalHeaderFlag = document.querySelector('.modal--header-img-flag');
const modalHeaderCOA = document.querySelector('.modal--header-img-coatOfArms');
const modalLocation = document.querySelector('.modal-location');
const modalSize = document.querySelector('.modal--size');
const modalDemonym = document.querySelector('.modal--demonym');
const modalCapital = document.querySelector('.modal--capital');
const modalTimezone = document.querySelector('.modal--timezone');
const modalCurrency = document.querySelector('.modal--currency');

// Event lisiners
class App {
  #countries = [];
  #map;

  constructor() {
    this._renderCountries();
    this._renderMap();

    searchBar.addEventListener('keyup', this._searchForCountry.bind(this));
    countriesContainer.addEventListener('click', this._openModal.bind(this));
    modalCloseBtn.addEventListener('click', this._closeModal.bind(this));
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

    if (cur !== undefined) {
      cur = Object.values(country.currencies || {})[0].name;
      curSymbol = Object.values(country.currencies || {})[0].symbol;
    }
    let pop = country.population;

    if (pop / 1000000 > 1) pop = `${(pop / 1000000).toFixed(2)}M`;
    if (pop / 1000 > 1) pop = `${(pop / 1000).toFixed(2)}K`;

    const html = `
    <div class="country" data-id = "${country.altSpellings[0]}">
        <img
          class="country-flag"
          src="${country.flags.svg}"
          alt="${country.flags.alt}"
        />

        <div class="country--location">
          <h2 class="country--name">${country.name.common}</h2>
          <span class="country--continent">${country.continents}</span>
        </div>

        <div class="country--summary">

          <div class="country--summary-data">
            <span class="country--summary-data-label">Population:</span>
            <span class="country--summary-data-value">${pop}</span>
          </div>

          <div class="country--summary-data">
            <span class="country--summary-data-label">Language:</span>
            <span>${Object.values(country.languages || {})[0]}</span>
          </div>

          <div class="country--summary-data">
            <span class="country--summary-data-label">Currency:${cur} (${curSymbol})</span>
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
    modalHeaderCOA.src = '';
  }

  _displayModalData(elementID) {
    this.#countries[0].find(country => {
      if (country.altSpellings[0] === elementID) {
        this.#map.setView(country.latlng, 5);

        modalLocation.innerHTML = country.continents[0];
        modalCountryName.innerHTML = country.name.official;
        modalHeaderFlag.src = country.flags.svg;
        modalSize.innerHTML = country.area;
        modalCapital.innerHTML = country.capital;
        modalTimezone.innerHTML = country.timezones[0];
        modalDemonym.innerHTML = country.demonyms.eng.f;

        const currencyPlaceholder = Object.values(country.currencies)[0];
        modalCurrency.innerHTML = `${currencyPlaceholder.name} (${currencyPlaceholder.symbol})`;

        if (country.coatOfArms.svg) modalHeaderCOA.src = country.coatOfArms.svg;
        modalPop.innerHTML = new Intl.NumberFormat().format(country.population);

        let languagePlaceholder = '';
        if (country.languages) {
          Object.values(country.languages).forEach(language => {
            languagePlaceholder = languagePlaceholder + `${language}, `;
          });
          modalLang.innerHTML = languagePlaceholder.slice(0, -2);
        }

        if (country.borders) {
          country.borders.forEach(neighbour => {
            this._findNeighbors(neighbour).then(res => {
              const html = `
            <img class="modal--neighboring-flags-img" src=${res[0].flags.svg} alt=${res[0].flags.alt}/>
            `;
              neighboringFlags.insertAdjacentHTML('beforeend', html);
            });
          });
        }
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
  _renderMap() {
    this.#map = L.map('map');

    const tiles = new L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);
  }
}

const app = new App();
