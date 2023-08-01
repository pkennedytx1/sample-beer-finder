const getBreweriesByCity = async () => {
    const searchQuery = document.getElementById("brewery-search-input").value;
    const byCityURL = `https://api.openbrewerydb.org/v1/breweries?by_city=${searchQuery.toLowerCase()}`;
    const response = await fetch(byCityURL);
    const data = await response.json();
    document.getElementById("brewery-results").innerHTML = "";
    data.forEach((brewery) => {
        displayResults({
            name: brewery.name,
            city: brewery.city,
            website_url: brewery.website_url,
        })
    })
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