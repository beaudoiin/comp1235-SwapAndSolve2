// ICE CREAM COMBO DATA (Object)
// All flavor + topping combinations stored in one place
// Easy for business owner to update
//  Get dropdown elements
const flavorSelect   = document.querySelector("#flavor") as HTMLSelectElement;
const toppingSelect = document.querySelector("#topping") as HTMLSelectElement;
const resultDiv = document.querySelector("#result") as HTMLDivElement;
const randomFlavourDiv = document.querySelector("#combo-button") as HTMLDivElement;
const resultWrapper = document.querySelector(".wrapper") as HTMLDivElement;

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
let iceCreamFlavours : Array<IceCreamComponent> = [];
let iceCreamToppings : Array<IceCreamComponent> = [];
async function loadFlavoursData(url : string) :  Promise<any> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
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
        if (!response.ok) throw new Error('Network response was not ok');
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
loadFlavoursData('./data/IceCreamFlavours.json');
loadToppingsData('./data/IceCreamToppings.json');

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