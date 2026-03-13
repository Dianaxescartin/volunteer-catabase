async function getCatInfo() {
    try {
        const response = await fetch("http://localhost:8080/api/cats");
        const parsedData = await response.json();
        const catInfo = parsedData.data;

        return catInfo;
    }
    catch (error) {
        console.error(error.message);
    }
}

function createCatCard(cat) {
    const catsContainer = document.getElementById("cats-container");
    const catCard = document.createElement("article");
    catCard.classList.add("cat-card");

    const catInfo = document.createElement("div");
    catInfo.classList.add("cat-info");
    const catInfoTitle = document.createElement("h3");
    catInfoTitle.classList.add("hidden-title");
    catInfoTitle.textContent = "Cat Information";

    catInfo.appendChild(catInfoTitle);
    catCard.appendChild(catInfo);

    const condoNumber = document.createElement("p");
    condoNumber.classList.add("condo-number");
    condoNumber.innerHTML =
        `<strong>Condo: </strong>
        <a href="../condo.html?condoNumber=${cat.condoNumber}">${cat.condoNumber}</a>`;
    
    catInfo.appendChild(condoNumber);

    const catName = document.createElement("p");
    catName.classList.add("cat-name");
    catName.innerHTML = 
        `<strong>Cat Name: </strong>
        <a href="../name.html?catName=${cat.catName}">${cat.catName}</a>`;

    catInfo.appendChild(catName);

    const gender = document.createElement("p");
    gender.classList.add("gender");
    gender.innerHTML = `<strong>Gender: </strong><span>${cat.gender}</span>`;

    catInfo.appendChild(gender);

    const age = document.createElement("p");
    age.classList.add("age");
    age.innerHTML = `<strong>Age: </strong><span>${cat.age}</span>`;

    catInfo.appendChild(age);

    const physicalDescription = document.createElement("p");
    physicalDescription.classList.add("physical-description");
    physicalDescription.innerHTML = `<strong>Physical Description: </strong><span>${cat.physicalDescription}</span>`;

    catInfo.appendChild(physicalDescription);

    const personality = document.createElement("p");
    personality.classList.add("personality");
    personality.innerHTML = `<strong>Personality: </strong><span>${cat.personality}</span>`;

    catInfo.appendChild(personality);

    const rescueData = document.createElement("div");
    rescueData.classList.add("rescue-data");
    const rescueDataTitle = document.createElement("h3");
    rescueDataTitle.classList.add("hidden-title");
    rescueDataTitle.textContent = "Rescue Data";

    rescueData.appendChild(rescueDataTitle);
    catCard.appendChild(rescueData);

    const adoptionFee = document.createElement("p");
    adoptionFee.classList.add("adoption-fee");
    adoptionFee.innerHTML = `<strong>Adoption Fee: </strong><span>$${cat.adoptionFee}</span>`;

    rescueData.appendChild(adoptionFee);

    const entryDate = document.createElement("p");
    entryDate.classList.add("entry-date");
    entryDate.innerHTML = `<strong>Entry Date: </strong><span>${cat.entryDate}</span>`;

    rescueData.appendChild(entryDate);

    const daysInStore = document.createElement("p");
    daysInStore.classList.add("days-in-store");
    daysInStore.innerHTML = `<strong>Days in Store: </strong><span>${cat.daysInStore}</span>`;

    rescueData.appendChild(daysInStore);

    const careDetails = document.createElement("div");
    careDetails.classList.add("care-details");
    const careDetailsTitle = document.createElement("h3");
    careDetailsTitle.classList.add("hidden-title");
    careDetailsTitle.textContent = "Care Details";

    careDetails.appendChild(careDetailsTitle);
    catCard.appendChild(careDetails);

    const dryFood = document.createElement("p");
    dryFood.classList.add("dry-food");
    dryFood.innerHTML = `<strong>Dry Food: </strong><span>${cat.dryFood}</span>`;

    careDetails.appendChild(dryFood);

    const flavorDryFood = document.createElement("p");
    flavorDryFood.classList.add("flavor-dry-food");
    flavorDryFood.innerHTML = `<strong>Flavor of Dry Food: </strong><span>${cat.flavorDryFood}</span>`;

    careDetails.appendChild(flavorDryFood);

    const wetFood = document.createElement("p");
    wetFood.classList.add("wet-food");
    wetFood.innerHTML = `<strong>Wet Food: </strong><span>${cat.wetFood}</span>`;

    careDetails.appendChild(wetFood);

    const flavorWetFood = document.createElement("p");
    flavorWetFood.classList.add("flavor-wet-food");
    flavorWetFood.innerHTML = `<strong>Flavor of Wet Food: </strong><span>${cat.flavorWetFood}</span>`;

    careDetails.appendChild(flavorWetFood);

    const quantityWetFood = document.createElement("p");
    quantityWetFood.classList.add("quantity-wet-food");
    quantityWetFood.innerHTML = `<strong>Quantity of Wet Food: </strong><span>${cat.quantityWetFood}</span>`;

    careDetails.appendChild(quantityWetFood);

    const specialNeeds = document.createElement("p");
    specialNeeds.classList.add("special-needs");
    specialNeeds.innerHTML = `<strong>Special Needs: </strong><span>${cat.specialNeeds}</span>`;

    careDetails.appendChild(specialNeeds);
    
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttons-container");
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";

    buttonContainer.appendChild(editButton);
    catCard.appendChild(buttonContainer);
    
    catsContainer.appendChild(catCard);
}

async function renderCatsCards() {
    try {
        const catInfo = await getCatInfo();
        catInfo.forEach((cat) =>
            createCatCard(cat)
        );
    }
    catch (error) {
        console.error(error.message);
    }
}

await renderCatsCards();