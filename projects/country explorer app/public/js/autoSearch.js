const input = document.getElementById("search-field");
const countryContainer = document.getElementById("country-container");
const select = document.querySelector('select[name="region"]');

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const regionFromURL = urlParams.get('region');
  if (regionFromURL) select.value = regionFromURL;
});

async function liveSearch() {
  const region = select.value; // <-- get current selection
  const query = input.value.trim();

  const res = await fetch(`/search?name=${query}&region=${region}`);
  const countries = await res.json();

  if (!countries.length) {
    countryContainer.classList.add("remove-grid");
    countryContainer.innerHTML = `
    <p class="no-match">No countries found. Check your spelling or try another region.</p>
    `;
  } else {
    countryContainer.classList.remove("remove-grid");
    countryContainer.innerHTML = countries.map(country => `
      <a class="country-card-small" href="/country?name=${country.name.common}">
        <img 
          src="${country.flags.svg}" 
          alt="${country.flags.alt}"
        />
        <h3>${country.name.common}</h3>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </a>
    `).join("");
  };
};

let timeout;

input.addEventListener("input", () => {
  clearTimeout(timeout);
  // debounce (wait until user stops typing)
  timeout = setTimeout(liveSearch, 0); // 200ms delay
});

select.addEventListener("change", liveSearch);