"use strict";
document.addEventListener("DOMContentLoaded", () => {
    //will remove this
    const params = new URLSearchParams(window.location.search);

    let delay = params.get("delay");
console.log(delay);
// strip non-numbers
    delay = delay ? delay.replace(/[^\d]/g, "") : "1000";

    const delayMs = Number(delay) || 0;
    if (delayMs > 0) {
        setTimeout(() => {
            console.log("Works after delay:", delayMs);
            const loading = document.querySelector("#loading");
            loading.remove();
        }, delayMs);
    }else{
        const loading = document.querySelector("#loading");
        loading.remove();
    }

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
    const currentPercip = document.querySelector("#currentPercipValue");
    const forecastIcon = document.querySelector("#forecastIcon img");
    const weatherPrompt = document.querySelector("#weatherPrompt");
    const mapApiKey = "AIzaSyAxpxbYISxAMereqs8DzSLnZckWI9HCFpk";
    const mapApiKeyBackup = "AIzaSyAOEKH7Zv98rNNyaDWTQ3EfCyM_MrjgNug";
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
                throw new Error('loadTippings response was not ok');
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
        const currentPercipitation = data.weatherCondition.description.text;
        const rain = data.weatherCondition.description.text;
        currentTemp.innerHTML = currentTemperature.toString();
        minTemp.innerHTML = minTemperature.toString();
        maxTemp.innerHTML = maxTemperature.toString();
        currentPercip.innerHTML = currentPercipitation.toString();
        forecastIcon.src = data.weatherCondition.iconBaseUri.toString() + ".svg";
        const type = data.weatherCondition.type;
        const weatherPrompts = await loadWeatherPrompts("./data/weatherPrompt.json");
        const blurb = weatherPrompts[type] || "Good day for ice cream.";
        weatherPrompt.innerHTML = blurb;
        forecastData.style.display = "flex";
        forecastData.style.opacity = "1";
        setTimeout(() => {
            weatherPrompt.innerHTML = "Loading weather data...";
            loadWeather(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${mapApiKey}&location.latitude=44.5237800033&location.longitude=-80.0033`);
        }, 10000);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDL0MsTUFBTSxPQUFPLEdBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQW1CLENBQUM7SUFDdkUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JCLGdDQUFnQztJQUNoQyx3REFBd0Q7SUFDeEQsb0NBQW9DO0lBQ3BDLHlCQUF5QjtJQUNyQixNQUFNLFlBQVksR0FBSyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBc0IsQ0FBQztJQUM5RSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBc0IsQ0FBQztJQUM5RSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBbUIsQ0FBQztJQUN0RSxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFtQixDQUFDO0lBQ25GLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFtQixDQUFDO0lBQzNFLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFtQixDQUFDO0lBQy9FLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQW1CLENBQUM7SUFDbEYsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQW1CLENBQUM7SUFDMUUsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQW1CLENBQUM7SUFDMUUsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBbUIsQ0FBQztJQUN0RixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFxQixDQUFDO0lBQ3JGLE1BQU0sYUFBYSxHQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQXlCLENBQUM7SUFDeEYsTUFBTSxTQUFTLEdBQVkseUNBQXlDLENBQUM7SUFDckUsTUFBTSxlQUFlLEdBQVkseUNBQXlDLENBQUE7SUFDOUUsNkRBQTZEO0lBQ3pELElBQUksWUFBWSxJQUFJLElBQUksSUFBSSxhQUFhLElBQUksSUFBSSxFQUFDLENBQUM7UUFDL0MsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsRSxhQUFhLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7O1FBRUcsT0FBTyxDQUFDLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0lBRTlFLElBQUksZ0JBQWdCLEtBQUssSUFBSTtRQUN6QixnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O1FBRXBFLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztJQUVoRSxJQUFJLGdCQUFnQixHQUE4QixFQUFFLENBQUM7SUFDckQsSUFBSSxnQkFBZ0IsR0FBOEIsRUFBRSxDQUFDO0lBQ3JELGdCQUFnQixDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDakQsZ0JBQWdCLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNqRCxXQUFXLENBQUMsa0VBQWtFLFNBQVMsOERBQThELENBQUMsQ0FBQztJQUUzSix1QkFBdUI7SUFDdkIsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0QixrQkFBa0I7SUFDbEIsd0NBQXdDO0lBQ3BDLFNBQVMsV0FBVyxDQUFDLE1BQU0sR0FBRyxLQUFLO1FBQy9CLElBQUksWUFBWSxLQUFLLElBQUksSUFBSSxhQUFhLEtBQUssSUFBSSxFQUFDLENBQUM7WUFDakQsSUFBSSxNQUFNLEdBQVksR0FBRyxDQUFDO1lBQzFCLElBQUksWUFBWSxHQUFZLEVBQUUsQ0FBQztZQUMvQiw2QkFBNkI7WUFDN0IsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQ2xCLFlBQVksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xFLGFBQWEsQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BFLFlBQVksR0FBRyxxREFBcUQsQ0FBQztZQUN6RSxDQUFDO1lBQ0QsTUFBTSxNQUFNLEdBQVksWUFBWSxDQUFDLEtBQUssQ0FBQztZQUMzQyxNQUFNLE9BQU8sR0FBWSxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQzdDLGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RCLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDOUIsYUFBYSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7Z0JBQzdDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osU0FBUyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQy9CLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtnQkFDVixPQUFPO1lBQ1gsQ0FBQztZQUNELElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNwRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDOUIsYUFBYSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDakQsQ0FBQztZQUNELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFZLEdBQUc7WUFDekMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1dBQ25ILGdCQUFnQixDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLGdCQUFnQixnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixPQUFPLENBQUM7Z0JBQ2xKLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDOUIsYUFBYSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDakQsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBRVYsU0FBUyxZQUFZLENBQUMsR0FBWSxFQUFFLEdBQVk7Z0JBQzVDLE1BQU0sT0FBTyxHQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sVUFBVSxHQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyx3REFBd0Q7WUFDakksQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxpQkFBaUI7UUFNbkIsWUFBWSxJQUFhLEVBQUUsSUFBYSxFQUFFLFFBQWdCLEVBQUUsV0FBbUIsRUFBQyxnQkFBd0I7WUFDcEcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQzdDLENBQUM7S0FDSjtJQUVELEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxHQUFZO1FBQ3hDLElBQUksQ0FBQztZQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDdEUsTUFBTSxJQUFJLEdBQWdCLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hELGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFXLEVBQUMsRUFBRSxDQUFDLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9KLElBQUksWUFBWSxLQUFLLElBQUk7Z0JBQ3JCLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDOUIsWUFBWSxDQUFDLFNBQVMsSUFBSTtxQkFDekIsTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSTtLQUMzQyxDQUFDO2dCQUNVLENBQUMsQ0FBQyxDQUFBO1FBQ1YsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxHQUFZO1FBQ3hDLElBQUksQ0FBQztZQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDdEUsTUFBTSxJQUFJLEdBQWdCLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hELGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFXLEVBQUMsRUFBRSxDQUFDLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzdKLElBQUksYUFBYSxLQUFLLElBQUk7Z0JBQ3RCLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDL0IsYUFBYSxDQUFDLFNBQVMsSUFBSTtxQkFDMUIsT0FBTyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSTtLQUM3QyxDQUFDO2dCQUNVLENBQUMsQ0FBQyxDQUFBO1FBQ1YsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUssVUFBVSxrQkFBa0IsQ0FBRSxHQUFZO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUM1RSxNQUFNLGdCQUFnQixHQUEyQixNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2RSxPQUFPLGdCQUFnQixDQUFDO0lBQzVCLENBQUM7SUFDRCxLQUFLLFVBQVUsV0FBVyxDQUFDLEdBQVk7UUFDbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sSUFBSSxHQUFnQixNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQXNCaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixNQUFNLGtCQUFrQixHQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQzdELE1BQU0sY0FBYyxHQUFZLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBQ3JGLE1BQU0sY0FBYyxHQUFZLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBQ3JGLE1BQU0sb0JBQW9CLEdBQVksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDN0UsTUFBTSxJQUFJLEdBQVksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDN0QsV0FBVyxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0RCxPQUFPLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QyxPQUFPLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QyxhQUFhLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFELFlBQVksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDekUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztRQUN4QyxNQUFNLGNBQWMsR0FBRyxNQUFNLGtCQUFrQixDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDN0UsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLHlCQUF5QixDQUFDO1FBQ2hFLGFBQWEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFFLE1BQU0sQ0FBQztRQUNuQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDakMsVUFBVSxDQUFDLEdBQUUsRUFBRTtZQUNYLGFBQWEsQ0FBQyxTQUFTLEdBQUcseUJBQXlCLENBQUM7WUFHcEQsV0FBVyxDQUFDLGtFQUFrRSxTQUFTLDhEQUE4RCxDQUFDLENBQUM7UUFDdkosQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9
