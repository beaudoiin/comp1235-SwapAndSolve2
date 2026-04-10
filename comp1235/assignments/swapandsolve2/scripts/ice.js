"use strict";
// ICE CREAM COMBO DATA (Object)
// All flavor + topping combinations stored in one place
// Easy for business owner to update
//  Get dropdown elements
const flavorSelect = document.querySelector("#flavor");
const toppingSelect = document.querySelector("#topping");
const resultDiv = document.querySelector("#result");
const randomFlavourDiv = document.querySelector("#combo-button");
const resultWrapper = document.querySelector(".wrapper");
class IceCreamComponent {
    constructor(name, type, category, description, shortDescription) {
        this.Name = name;
        this.Type = type;
        this.Category = category;
        this.Description = description;
        this.ShortDescription = shortDescription;
    }
}
let iceCreamFlavours = [];
let iceCreamToppings = [];
async function loadFlavoursData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('Network response was not ok');
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
            throw new Error('Network response was not ok');
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
loadFlavoursData('./data/IceCreamFlavours.json');
loadToppingsData('./data/IceCreamToppings.json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdDQUFnQztBQUNoQyx3REFBd0Q7QUFDeEQsb0NBQW9DO0FBQ3BDLHlCQUF5QjtBQUN6QixNQUFNLFlBQVksR0FBSyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBc0IsQ0FBQztBQUM5RSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBc0IsQ0FBQztBQUM5RSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBbUIsQ0FBQztBQUN0RSxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFtQixDQUFDO0FBQ25GLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFtQixDQUFDO0FBRTNFLE1BQU0saUJBQWlCO0lBTW5CLFlBQVksSUFBYSxFQUFFLElBQWEsRUFBRSxRQUFnQixFQUFFLFdBQW1CLEVBQUMsZ0JBQXdCO1FBQ3BHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUM3QyxDQUFDO0NBQ0o7QUFDRCxJQUFJLGdCQUFnQixHQUE4QixFQUFFLENBQUM7QUFDckQsSUFBSSxnQkFBZ0IsR0FBOEIsRUFBRSxDQUFDO0FBQ3JELEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxHQUFZO0lBQ3hDLElBQUksQ0FBQztRQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENB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