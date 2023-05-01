import './css/styles.css';
import Notify from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputSearch: document.querySelector('input#search-box'),
  countriesList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};

refs.inputSearch.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

async function onSearchInput(e) {
  try {
    const nameToSearch = e.target.value.trim();
    refs.countriesList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

    // если поле поиска пустое или очистили
    if (nameToSearch === '') {
      return;
    }

    // достаём список стран по имени из строки поиска
    const country = await fetchCountries(nameToSearch);

    // рисуем инфу о стране если нашло одну страну
    if (country.length === 1) {
      refs.countryInfo.innerHTML = makeCountryMarkup(country);
    }

    // рисуем список стран если нашло больше одной страны
    if (country.length > 1 && country.length <= 10) {
      refs.countriesList.innerHTML = makeCountriesMarkup(country);
    }

    // уведомление если стран больше 10ти
    if (country.length > 10) {
      showTooManyCountriesMessage();
    }
  } catch (error) {
    // уведомление если страну не получилось найти
    if (error.message === '404') {
      showErrorMessage();
      return;
    }
    throw new Error(error);
  }
}

function showErrorMessage() {
  Notify.Notify.failure('Oops, there is no country with that name');
}

function showTooManyCountriesMessage() {
  Notify.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function makeCountriesMarkup(countries) {
  let markup = '';

  countries.forEach(country => {
    markup += `<li><img src=${country.flags.png} width="25" alt=${country.flags.alt} /> <span> ${country.name.official}</span></li>`;
  });

  return markup;
}

function makeCountryMarkup(countries) {
  const languages = Object.values(countries[0].languages).join(', ');

  const markup = `<p class="country-title"><img src=${countries[0].flags.png} width="25" alt=${countries[0].flags.alt} /> <span class="country-name">${countries[0].name.official}</span></p><p><b>Capital: </b>${countries[0].capital}</p><p><b>Population: </b>${countries[0].population}</p><p><b>Languages: </b>${languages}</p>`;

  return markup;
}
