const URL = 'https://restcountries.com/v3.1/name/';
const filter = `?fields=name,capital,population,flags,languages`;

export async function fetchCountries(name) {
  const result = await fetch(`${URL}${name}${filter}`);

  if (!result.ok) {
    throw new Error(result.status);
  }

  return result.json();
}
