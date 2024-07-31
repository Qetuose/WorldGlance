'use strict';

const countriesContainer = document.querySelector('.countries--container');
const searchBar = document.querySelector('.search-box');

// Event lisiners

// Getting and displaying countries
const getAllCountries = async function () {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    if (!res.ok) throw new Error('Could not find countries');

    const data = res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

getAllCountries().then(res => {
  res.forEach(country => {
    renderCountry(country);
  });
});

const renderCountry = function (country) {
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
};

// !!!NEED OPTIMAZING
//Seaching for a countries
const searchForCountry = function () {
  getAllCountries().then(res => {
    res.find(country => {
      const countryName = country.name.common;
      const elements = document.querySelectorAll(
        `[data-id="${country.altSpellings[0]}"]`
      );

      elements.forEach(el => {
        el.classList.remove('hidden');
      });

      if (
        countryName.slice(0, searchBar.value.length).toLowerCase() !==
        String(searchBar.value).toLowerCase()
      ) {
        elements.forEach(el => {
          el.classList.add('hidden');
        });
      }
    });
  });
};

searchBar.addEventListener('keyup', searchForCountry);
