const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const catName = urlParams.get("catName");

async function getCatInfoByName() {
    try {
        const response = await fetch(`http://localhost:8080/api/cats/name/${catName}`);
        const parsedData = await response.json();
        const catInfo = parsedData.data;

        return catInfo;
    }
    catch (error) {
        console.error(error.message);
    }
}

function createCatCard(cat) {
    const catInfo = document.getElementsByClassName("cat-info")[0];

    const condoNumber = document.createElement("p");
    condoNumber.classList.add("condo-number");
    condoNumber.innerHTML = 
        `<strong>Condo: </strong>
        <a href="../condo.html?condoNumber=${cat.condoNumber}">${cat.condoNumber}</a>`;
    
    catInfo.appendChild(condoNumber);

    const catName = document.createElement("p");
    catName.classList.add("cat-name");
    catName.innerHTML = `<strong>Cat Name: </strong><span>${cat.catName}</span>`;

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

    const rescueData = document.getElementsByClassName("rescue-data")[0];

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

    const careDetails = document.getElementsByClassName("care-details")[0];

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
}

async function renderCatsCards() {
    try {
        const catInfo = await getCatInfoByName();
        createCatCard(catInfo);
    }
    catch (error) {
        console.error(error.message);
    }
}

await renderCatsCards();