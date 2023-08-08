// Initialize and add the map
let map;
let geocoder;
let markers = [];
let pageNumber = 1;

function clearMarkers() {
    for (var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }

const paginate = (pageNum) => {
    if (pageNum === "prev" && pageNumber > 1) {
        pageNumber = pageNumber - 1;
        getBreweriesByCity();
    } else if (pageNum === "next" ) {
        pageNumber = pageNumber + 1;
        getBreweriesByCity();
    } else if (pageNum !== pageNumber) {
        console.log("howdy");
        pageNumber = pageNum;
        getBreweriesByCity();
    }
}

async function initMap() {
  const position = { lat: 30.2677, lng: -97.7431 };
  const { Map } = await google.maps.importLibrary("maps");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: position,
    mapId: "DEMO_MAP_ID",
  });
  geocoder = new google.maps.Geocoder();
}

function codeAddress(geocoder, map, address) {
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        markers.push(marker);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}

initMap();

const getBreweriesByCity = async () => {
    clearMarkers();
    const searchQuery = document.getElementById("brewery-search-input").value;
    if (!validateInput(searchQuery)) return false;
    const byCityURL = `https://api.openbrewerydb.org/v1/breweries?by_city=${searchQuery.toLowerCase().trim()}&page=${pageNumber}&per_page=10`;
    const response = await fetch(byCityURL);
    console.log(response);
    const data = await response.json();
    console.log(data);
    document.getElementById("brewery-results").innerHTML = "";
    data.forEach((brewery) => {
        codeAddress(geocoder, map, `${brewery.address_1} ${brewery.address_2} ${brewery.city} ${brewery.sate}`);
        displayResults({
            name: brewery.name,
            city: brewery.city,
            website_url: brewery.website_url,
        })
    })
}

const input = document.getElementById("brewery-search-input");
input.addEventListener('keyup', (event) => {
    clearValidation();
})

const validateInput = (inputValue) => {
    const error = clearValidation()
    if (inputValue === "") {
        error.innerHTML = 'please input a valid city'
        input.classList.add('is-invalid');
        return false;
    }
    return true;
}

const clearValidation = () => {
    const input = document.getElementById("brewery-search-input");
    input.classList.remove('is-invalid');
    const error = document.getElementById("beer-input-error");
    error.innerHTML = "";
    return error;
}

const displayResults = (breweryData) => {
    const resultsContainer = document.createElement("div");
    resultsContainer.setAttribute('class', 'col-sm-12 col-md-6 col-lg-4')
    resultsContainer.innerHTML = `
        <div class="card" style="width: auto; margin-bottom: 20px;">
            <div class="card-body">
                <h5 class="card-title">${breweryData.name}</h5>
                <p class="card-text">${breweryData.city}</p>
                ${breweryData.website_url ?
                `<a target="_blank" href="${breweryData.website_url}" class="card-link">${breweryData.name} Website</a>` :
                ""
                }
            </div>
        </div>
    `
    document.getElementById("brewery-results").appendChild(resultsContainer);
}