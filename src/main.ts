import { GeoData, WaetherData } from "./types/types";

const apiKey = "bdcaff9cf7896aa03cd665ece7d83d76";

// const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
// console.log("API KEY", apiKey);

const searchResultDiv = document.querySelector("#search-results");

const cityInput = document.querySelector<HTMLInputElement>("#city");
cityInput?.addEventListener("input", () => {
  if (searchResultDiv) searchResultDiv.innerHTML = "";
  fetchWeather(cityInput.value);
});

const fetchWeather = (city: string | number) => {
  if (typeof city === "number") {
    fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${city},DE&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        //console.log([data][0]);
        if (![data][0].cod) {
          searchForResults([data]);
        }
      })
      .catch((err) => console.error(err));
  } else {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        searchForResults(data);
      })
      .catch((err) => console.error(err));
  }
};

const searchForResults = (data: GeoData[]) => {
  //% jedes Mal das Div wieder leeren!!!
  if (searchResultDiv) searchResultDiv.innerHTML = "";

  data.forEach((elt) => {
    console.log(elt);
    const searchResult = document.createElement("div");
    const resultCity = elt.name;
    const resultCountry = elt.country;
    const resultState = elt.state;
    const lat = elt.lat;
    const lon = elt.lon;

    const cityH3 = document.createElement("h3");
    cityH3.textContent = resultCity;
    searchResult.appendChild(cityH3);

    const countryP = document.createElement("p");
    countryP.textContent = resultCountry;
    searchResult.appendChild(countryP);

    if (resultState) {
      const stateP = document.createElement("p");
      stateP.textContent = resultState;
      searchResult.appendChild(stateP);
    }

    const button = document.createElement("button");
    button.textContent = "Show weather";
    button.addEventListener("click", () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
        .then((res) => res.json())
        .then((data: WaetherData) => {
          if (searchResultDiv) searchResultDiv.innerHTML = "";
          console.log(data);

          const temp = Math.round(data.main.temp);
          const feelsLike = Math.round(data.main.feels_like);
          const weatherDescription = data.weather[0].description;

          const cityOutput = document.createElement("h3");
          cityOutput.innerHTML = resultCity;

          const tempOutput = document.createElement("p");
          tempOutput.innerText = `Currently: ${temp} °C`;

          const feelsLikeOutput = document.createElement("p");
          feelsLikeOutput.innerText = `Feels like: ${feelsLike} °C`;

          const weatherDescriptionOutput = document.createElement("p");
          weatherDescriptionOutput.innerText = `${weatherDescription}`;

          foreCast(lat, lon);

          if (searchResultDiv) {
            searchResultDiv.appendChild(cityOutput);
            searchResultDiv.appendChild(tempOutput);
            searchResultDiv.appendChild(feelsLikeOutput);
            searchResultDiv.appendChild(weatherDescriptionOutput);
          }
        })
        .catch((err) => console.error("error at second fetch", err));
    });
    searchResult.appendChild(button);
    if (searchResultDiv) searchResultDiv.appendChild(searchResult);
  });
};

const foreCast = (lat: number, lon: number) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("forecast", err));
};

//: Reset Button
document.querySelector("#reset")?.addEventListener("click", () => {
  if (cityInput && searchResultDiv) {
    cityInput.value = "";
    searchResultDiv.innerHTML = "";
  }
});
