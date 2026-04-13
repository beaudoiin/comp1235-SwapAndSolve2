"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const loading = document.querySelector("#loading");
    //will remove this
    const params = new URLSearchParams(window.location.search);
    let delay = params.get("delay");
    // strip non-numbers
    delay = delay ? delay.replace(/\D/g, "") : "0";
    const delayMs = Number(delay) || 0;
    if (delayMs > 0) {
        setTimeout(() => {
            console.log("Works after delay:", delayMs);
            loading.remove();
        }, delayMs);
    }
    else
        loading.remove();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDL0MsTUFBTSxPQUFPLEdBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQW1CLENBQUM7SUFDdkUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2pCLGtCQUFrQjtJQUNsQixNQUFNLE1BQU0sR0FBcUIsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3RSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLG9CQUFvQjtJQUNwQixLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQy9DLE1BQU0sT0FBTyxHQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDZCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hCLENBQUM7O1FBQ0csT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRXJCLGdDQUFnQztJQUNoQyx3REFBd0Q7SUFDeEQsb0NBQW9DO0lBQ3BDLHlCQUF5QjtJQUN6QixNQUFNLFlBQVksR0FBSyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBc0IsQ0FBQztJQUM5RSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMs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
