import { addCatInfo, changeCatInfo } from "./actions.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const catName = urlParams.get("catName");

async function addOrEditCatInfo() {
    const currentUrl = new URL(window.location.href);
    const urlForAdding = new URL("http://localhost:8080/add-edit.html");
    const urlForEditing = new URL(`http://localhost:8080/add-edit.html?catName=${catName}`);

    if (currentUrl.href === urlForAdding.href) {
        await addCatInfo();
    } else if (currentUrl.href === urlForEditing.href) {
        await editCatInfo();
    }
}

addOrEditCatInfo();

async function editCatInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const catName = urlParams.get("catName");

    try {
        const response = await fetch(`http://localhost:8080/api/cats/name/${catName}`);
        const parsedData = await response.json();
        const catInfo = parsedData.data;

        const condoNumberInput = document.getElementById("condo-number");
        condoNumberInput.value = catInfo.condoNumber;

        const catNameInput = document.getElementById("cat-name");
        catNameInput.value = catInfo.catName;

        const genderInput = document.getElementById("gender");
        genderInput.value = catInfo.gender;

        const ageInput = document.getElementById("age");
        ageInput.value = catInfo.age;

        const physicalDescriptionInput = document.getElementById("physical-description");
        physicalDescriptionInput.value = catInfo.physicalDescription;

        const personalityInput = document.getElementById("personality");
        personalityInput.value = catInfo.personality;

        const adoptionFeeInput = document.getElementById("adoption-fee");
        adoptionFeeInput.value = catInfo.adoptionFee;

        const entryDateInput = document.getElementById("entry-date");
        entryDateInput.value = catInfo.entryDate;

        const dryFoodInput = document.getElementById("dry-food");
            if (catInfo.dryFood !== "Intuition" && catInfo.dryFood !== "Iams" && catInfo.dryFood !== "Purina One") {
                dryFoodInput.value = "Other";
                const otherDryFoodInput = document.getElementById("other-dry-food");
                otherDryFoodInput.classList.remove("hidden-input");
                otherDryFoodInput.classList.add("inline-input");
                otherDryFoodInput.value = catInfo.dryFood;
            } else {
                dryFoodInput.value = catInfo.dryFood;
            }

        const flavorDryFoodInput = document.getElementById("flavor-dry-food");
            if (catInfo.flavorDryFood !== "Chicken" && catInfo.flavorDryFood !== "Tuna" && catInfo.flavorDryFood !== "Salmon") {
                flavorDryFoodInput.value = "Other";
                const otherFlavorDryFoodInput = document.getElementById("other-flavor-dry-food");
                otherFlavorDryFoodInput.classList.remove("hidden-input");
                otherFlavorDryFoodInput.classList.add("inline-input");
                otherFlavorDryFoodInput.value = catInfo.flavorDryFood;
            } else {
                flavorDryFoodInput.value = catInfo.flavorDryFood;
            }

        const wetFoodInput = document.getElementById("wet-food");
            if (catInfo.wetFood === "N/A") {
                wetFoodInput.value = "N/A";
            } else if (catInfo.wetFood !== "Fancy Feast" && catInfo.wetFood !== "Iams") {
                wetFoodInput.value = "Other";
                const otherWetFoodInput = document.getElementById("other-wet-food");
                otherWetFoodInput.classList.remove("hidden-input");
                otherWetFoodInput.classList.add("inline-input");
                otherWetFoodInput.value = catInfo.wetFood;
            } else {
                wetFoodInput.value = catInfo.wetFood;
            }

        const flavorWetFoodInput = document.getElementById("flavor-wet-food");
            if (catInfo.wetFood === "N/A") {
                flavorWetFoodInput.value = "";
                flavorWetFoodInput.options[0].text = "N/A";
                flavorWetFoodInput.disabled = true;
            } else if (catInfo.flavorWetFood !== "Chicken" && catInfo.flavorWetFood !== "Tuna" && catInfo.flavorWetFood !== "Salmon") {
                    flavorWetFoodInput.value = "Other";
                    const otherFlavorWetFoodInput = document.getElementById("other-flavor-wet-food");
                    otherFlavorWetFoodInput.classList.remove("hidden-input");
                    otherFlavorWetFoodInput.classList.add("inline-input");
                    otherFlavorWetFoodInput.value = catInfo.flavorWetFood;
            } else {
                flavorWetFoodInput.value = catInfo.flavorWetFood;
            }

        const quantityWetFoodInput = document.getElementById("quantity-wet-food");
            if (catInfo.wetFood === "N/A") {
                quantityWetFoodInput.value = "";
                quantityWetFoodInput.options[0].text = "N/A";
                quantityWetFoodInput.disabled = true;
            } else {
                quantityWetFoodInput.value = catInfo.quantityWetFood;
            }

        const specialNeedsInput = document.getElementById("special-needs");
        specialNeedsInput.value = catInfo.specialNeeds;    
    }
    catch (error) {
        console.error(error.message);
    }

    await changeCatInfo(catName);
}

function capitalizeLetter(input) {
    const inputToCapitalize = document.getElementById(input);

    inputToCapitalize.addEventListener("input", () => {
        if (inputToCapitalize.value.includes("months") || inputToCapitalize.value.includes("years") ||
            inputToCapitalize.value.includes("month") || inputToCapitalize.value.includes("year")) {
                inputToCapitalize.value = inputToCapitalize.value.replace("months", "Months").replace("years", "Years")
                .replace("month", "Month").replace("year", "Year");
        }

        inputToCapitalize.value = inputToCapitalize.value.charAt(0).toUpperCase() + inputToCapitalize.value.slice(1);
    });
}

capitalizeLetter("cat-name");
capitalizeLetter("physical-description");
capitalizeLetter("personality");
capitalizeLetter("special-needs");
capitalizeLetter("age");
capitalizeLetter("other-dry-food");
capitalizeLetter("other-flavor-dry-food");
capitalizeLetter("other-wet-food");
capitalizeLetter("other-flavor-wet-food");

function toggleHiddenInput(selectId, inputId) {
    const selectElement = document.getElementById(selectId);
    const hiddenInput = document.getElementById(inputId);

    selectElement.addEventListener("change", () => {
        if (selectElement.value === "Other") {
            hiddenInput.classList.remove("hidden-input");
            hiddenInput.classList.add("inline-input");
            hiddenInput.required = true;
        } else {
            hiddenInput.classList.remove("inline-input");
            hiddenInput.classList.add("hidden-input");
            hiddenInput.required = false;
        }
    });
}

toggleHiddenInput("dry-food", "other-dry-food");
toggleHiddenInput("flavor-dry-food", "other-flavor-dry-food");
toggleHiddenInput("wet-food", "other-wet-food");
toggleHiddenInput("flavor-wet-food", "other-flavor-wet-food");

function noWetFood() {
    const wetFoodSelect = document.getElementById("wet-food");
    const flavorWetFoodSelect = document.getElementById("flavor-wet-food");
    const quantityWetFoodSelect = document.getElementById("quantity-wet-food");

    wetFoodSelect.addEventListener("change", () => {
        if (wetFoodSelect.value === "N/A") {
            flavorWetFoodSelect.value = "";
            flavorWetFoodSelect.options[0].text = "N/A";
            flavorWetFoodSelect.disabled = true;
            quantityWetFoodSelect.value = "";
            quantityWetFoodSelect.options[0].text = "N/A";
            quantityWetFoodSelect.disabled = true;
        } else {
            flavorWetFoodSelect.value = "";
            flavorWetFoodSelect.options[0].text = "Select Flavor";
            flavorWetFoodSelect.disabled = false;
            quantityWetFoodSelect.value = "";
            quantityWetFoodSelect.options[0].text = "Select Quantity";
            quantityWetFoodSelect.disabled = false;
        }
    });
}

noWetFood();