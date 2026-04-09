import { deleteChecklistInfo } from "./checklistActions.js";

async function addFindChecklistEvent() {
    const findButton = document.getElementById("find-checklist-button");
    findButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const dateInput = document.getElementById("checklist-date");
        const date = dateInput.value;

        if(!date) {
            alert("Please enter a date to find the checklist.");
            return;
        }

        if (date) {
            showHiddenChecklist();
            await renderChecklistCards(date);
        }
    });
}

addFindChecklistEvent();

function showHiddenChecklist() {
    const homeButton = document.getElementById("home-button");
    const checklistButton = document.createElement("button");
    checklistButton.id = "checklist-info-button";
    checklistButton.textContent = "Checklist Section";
    checklistButton.innerHTML = `<a href="checklistInfo.html">Checklist Section</a>`;
    homeButton.insertAdjacentElement("afterend", checklistButton);
    
    const aside = document.querySelector("aside");
    aside.id = "hidden";
    
    const checklistContainer = document.querySelector("main");
    checklistContainer.id = "checklist-container";
}

async function getChecklistInfoByDate(date) {
    try {
        const response = await fetch(`http://localhost:8080/api/checklists/${date}`);
        if (!response.ok) {
            return null;
        }
        const parsedData = await response.json();
        const checklistInfo = parsedData.data[0];

        return checklistInfo;
    }
    catch (error) {
    console.error(error.message);
    }
}

function createChecklistCard(checklistInfo) {
    const checklistContainer = document.getElementById("checklist-container");

    const checklistHeader = document.createElement("article");
    checklistHeader.id = "checklist-header";

    const dateParagraph = document.createElement("p");
    dateParagraph.id = "date";
    dateParagraph.innerHTML = `<strong>Date: </strong><span>${new Date(checklistInfo.date).toLocaleDateString(undefined, {timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit'})}</span>`;

    const volunteerNameParagraph = document.createElement("p");
    volunteerNameParagraph.id = "volunteer-name";
    volunteerNameParagraph.innerHTML = `<strong>Volunteer Name: </strong><span>${checklistInfo.volunteerName}</span>`;

    checklistHeader.appendChild(dateParagraph);
    checklistHeader.appendChild(volunteerNameParagraph);
    
    checklistContainer.appendChild(checklistHeader);

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
        HealthSection.innerHTML = `<p id="cats-healthy-${condoNumber}"><strong>Do the kitties look healthy? </strong><span>${areCatsHealthy}</span></p>`;
        if (areCatsHealthy === "No") {
            const symptoms = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber).symptoms;
            const symptomsParagraph = document.createElement("p");
            symptomsParagraph.id = `symptoms-${condoNumber}`;
            symptomsParagraph.innerHTML = `<strong>Symptoms: </strong><span>${symptoms}</span>`;
            HealthSection.appendChild(symptomsParagraph);
        }
        fieldsetChecklistCard.appendChild(HealthSection);

        const generalCareSection = document.createElement("section");
        generalCareSection.classList.add(`general-care-details`);
        generalCareSection.innerHTML = `<p><em>Remember to take out all the bowls before you start to clean.</em></p>`;
        const ulGeneralCare = document.createElement("ul");
        const generalCareTasks = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber);

        const isCondoCleaned = generalCareTasks.isCondoCleaned === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="condo-cleaned-${condoNumber}" name="condo-cleaned-${condoNumber}" ${isCondoCleaned} disabled>
            <label for="condo-cleaned-${condoNumber}">Clean condo surfaces</label></li>`;
        const isLitterBoxCleaned = generalCareTasks.isLitterBoxCleaned === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="litter-box-cleaned-${condoNumber}" name="litter-box-cleaned-${condoNumber}" ${isLitterBoxCleaned} disabled>
            <label for="litter-box-cleaned-${condoNumber}">Clean litter box</label></li>`;
        const isLitterBoxRefilled = generalCareTasks.isLitterBoxRefilled === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="litter-box-refilled-${condoNumber}" name="litter-box-refilled-${condoNumber}" ${isLitterBoxRefilled} disabled>
            <label for="litter-box-refilled-${condoNumber}">Refill litter box (if necessary)</label></li>`;
        const areBedsChanged = generalCareTasks.areBedsChanged === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="beds-changed-${condoNumber}" name="beds-changed-${condoNumber}" ${areBedsChanged} disabled>
            <label for="beds-changed-${condoNumber}">Change beds (if they are dirty)</label></li>`;
        const isSweepingDone = generalCareTasks.isSweepingDone === "true" ? "checked" : "";
        ulGeneralCare.innerHTML += 
            `<li><input type="checkbox" id="sweeping-done-${condoNumber}" name="sweeping-done-${condoNumber}" ${isSweepingDone} disabled>
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
            `<li><input type="checkbox" id="dry-food-refilled-${condoNumber}" name="dry-food-refilled-${condoNumber}" ${isDryFoodRefilled} disabled>
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
            `<li><input type="checkbox" id="wet-food-given-${condoNumber}" name="wet-food-given-${condoNumber}" ${isWetFoodGiven} disabled>
            <label for="wet-food-given-${condoNumber}">Give wet food</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        const isWaterRefilled = specificCareTasks.isWaterRefilled === "true" ? "checked" : "";
        ulSpecificCare.innerHTML += 
                `<li><input type="checkbox" id="water-refilled-${condoNumber}" name="water-refilled-${condoNumber}" ${isWaterRefilled} disabled>
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
                `<li><input type="checkbox" id="special-needs-attended-${condoNumber}" name="special-needs-attended-${condoNumber}" ${areSpecialNeedsAttended} disabled>
                <label for="special-needs-attended-${condoNumber}">Attend special needs</label></li>`;
        specificCareSection.appendChild(ulSpecificCare);

        fieldsetChecklistCard.appendChild(specificCareSection);

        const endSection = document.createElement("section");
        endSection.classList.add(`checklist-end`);
        const ulEndSection = document.createElement("ul");
        const lastTask = checklistInfo.careTasks.find(task => task.condoNumber === condoNumber);
        
        const isCondoLocked = lastTask.isCondoLocked === "true" ? "checked" : "";
        ulEndSection.innerHTML +=
        `<li><input type="checkbox" id="condo-locked-${condoNumber}" name="condo-locked-${condoNumber}" ${isCondoLocked} disabled>
        <label for="condo-locked-${condoNumber}">Lock condo</label></li>`;
        endSection.appendChild(ulEndSection);

        const comments = document.createElement("p");
        comments.id = `comments-${condoNumber}`;
        comments.innerHTML = `<strong>Comments: </strong>${lastTask.comments}`;
        endSection.appendChild(comments);

        fieldsetChecklistCard.appendChild(endSection);
    });

    checklistContainer.appendChild(checklistCard);

    const buttonsContainer = document.querySelector(".buttons-container");
    checklistCard.after(buttonsContainer);

    const editButton = document.querySelector(".edit-button");
    editButton.innerHTML = `<a href="../add-edit-checklist.html?date=${checklistInfo.date}">Edit</a>`;

    const deleteButton = document.querySelector(".delete-button");
    deleteButton.addEventListener("click", async (e) => {
        if (window.confirm(`Are you sure you want to delete the checklist for ${new Date(checklistInfo.date).toLocaleDateString(undefined, {timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit'})}`)) {
            e.preventDefault();
            await deleteChecklistInfo(checklistInfo.date);
            alert(`The checklist for ${new Date(checklistInfo.date).toLocaleDateString(undefined, {timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit'})} has been deleted.`);
            window.location.href = "../index.html";
        }
    });
};

async function renderChecklistCards(date) {
    try {
        const checklistInfo = await getChecklistInfoByDate(date);
        if (checklistInfo) {
            createChecklistCard(checklistInfo);
        } else {
            const checklistContainer = document.getElementById("checklist-container");
            const noChecklistMessage = document.createElement("h2");
            noChecklistMessage.innerHTML = "No checklist found for the selected date.<br>Please try another date!";
            checklistContainer.appendChild(noChecklistMessage);
            const buttonsContainer = document.querySelector(".buttons-container");
            buttonsContainer.style.display = "none";
        }
    }
    catch (error) {
        console.error(error.message);
    }
}