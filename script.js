'use strict';

const countriesContainer = document.querySelector('.countries--container');
const searchBar = document.querySelector('.search-box');
const h1 = document.querySelector('h1');

// Event lisiners
class App {
  countries = [];

  constructor() {
    this._renderCountries();

    searchBar.addEventListener('keyup', this.searchForCountry.bind(this));
    countriesContainer.addEventListener('click', this.openModal.bind(this));
    h1.addEventListener('click', this.test.bind(this));
  }

  // Getting and displaying countries
  async getAllCountries() {
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
    this.getAllCountries().then(res => {
      this.countries.push(res);
      res.forEach(country => {
        this.renderCountry(country);
      });
    });
  }

  renderCountry(country) {
    let cur = Object.values(country.currencies || {})[0];
    let curSymbol;
    if (cur !== undefined) {
      cur = Object.values(country.currencies || {})[0].name;
      curSymbol = Object.values(country.currencies || {})[0].symbol;
    }

    const html = `
    <div class="country" data-id = "${country.altSpellings[0]}">
        <img
          class="country-flag"
          src="${country.flags.svg}"
          alt="${country.flags.alt}"
        />

        <div class="country--location">
          <h2 class="country--name">${country.name.common}</h2>
          <span class="country--continent">${country.region}</span>
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

  //Seaching for a countries
  searchForCountry() {
    this.countries[0].forEach(country => {
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

  test() {}

  //Open modal and functionality

  openModal(e) {
    if (!e.target.closest('.country')) return;
    console.log(e.target.closest('.country'));
  }
}

const app = new App();

console.log(app.countries);
