'use strict';

const countriesContainer = document.querySelector('.countries--container');

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
  if (cur !== undefined) cur = Object.values(country.currencies || {})[0].name;

  const html = `
    <div class="country">
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
