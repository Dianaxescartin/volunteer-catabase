import { addChecklistInfo, changeChecklistInfo } from "./checklistActions.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const dateChecklist = urlParams.get("date");

async function addOrEditChecklistInfo() {
    const currentUrl = new URL(window.location.href);
    const urlForAdding = new URL("http://localhost:8080/add-edit-checklist.html");
    const urlForEditing = new URL(`http://localhost:8080/add-edit-checklist.html?date=${dateChecklist}`);

    if (currentUrl.href === urlForAdding.href) {
        await newChecklistInfo();
    } else if (currentUrl.href === urlForEditing.href) {
        await editChecklistInfo();
    }
}

addOrEditChecklistInfo();

async function editChecklistInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const dateChecklist = urlParams.get("date");

    try {
        const response = await fetch(`http://localhost:8080/api/checklists/${dateChecklist}`);
        const parsedData = await response.json();
        const checklistInfo = parsedData.data[0];

        console.log(checklistInfo);
        renderChecklistCardToEdit(checklistInfo)

        capitalizeLetter("volunteer-name");
        
        const condoNumbers = checklistInfo.careTasks.map(task => task.condoNumber);
        condoNumbers.forEach(condoNumber => {
            toggleHiddenInput(`cats-healthy-${condoNumber}`, `symptoms-${condoNumber}`);
            capitalizeLetter(`symptoms-${condoNumber}`);
            capitalizeLetter(`comments-${condoNumber}`);
        });

    }
    catch (error) {
        console.error(error.message);
    }

    await changeChecklistInfo(dateChecklist);
}

function renderChecklistCardToEdit(checklistInfo) {
    const checklistForm = document.getElementById("checklist-form");

    const dateInput = document.getElementById("date");
    dateInput.value = new Date(checklistInfo.date).toISOString().split("T")[0];

    const volunteerNameInput = document.getElementById("volunteer-name");
    volunteerNameInput.value = checklistInfo.volunteerName; 
    
    const checklistCard = document.createElement("article");
    checklistCard.classList.add("checklist-card");

    const condoNumbers = checklistInfo.careTasks.map(task => task.condoNumber);
    condoNumbers.forEach(condoNumber => {
        
        const detailsChecklistCard = document.createElement("details");
        detailsChecklistCard.id = `condo-${condoNumber}`;
        detailsChecklistCard.innerHTML = `<summary>Condo ${condoNumber}</summary>`;
        checklistCard.appendChild(detailsChecklistCard);
        const fieldsetChecklistCard = document.createElement("fieldset");
        fieldsetChecklistCard.innerHTML = `<legend><h2>Daily Checklist</h2></legend>`;
        detailsChecklistCard.appendChild(fieldsetChecklistCard);
   
        const CondoNumberCatInfoSection = document.createElement("section");
        CondoNumberCatInfoSection.classList.add(`condo-${condoNumber}-cat-info`);
        fieldsetChecklistCard.appendChild(CondoNumberCatInfoSection);
        
        const fieldsetCatInfo = document.createElement("fieldset");
        fieldsetCatInfo.classList.add("checklist-cat-info");
        fieldsetCatInfo.innerHTML = `<legend class="condo-${condoNumber}"><h4>Condo ${condoNumber}</h4></legend>`;
        CondoNumberCatInfoSection.appendChild(fieldsetCatInfo);

        const condoCatInfo = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber);
        if (condoCatInfo) {
                condoCatInfo.cats.forEach(cat => {
                const catNameParagraph = document.createElement("p");
                catNameParagraph.classList.add("cat-name");
                catNameParagraph.innerHTML = `<strong>Cat Name: </strong><span>${cat.catName}</span>`;
                fieldsetCatInfo.appendChild(catNameParagraph);

                const physicalDescriptionParagraph = document.createElement("p");
                physicalDescriptionParagraph.classList.add("physical-description");
                physicalDescriptionParagraph.innerHTML = `<strong>Physical Description: </strong><span>${cat.physicalDescription}</span>`;
                fieldsetCatInfo.appendChild(physicalDescriptionParagraph);
            });
        }

        const HealthSection = document.createElement("section");
        HealthSection.classList.add(`checklist-health`);
        const areCatsHealthy = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber).areCatsHealthy;
        const symptoms = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber).symptoms;

        HealthSection.innerHTML = `
            <label for="cats-healthy-${condoNumber}">Do the kitties look healthy?</label>
            <select id="cats-healthy-${condoNumber}" name="cats-healthy-${condoNumber}">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>`;
        HealthSection.querySelector(`#cats-healthy-${condoNumber}`).value = areCatsHealthy;

        if (areCatsHealthy === "No") {
            let symptomsLabel = document.createElement("label");
            symptomsLabel.setAttribute("for", `symptoms-${condoNumber}`);
            symptomsLabel.innerText = "Please specify the cat name and describe the symptoms you observed: ";
            HealthSection.appendChild(symptomsLabel);
            let symptomsTextarea = document.createElement("textarea");
            symptomsTextarea.id = `symptoms-${condoNumber}`;
            symptomsTextarea.name = `symptoms-${condoNumber}`;
            symptomsTextarea.placeholder = "e.g. Frosty has soft stools";
            symptomsTextarea.value = symptoms;
            HealthSection.appendChild(symptomsTextarea);
        } else {
            let symptomsLabel = document.createElement("label");
            symptomsLabel.setAttribute("for", `symptoms-${condoNumber}`);
            symptomsLabel.classList.add("hidden-label");
            symptomsLabel.innerText = "Please specify the cat name and describe the symptoms you observed: ";
            HealthSection.appendChild(symptomsLabel);
            let symptomsTextarea = document.createElement("textarea");
            symptomsTextarea.id = `symptoms-${condoNumber}`;
            symptomsTextarea.name = `symptoms-${condoNumber}`;
            symptomsTextarea.placeholder = "e.g. Frosty has soft stools";
            symptomsTextarea.classList.add("hidden-textarea");
            symptomsTextarea.value = symptoms;
            HealthSection.appendChild(symptomsTextarea);
        }        

        fieldsetChecklistCard.appendChild(HealthSection);

        const generalCareSection = document.createElement("section");
        generalCareSection.classList.add(`general-care-details`);
        generalCareSection.innerHTML = `<p><em>Remember to take out all the bowls before you start to clean.</em></p>`
        const ulGeneralCare = document.createElement("ul");
        const generalCareTasks = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber);

        const isCondoCleaned = generalCareTasks.isCondoCleaned === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="condo-cleaned-${condoNumber}" name="condo-cleaned-${condoNumber}" ${isCondoCleaned}>
            <label for="condo-cleaned-${condoNumber}">Clean condo surfaces</label></li>`;
        const isLitterBoxCleaned = generalCareTasks.isLitterBoxCleaned === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="litter-box-cleaned-${condoNumber}" name="litter-box-cleaned-${condoNumber}" ${isLitterBoxCleaned}>
            <label for="litter-box-cleaned-${condoNumber}">Clean litter box</label></li>`;
        const isLitterBoxRefilled = generalCareTasks.isLitterBoxRefilled === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="litter-box-refilled-${condoNumber}" name="litter-box-refilled-${condoNumber}" ${isLitterBoxRefilled}>
            <label for="litter-box-refilled-${condoNumber}">Refill litter box (if necessary)</label></li>`;
        const areBedsChanged = generalCareTasks.areBedsChanged === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="beds-changed-${condoNumber}" name="beds-changed-${condoNumber}" ${areBedsChanged}>
            <label for="beds-changed-${condoNumber}">Change beds (if they are dirty)</label></li>`;
        const isSweepingDone = generalCareTasks.isSweepingDone === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="sweeping-done-${condoNumber}" name="sweeping-done-${condoNumber}" ${isSweepingDone}>
            <label for="sweeping-done-${condoNumber}">Sweep around and under condo</label></li>`;
        generalCareSection.appendChild(ulGeneralCare);
        fieldsetChecklistCard.appendChild(generalCareSection);

        const specificCareSection = document.createElement("section");
        specificCareSection.classList.add(`specific-care-details`);
        specificCareSection.innerHTML = `<p><em>Now, put in the bowls inside the condo using the following instructions:</em></p>`;
        const ulSpecificCare = document.createElement("ul");
        ulSpecificCare.classList.add(`food-water-needs`);
        const specificCareTasks = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber);

        const dryFoodInfo = document.createElement("div");
        dryFoodInfo.innerHTML = `<fieldset class="checklist-cat-info"><legend><h4>Dry Food</h4></legend>
        <p><strong>Brand: </strong>${specificCareTasks.dryFood}<br>
        <strong> Flavor: </strong>${specificCareTasks.flavorDryFood}</p></fieldset>`;
        ulSpecificCare.appendChild(dryFoodInfo);

        const isDryFoodRefilled = specificCareTasks.isDryFoodRefilled === "true" ? "checked" : "";
        ulSpecificCare.innerHTML += 
            `<li><input type="checkbox" id="dry-food-refilled-${condoNumber}" name="dry-food-refilled-${condoNumber}" ${isDryFoodRefilled}>
            <label for="dry-food-refilled-${condoNumber}">Refill 1/2 dry food bowl</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        const wetFoodInfo = document.createElement("div");
        wetFoodInfo.innerHTML = `<fieldset class="checklist-cat-info"><legend><h4>Wet Food</h4></legend>
        <p><strong>Brand: </strong>${specificCareTasks.wetFood}<br>
        <strong>Flavor: </strong>${specificCareTasks.flavorWetFood}<br>
        <strong>Quantity: </strong>${specificCareTasks.quantityWetFood}</p></fieldset>`;
        ulSpecificCare.appendChild(wetFoodInfo);

        const isWetFoodGiven = specificCareTasks.isWetFoodGiven === "true" ? "checked" : "";
        ulSpecificCare.innerHTML += 
            `<li><input type="checkbox" id="wet-food-given-${condoNumber}" name="wet-food-given-${condoNumber}" ${isWetFoodGiven}>
            <label for="wet-food-given-${condoNumber}">Give wet food</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        const isWaterRefilled = specificCareTasks.isWaterRefilled === "true" ? "checked" : "";
        ulSpecificCare.innerHTML += 
                `<li><input type="checkbox" id="water-refilled-${condoNumber}" name="water-refilled-${condoNumber}" ${isWaterRefilled}>
                <label for="water-refilled-${condoNumber}">Change water bowl</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        const specialNeedsInfo = document.createElement("div");
        const fieldsetSpecialNeeds = document.createElement("fieldset");
        fieldsetSpecialNeeds.classList.add("checklist-cat-info");
        fieldsetSpecialNeeds.innerHTML = `<legend><h4>Special Needs</h4></legend></fieldset>`;
        fieldsetSpecialNeeds.appendChild(specialNeedsInfo);
        condoCatInfo.cats.forEach(cat => {
                specialNeedsInfo.innerHTML += `<p><strong>${cat.catName}: </strong>${cat.specialNeeds}</p>`;
                ulSpecificCare.appendChild(fieldsetSpecialNeeds);
            });

        const areSpecialNeedsAttended = specificCareTasks.areSpecialNeedsAttended === "true" ? "checked" : "";
        ulSpecificCare.innerHTML +=
                `<li><input type="checkbox" id="special-needs-attended-${condoNumber}" name="special-needs-attended-${condoNumber}" ${areSpecialNeedsAttended}>
                <label for="special-needs-attended-${condoNumber}">Attend special needs</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        fieldsetChecklistCard.appendChild(specificCareSection);

        const endSection = document.createElement("section");
        endSection.classList.add(`checklist-end`);
        const ulEndSection = document.createElement("ul");
        const lastTask = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber);
        endSection.appendChild(ulEndSection);

        const isCondoLocked = lastTask.isCondoLocked === "true" ? "checked" : "";
        ulEndSection.innerHTML +=
            `<li><input type="checkbox" id="condo-locked-${condoNumber}" name="condo-locked-${condoNumber}" ${isCondoLocked}>
            <label for="condo-locked-${condoNumber}">Lock condo</label></li>`;
        const  commentsLabel = document.createElement("label");
        commentsLabel.setAttribute("for", `comments-${condoNumber}`);
        commentsLabel.innerText = "Comments: ";
        endSection.appendChild(commentsLabel);
        let commentsTextarea = document.createElement("textarea");
        commentsTextarea.id = `comments-${condoNumber}`;
        commentsTextarea.name = `comments-${condoNumber}`;
        commentsTextarea.placeholder = "Enter any comments here";
        commentsTextarea.value = lastTask.comments;
        endSection.appendChild(commentsTextarea);

        fieldsetChecklistCard.appendChild(endSection);
    });

    checklistForm.appendChild(checklistCard);

    const buttonsContainer = document.querySelector(".buttons-container");
    checklistCard.after(buttonsContainer);
}

async function newChecklistInfo() {
    try {
        const response = await fetch(`http://localhost:8080/api/cats`);
        const parsedData = await response.json();
        const catsInfo = parsedData.data;
        const condoNumbersUnique = [...new Set(catsInfo.map(cat => cat.condoNumber))];

        renderChecklistCardToAdd(catsInfo, condoNumbersUnique);

        capitalizeLetter("volunteer-name");
        

        condoNumbersUnique.forEach(condoNumber => {
            toggleHiddenInput(`cats-healthy-${condoNumber}`, `symptoms-${condoNumber}`);
            capitalizeLetter(`symptoms-${condoNumber}`);
            capitalizeLetter(`comments-${condoNumber}`);
        });

    }
    catch (error) {
        console.error(error.message);
    }

    await addChecklistInfo();
}

function renderChecklistCardToAdd(catsInfo, condoNumbersUnique) {
    const checklistForm = document.getElementById("checklist-form");
    
    const checklistCard = document.createElement("article");
    checklistCard.classList.add("checklist-card");

    condoNumbersUnique.forEach(condoNumber => {
        
        const detailsChecklistCard = document.createElement("details");
        detailsChecklistCard.id = `condo-${condoNumber}`;
        detailsChecklistCard.innerHTML = `<summary>Condo ${condoNumber}</summary>`;
        checklistCard.appendChild(detailsChecklistCard);
        const fieldsetChecklistCard = document.createElement("fieldset");
        fieldsetChecklistCard.innerHTML = `<legend><h2>Daily Checklist</h2></legend>`;
        detailsChecklistCard.appendChild(fieldsetChecklistCard);
   
        const CondoNumberCatInfoSection = document.createElement("section");
        CondoNumberCatInfoSection.classList.add(`condo-${condoNumber}-cat-info`);
        fieldsetChecklistCard.appendChild(CondoNumberCatInfoSection);
        
        const fieldsetCatInfo = document.createElement("fieldset");
        fieldsetCatInfo.classList.add("checklist-cat-info");
        fieldsetCatInfo.innerHTML = `<legend class="condo-${condoNumber}"><h4>Condo ${condoNumber}</h4></legend>`;
        CondoNumberCatInfoSection.appendChild(fieldsetCatInfo);

        const condoCatInfo = catsInfo.filter(cat => cat.condoNumber === condoNumber);
        if (condoCatInfo) {
                condoCatInfo.forEach(cat => {
                const catNameParagraph = document.createElement("p");
                catNameParagraph.classList.add("cat-name");
                catNameParagraph.innerHTML = `<strong>Cat Name: </strong><span>${cat.catName}</span>`;
                fieldsetCatInfo.appendChild(catNameParagraph);

                const physicalDescriptionParagraph = document.createElement("p");
                physicalDescriptionParagraph.classList.add("physical-description");
                physicalDescriptionParagraph.innerHTML = `<strong>Physical Description: </strong><span>${cat.physicalDescription}</span>`;
                fieldsetCatInfo.appendChild(physicalDescriptionParagraph);
            });
        }

        const HealthSection = document.createElement("section");
        
        HealthSection.classList.add(`checklist-health`);
        HealthSection.innerHTML = `
            <label for="cats-healthy-${condoNumber}">Do the kitties look healthy?</label>
            <select id="cats-healthy-${condoNumber}" name="cats-healthy-${condoNumber}">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>`;

        let symptomsLabel = document.createElement("label");
        symptomsLabel.setAttribute("for", `symptoms-${condoNumber}`);
        symptomsLabel.classList.add("hidden-label");
        symptomsLabel.innerText = "Please specify the cat name and describe the symptoms you observed: ";
        HealthSection.appendChild(symptomsLabel);

        let symptomsTextarea = document.createElement("textarea");
        symptomsTextarea.id = `symptoms-${condoNumber}`;
        symptomsTextarea.name = `symptoms-${condoNumber}`;
        symptomsTextarea.placeholder = "e.g. Frosty has soft stools";
        symptomsTextarea.classList.add("hidden-textarea");
        HealthSection.appendChild(symptomsTextarea);   

        fieldsetChecklistCard.appendChild(HealthSection);

        const generalCareSection = document.createElement("section");
        generalCareSection.classList.add(`general-care-details`);
        generalCareSection.innerHTML = `<p><em>Remember to take out all the bowls before you start to clean.</em></p>`
        const ulGeneralCare = document.createElement("ul");
        const generalCareTasks = catsInfo.find(cat => cat.condoNumber === condoNumber);

        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="condo-cleaned-${condoNumber}" name="condo-cleaned-${condoNumber}">
            <label for="condo-cleaned-${condoNumber}">Clean condo surfaces</label></li>`;
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="litter-box-cleaned-${condoNumber}" name="litter-box-cleaned-${condoNumber}">
            <label for="litter-box-cleaned-${condoNumber}">Clean litter box</label></li>`;
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="litter-box-refilled-${condoNumber}" name="litter-box-refilled-${condoNumber}">
            <label for="litter-box-refilled-${condoNumber}">Refill litter box (if necessary)</label></li>`;
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="beds-changed-${condoNumber}" name="beds-changed-${condoNumber}">
            <label for="beds-changed-${condoNumber}">Change beds (if they are dirty)</label></li>`;
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="sweeping-done-${condoNumber}" name="sweeping-done-${condoNumber}">
            <label for="sweeping-done-${condoNumber}">Sweep around and under condo</label></li>`;
        generalCareSection.appendChild(ulGeneralCare);
        fieldsetChecklistCard.appendChild(generalCareSection);

        const specificCareSection = document.createElement("section");
        specificCareSection.classList.add(`specific-care-details`);
        specificCareSection.innerHTML = `<p><em>Now, put in the bowls inside the condo using the following instructions:</em></p>`;
        const ulSpecificCare = document.createElement("ul");
        ulSpecificCare.classList.add(`food-water-needs`);
        const specificCareTasks = catsInfo.find(cat => cat.condoNumber === condoNumber);

        const dryFoodInfo = document.createElement("div");
        dryFoodInfo.innerHTML = `<fieldset class="checklist-cat-info"><legend><h4>Dry Food</h4></legend>
        <p><strong>Brand: </strong>${specificCareTasks.dryFood}<br>
        <strong> Flavor: </strong>${specificCareTasks.flavorDryFood}</p></fieldset>`;
        ulSpecificCare.appendChild(dryFoodInfo);

        ulSpecificCare.innerHTML += 
            `<li><input type="checkbox" id="dry-food-refilled-${condoNumber}" name="dry-food-refilled-${condoNumber}">
            <label for="dry-food-refilled-${condoNumber}">Refill 1/2 dry food bowl</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        const wetFoodInfo = document.createElement("div");
        wetFoodInfo.innerHTML = `<fieldset class="checklist-cat-info"><legend><h4>Wet Food</h4></legend>
        <p><strong>Brand: </strong>${specificCareTasks.wetFood}<br>
        <strong>Flavor: </strong>${specificCareTasks.flavorWetFood}<br>
        <strong>Quantity: </strong>${specificCareTasks.quantityWetFood}</p></fieldset>`;
        ulSpecificCare.appendChild(wetFoodInfo);

        ulSpecificCare.innerHTML += 
            `<li><input type="checkbox" id="wet-food-given-${condoNumber}" name="wet-food-given-${condoNumber}">
            <label for="wet-food-given-${condoNumber}">Give wet food</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        ulSpecificCare.innerHTML += 
                `<li><input type="checkbox" id="water-refilled-${condoNumber}" name="water-refilled-${condoNumber}">
                <label for="water-refilled-${condoNumber}">Change water bowl</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        const specialNeedsInfo = document.createElement("div");
        const fieldsetSpecialNeeds = document.createElement("fieldset");
        fieldsetSpecialNeeds.classList.add("checklist-cat-info");
        fieldsetSpecialNeeds.innerHTML = `<legend><h4>Special Needs</h4></legend></fieldset>`;
        fieldsetSpecialNeeds.appendChild(specialNeedsInfo);
        catsInfo.forEach(cat => {
            if (cat.condoNumber === condoNumber) {
                specialNeedsInfo.innerHTML += `<p><strong>${cat.catName}: </strong>${cat.specialNeeds}</p>`;
                ulSpecificCare.appendChild(fieldsetSpecialNeeds);
            }
        });

        ulSpecificCare.innerHTML +=
                `<li><input type="checkbox" id="special-needs-attended-${condoNumber}" name="special-needs-attended-${condoNumber}">
                <label for="special-needs-attended-${condoNumber}">Attend special needs</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        fieldsetChecklistCard.appendChild(specificCareSection);

        const endSection = document.createElement("section");
        endSection.classList.add(`checklist-end`);
        const ulEndSection = document.createElement("ul");
        ulEndSection.innerHTML +=
            `<li><input type="checkbox" id="condo-locked-${condoNumber}" name="condo-locked-${condoNumber}">
            <label for="condo-locked-${condoNumber}">Lock condo</label></li>`;
        endSection.appendChild(ulEndSection);

        const  commentsLabel = document.createElement("label");
        commentsLabel.setAttribute("for", `comments-${condoNumber}`);
        commentsLabel.innerText = "Comments: ";
        endSection.appendChild(commentsLabel);
        const commentsTextarea = document.createElement("textarea");
        commentsTextarea.id = `comments-${condoNumber}`;
        commentsTextarea.name = `comments-${condoNumber}`;
        commentsTextarea.placeholder = "Enter any comments here";
        endSection.appendChild(commentsTextarea);

        fieldsetChecklistCard.appendChild(endSection);
    });

    checklistForm.appendChild(checklistCard);

    const buttonsContainer = document.querySelector(".buttons-container");
    checklistCard.after(buttonsContainer);
}

function capitalizeLetter(input) {
    const inputToCapitalize = document.getElementById(input);

    inputToCapitalize.addEventListener("input", () => {
        inputToCapitalize.value = inputToCapitalize.value.charAt(0).toUpperCase() + inputToCapitalize.value.slice(1);
    });
}


function toggleHiddenInput(selectId, inputId) {
    const selectElement = document.getElementById(selectId);
    const hiddenTextarea = document.getElementById(inputId);
    const hiddenLabel = document.querySelector(`label[for="${inputId}"]`);

    selectElement.addEventListener("change", () => {
        if (selectElement.value === "No") {
            hiddenTextarea.classList.remove("hidden-textarea");
            hiddenLabel.classList.remove("hidden-label");
            hiddenTextarea.required = true;
        } else {
            hiddenTextarea.classList.add("hidden-textarea");
            hiddenLabel.classList.add("hidden-label");
            hiddenTextarea.required = false;
        }
    });
}