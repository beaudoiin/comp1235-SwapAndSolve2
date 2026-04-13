"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const loading = document.querySelector("#loading");
    setTimeout(() => {
        loading.remove();
    }, 10000);
    // ICE CREAM COMBO DATA (Object)
    // All flavor + topping combinations stored in one place
    // Easy for business owner to update
    //  Get dropdown elements
    const flavorSelect = document.querySelector("#flavor");
    const toppingSelect = document.querySelector("#topping");
    const resultDiv = document.querySelector("#result");
    const randomFlavourDiv = document.querySelector("#combo-button");
    const resultWrapper = document.querySelector(".wrapper");
    const forecastData = document.querySelector("#forecastData");
    const currentTemp = document.querySelector("#currentTempValue");
    const minTemp = document.querySelector("#minTempValue");
    const maxTemp = document.querySelector("#maxTempValue");
    const currentPrecip = document.querySelector("#currentPrecipValue");
    const forecastIcon = document.querySelector("#forecastIcon img");
    const weatherPrompt = document.querySelector("#weatherPrompt");
    const mapApiKey = "AIzaSyAtSmSo_FMCeZ91tYhO1pMCIedqseEdi6o";
    // Update combo when selection changes or combo buton pressed
    if (flavorSelect != null && toppingSelect != null) {
        flavorSelect.addEventListener("change", () => updateCombo(false));
        toppingSelect.addEventListener("change", () => updateCombo(false));
    }
    else
        console.error('Error: Could not get either #flavor or #topping elements');
    if (randomFlavourDiv !== null)
        randomFlavourDiv.addEventListener("click", () => updateCombo(true));
    else
        console.error('Error: Could not get element #combo-button');
    let iceCreamFlavours = [];
    let iceCreamToppings = [];
    loadFlavoursData('./data/IceCreamFlavours.json');
    loadToppingsData('./data/IceCreamToppings.json');
    loadWeather(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${mapApiKey}&location.latitude=44.5237800033&location.longitude=-80.0033`);
    // Updates combo result
    // Demonstrates:
    // - Conditional Logic
    // - Object Lookup
    // - Regular Expression (Week 4 concept)
    function updateCombo(random = false) {
        if (flavorSelect !== null && toppingSelect !== null) {
            let timeMs = 600;
            let returnString = "";
            // Using strict boolean check
            if (random === true) {
                flavorSelect.selectedIndex = getRandomInt(1, flavorSelect.length);
                toppingSelect.selectedIndex = getRandomInt(1, toppingSelect.length);
                returnString = "<p>You should give this exciting flavour a try:</p>";
            }
            const flavor = flavorSelect.value;
            const topping = toppingSelect.value;
            // If one dropdown is not selected, clear output
            if (!flavor || !topping) {
                resultDiv.style.opacity = "0";
                resultWrapper.style.gridTemplateRows = "0fr";
                setTimeout(() => {
                    resultDiv.textContent = "";
                }, timeMs);
                return;
            }
            if (resultDiv.style.opacity === "0" || resultDiv.style.height === "0") {
                timeMs = 0;
            }
            else {
                resultDiv.style.opacity = "0";
                resultWrapper.style.gridTemplateRows = "0fr";
            }
            setTimeout(() => {
                resultDiv.innerHTML = returnString + `
                <h3>${iceCreamToppings[toppingSelect.selectedIndex - 1].Name} topped ${iceCreamFlavours[flavorSelect.selectedIndex - 1].Name} </h3>
                <p>${iceCreamFlavours[flavorSelect.selectedIndex - 1].ShortDescription} topped with ${iceCreamToppings[toppingSelect.selectedIndex - 1].ShortDescription} </p>`;
                resultDiv.style.opacity = "1";
                resultWrapper.style.gridTemplateRows = "1fr";
            }, timeMs);
            function getRandomInt(min, max) {
                const minCeil = Math.ceil(min);
                const maxFloored = Math.floor(max);
                return Math.floor(Math.random() * (maxFloored - minCeil) + minCeil); // The maximum is exclusive and the minimum is inclusive
            }
        }
    }
    class IceCreamComponent {
        constructor(name, type, category, description, shortDescription) {
            this.Name = name;
            this.Type = type;
            this.Category = category;
            this.Description = description;
            this.ShortDescription = shortDescription;
        }
    }
    async function loadFlavoursData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error('LoadFlavours response was not ok');
            const data = await response.json();
            iceCreamFlavours = data.map((value) => new IceCreamComponent(value.name, "Ice Cream", value.category, value.description, value.shortDescription)) || [];
            if (flavorSelect !== null)
                iceCreamFlavours.forEach(flavor => {
                    flavorSelect.innerHTML += `
    <option value="${flavor.Name}">${flavor.Name}</option>
    `;
                });
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
    }
    async function loadToppingsData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error('loadToppings response was not ok');
            const data = await response.json();
            iceCreamToppings = data.map((value) => new IceCreamComponent(value.name, "Toppings", value.category, value.description, value.shortDescription)) || [];
            if (toppingSelect !== null)
                iceCreamToppings.forEach(topping => {
                    toppingSelect.innerHTML += `
    <option value="${topping.Name}">${topping.Name}</option>
    `;
                });
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
    }
    async function loadWeatherPrompts(url) {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('loadWeatherPrompts response was not ok');
        const weatherPromptObj = await response.json();
        return weatherPromptObj;
    }
    async function loadWeather(url) {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('loadWeather response was not ok');
        const data = await response.json();
        console.log(data);
        const currentTemperature = data.temperature.degrees;
        const minTemperature = data.currentConditionsHistory.minTemperature.degrees;
        const maxTemperature = data.currentConditionsHistory.maxTemperature.degrees;
        const currentPrecipitation = data.weatherCondition.description.text;
        currentTemp.innerHTML = currentTemperature.toString();
        minTemp.innerHTML = minTemperature.toString();
        maxTemp.innerHTML = maxTemperature.toString();
        currentPrecip.innerHTML = currentPrecipitation.toString();
        forecastIcon.src = data.weatherCondition.iconBaseUri.toString() + ".svg";
        const type = data.weatherCondition.type;
        const weatherPrompts = await loadWeatherPrompts("./data/weatherPrompt.json");
        weatherPrompt.innerHTML = weatherPrompts[type] || "Good day for ice cream.";
        forecastData.style.display = "flex";
        forecastData.style.opacity = "1";
        setTimeout(() => {
            weatherPrompt.innerHTML = "Loading weather data...";
            loadWeather(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${mapApiKey}&location.latitude=44.5237800033&location.longitude=-80.0033`);
        }, 300000);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDL0MsTUFBTSxPQUFPLEdBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQW1CLENBQUM7SUFDbkUsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNyQixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFZCxnQ0FBZ0M7SUFDaEMsd0RBQXdEO0lBQ3hELG9DQUFvQztJQUNwQyx5QkFBeUI7SUFDekIsTUFBTSxZQUFZLEdBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQXNCLENBQUM7SUFDOUUsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQXNCLENBQUM7SUFDOUUsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQW1CLENBQUM7SUFDdEUsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBbUIsQ0FBQztJQUNuRixNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBbUIsQ0FBQztJQUMzRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBbUIsQ0FBQztJQUMvRSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFtQixDQUFDO0lBQ2xGLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFtQixDQUFDO0lBQzFFLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFtQixDQUFDO0lBQzFFLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJB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
