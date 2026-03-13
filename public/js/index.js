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

    const condoNumber = document.createElement("p");
    condoNumber.classList.add("condo-number");
    condoNumber.innerHTML = 
        `<strong>Condo: </strong>
        <a href="../condo.html?condoNumber=${cat.condoNumber}">${cat.condoNumber}</a>`;
    
    catCard.appendChild(condoNumber);

    const catName = document.createElement("p");
    catName.classList.add("cat-name");
    catName.innerHTML = 
        `<strong>Cat Name: </strong>
        <a href="../name.html?catName=${cat.catName}">${cat.catName}</a>`;

    catCard.appendChild(catName);

    const gender = document.createElement("p");
    gender.classList.add("gender");
    gender.innerHTML = `<strong>Gender: </strong><span>${cat.gender}</span>`;

    catCard.appendChild(gender);

    const age = document.createElement("p");
    age.classList.add("age");
    age.innerHTML = `<strong>Age: </strong><span>${cat.age}</span>`;

    catCard.appendChild(age);

    const physicalDescription = document.createElement("p");
    physicalDescription.classList.add("physical-description");
    physicalDescription.innerHTML = `<strong>Physical Description: </strong><span>${cat.physicalDescription}</span>`;

    catCard.appendChild(physicalDescription);
    
    const daysInStore = document.createElement("p");
    daysInStore.classList.add("days-in-store");
    daysInStore.innerHTML = `<strong>Days in Store: </strong><span>${cat.daysInStore}</span>`;

    catCard.appendChild(daysInStore);

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