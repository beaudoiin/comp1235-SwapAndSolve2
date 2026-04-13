document.addEventListener("DOMContentLoaded", () => {
    const loading   = document.querySelector("#loading") as HTMLDivElement;
    loading.remove();
    //will remove this
    const params : URLSearchParams = new URLSearchParams(window.location.search);
    let delay = params.get("delay");
    // strip non-numbers
    delay = delay ? delay.replace(/\D/g, "") : "0";
    const delayMs : number = Number(delay) || 0;
    if (delayMs > 0) {
        setTimeout(() => {
            console.log("Works after delay:", delayMs);
            loading.remove();
        }, delayMs);
    }else
        loading.remove();

    // ICE CREAM COMBO DATA (Object)
    // All flavor + topping combinations stored in one place
    // Easy for business owner to update
    //  Get dropdown elements
    const flavorSelect   = document.querySelector("#flavor") as HTMLSelectElement;
    const toppingSelect = document.querySelector("#topping") as HTMLSelectElement;
    const resultDiv = document.querySelector("#result") as HTMLDivElement;
    const randomFlavourDiv = document.querySelector("#combo-button") as HTMLDivElement;
    const resultWrapper = document.querySelector(".wrapper") as HTMLDivElement;
    const forecastData = document.querySelector("#forecastData") as HTMLDivElement;
    const currentTemp = document.querySelector("#currentTempValue") as HTMLDivElement;
    const minTemp = document.querySelector("#minTempValue") as HTMLDivElement;
    const maxTemp = document.querySelector("#maxTempValue") as HTMLDivElement;
    const currentPrecip = document.querySelector("#currentPrecipValue") as HTMLDivElement;
    const forecastIcon = document.querySelector("#forecastIcon img") as HTMLImageElement;
    const weatherPrompt  = document.querySelector("#weatherPrompt") as HTMLParagraphElement;
    const mapApiKey = "AIzaSyAtSmSo_FMCeZ91tYhO1pMCIedqseEdi6o";
    // Update combo when selection changes or combo buton pressed
    if (flavorSelect != null && toppingSelect != null){
        flavorSelect.addEventListener("change", () => updateCombo(false));
        toppingSelect.addEventListener("change", () => updateCombo(false));
    }
    else
        console.error('Error: Could not get either #flavor or #topping elements');

    if (randomFlavourDiv !== null )
        randomFlavourDiv.addEventListener("click", () => updateCombo(true));
    else
        console.error('Error: Could not get element #combo-button');
    let iceCreamFlavours : Array<IceCreamComponent> = [];
    let iceCreamToppings : Array<IceCreamComponent> = [];
    loadFlavoursData('./data/IceCreamFlavours.json');
    loadToppingsData('./data/IceCreamToppings.json');
    loadWeather(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${mapApiKey}&location.latitude=44.5237800033&location.longitude=-80.0033`);

// Updates combo result
// Demonstrates:
// - Conditional Logic
// - Object Lookup
// - Regular Expression (Week 4 concept)
    function updateCombo(random = false)  {
        if (flavorSelect !== null && toppingSelect !== null){
            let timeMs : number = 600;
            let returnString : string = "";
            // Using strict boolean check
            if (random === true) {
                flavorSelect.selectedIndex = getRandomInt(1, flavorSelect.length);
                toppingSelect.selectedIndex = getRandomInt(1, toppingSelect.length);
                returnString = "<p>You should give this exciting flavour a try:</p>";
            }
            const flavor : string = flavorSelect.value;
            const topping : string = toppingSelect.value;
            // If one dropdown is not selected, clear output
            if (!flavor || !topping) {
                resultDiv.style.opacity = "0";
                resultWrapper.style.gridTemplateRows = "0fr";
                setTimeout(() => {
                    resultDiv.textContent = "";
                }, timeMs)
                return;
            }
            if (resultDiv.style.opacity === "0" || resultDiv.style.height === "0") {
                timeMs = 0;
            } else {
                resultDiv.style.opacity = "0";
                resultWrapper.style.gridTemplateRows = "0fr";
            }
            setTimeout(() => {
                resultDiv.innerHTML = returnString + `
                <h3>${iceCreamToppings[toppingSelect.selectedIndex-1].Name} topped ${iceCreamFlavours[flavorSelect.selectedIndex-1].Name} </h3>
                <p>${iceCreamFlavours[flavorSelect.selectedIndex-1].ShortDescription} topped with ${iceCreamToppings[toppingSelect.selectedIndex-1].ShortDescription} </p>`;
                resultDiv.style.opacity = "1";
                resultWrapper.style.gridTemplateRows = "1fr";
            }, timeMs)

            function getRandomInt(min : number, max : number) {
                const minCeil : number = Math.ceil(min);
                const maxFloored : number = Math.floor(max);
                return Math.floor(Math.random() * (maxFloored - minCeil) + minCeil); // The maximum is exclusive and the minimum is inclusive
            }
        }
    }

    class IceCreamComponent{
        Name:string;
        Type:string;
        Category:string;
        Description:string;
        ShortDescription:string;
        constructor(name : string, type : string, category: string, description: string,shortDescription: string){
            this.Name = name;
            this.Type = type;
            this.Category = category;
            this.Description = description;
            this.ShortDescription = shortDescription;
        }
    }

    async function loadFlavoursData(url : string) :  Promise<any> {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('LoadFlavours response was not ok');
            const data : Array<any> = await response.json();
            iceCreamFlavours = data.map((value : any)=> new IceCreamComponent(value.name, "Ice Cream",  value.category, value.description,  value.shortDescription)) || [];
            if (flavorSelect !== null)
                iceCreamFlavours.forEach(flavor => {
                    flavorSelect.innerHTML += `
    <option value="${flavor.Name}">${flavor.Name}</option>
    `;
                })
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    async function loadToppingsData(url : string) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('loadToppings response was not ok');
            const data : Array<any> = await response.json();
            iceCreamToppings = data.map((value : any)=> new IceCreamComponent(value.name, "Toppings",  value.category, value.description, value.shortDescription)) || [];
            if (toppingSelect !== null)
                iceCreamToppings.forEach(topping => {
                    toppingSelect.innerHTML += `
    <option value="${topping.Name}">${topping.Name}</option>
    `;
                })
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    async function loadWeatherPrompts (url : string) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('loadWeatherPrompts response was not ok');
        const weatherPromptObj: Record<string, string> = await response.json();
        return weatherPromptObj;
    }
    async function loadWeather(url : string){
        const response = await fetch(url);
        if (!response.ok) throw new Error('loadWeather response was not ok');
        const data : DataStruct = await response.json();
        type DataStruct = {
            temperature : {
                degrees: number;
            },
            currentConditionsHistory : {
                minTemperature: {
                    degrees: number;
                },
                maxTemperature: {
                    degrees: number;
                }
            },
            weatherCondition : {
                description: {
                    text: string;
                }
                iconBaseUri : string,
                type: string
            }
        };
        console.log(data);
        const currentTemperature : number = data.temperature.degrees;
        const minTemperature : number = data.currentConditionsHistory.minTemperature.degrees;
        const maxTemperature : number = data.currentConditionsHistory.maxTemperature.degrees;
        const currentPrecipitation : string = data.weatherCondition.description.text;
        currentTemp.innerHTML = currentTemperature.toString();
        minTemp.innerHTML = minTemperature.toString();
        maxTemp.innerHTML = maxTemperature.toString();
        currentPrecip.innerHTML = currentPrecipitation.toString();
        forecastIcon.src = data.weatherCondition.iconBaseUri.toString() + ".svg";
        const type = data.weatherCondition.type;
        const weatherPrompts = await loadWeatherPrompts("./data/weatherPrompt.json");
        weatherPrompt.innerHTML = weatherPrompts[type] || "Good day for ice cream.";
        forecastData.style.display= "flex";
        forecastData.style.opacity = "1";
        setTimeout(()=>{
            weatherPrompt.innerHTML = "Loading weather data...";
            loadWeather(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${mapApiKey}&location.latitude=44.5237800033&location.longitude=-80.0033`);
        },300000);
    }
});
