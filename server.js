import express from "express";
import moment from 'moment';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

moment().format("YYYY-MM-DD");

app.get('/', (req, res) => {
  res.send('Welcome to the Volunteer Catabase!');
})

// Using moment library to calculate days in store
function calculateDaysInStore(entryDate) {
    const currentDate = moment();
    const entryDateCat = moment(entryDate);
    const daysInStore = currentDate.diff(entryDateCat, 'days');
    return daysInStore;
}

const catInfo = [
    { condoNumber: 1, catName: "Frosty", gender: "male", age: "3 years", physicalDescription: "white with gray", personality: "calm and friendly",
        adoptionFee: 180, entryDate: "2026-02-25", daysInStore: 0, 
        dryFood: "iams", flavorDryFood: "chicken", wetFood: "iams", flavorWetFood: "salmon", quantityWetFood: "a quarter of can", 
        specialNeeds: "add a spoon of probiotics powder to the dry food bowl"
    },
    { condoNumber: 2, catName: "Luffy", gender: "male", age: "4 months", physicalDescription: "white", personality: "calm and friendly",
        adoptionFee: 150, entryDate: "2026-02-20", daysInStore: 0, 
        dryFood: "intuition", flavorDryFood: "chicken", wetFood: "N/A", flavorWetFood: "N/A", quantityWetFood: "N/A", 
        specialNeeds: "N/A"
    },
    { condoNumber: 2, catName: "Nami", gender: "female", age: "4 months", physicalDescription: "brown tabby", personality: "playful and outgoing",
        adoptionFee: 150, entryDate: "2026-02-20", daysInStore: 0, 
        dryFood: "intuition", flavorDryFood: "chicken", wetFood: "N/A", flavorWetFood: "N/A", quantityWetFood: "N/A", 
        specialNeeds: "N/A"
    }
]

function getAllCats() {
    catInfo.forEach((cat) => {
        cat.daysInStore = calculateDaysInStore(cat.entryDate);
    });
    catInfo.sort((a, b) => a.condoNumber - b.condoNumber);
    
    return catInfo;
}

function getCatsByCondo(condoNumber) {
    const condo = parseInt(condoNumber);
    const catsInCondo = catInfo.filter((cat) => cat.condoNumber === condo);
    catsInCondo.forEach((cat) => {
        cat.daysInStore = calculateDaysInStore(cat.entryDate);
    });

    return catsInCondo;
}

function getCatByName(catName) { 
    const cat = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

    if (!cat) {
        return undefined;
    }
    cat.daysInStore = calculateDaysInStore(cat.entryDate);

    return cat;
}

function createCat(requestBody) {
    const newCat = {
        condoNumber: requestBody.condoNumber,
        catName: requestBody.catName,
        gender: requestBody.gender,
        age: requestBody.age,
        physicalDescription: requestBody.physicalDescription,
        personality: requestBody.personality,
        adoptionFee: requestBody.adoptionFee,
        entryDate: requestBody.entryDate,
        daysInStore: 0,
        dryFood: requestBody.dryFood,
        flavorDryFood: requestBody.flavorDryFood,
        wetFood: requestBody.wetFood,
        flavorWetFood: requestBody.flavorWetFood,
        quantityWetFood: requestBody.quantityWetFood,
        specialNeeds: requestBody.specialNeeds || "No special needs"
    };

        if (!newCat.condoNumber || !newCat.catName || !newCat.gender || !newCat.age || !newCat.physicalDescription 
            || !newCat.adoptionFee || !newCat.entryDate || !newCat.dryFood || !newCat.flavorDryFood || !newCat.wetFood 
            || !newCat.flavorWetFood || !newCat.quantityWetFood) {
        return undefined;
    }

    catInfo.push(newCat)
    newCat.daysInStore = calculateDaysInStore(newCat.entryDate);

    return newCat;
}

function updateCat(catName, requestBody) {
    const catToUpdate = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

    if (!catToUpdate) {
        return undefined;
    }

    catToUpdate.condoNumber = requestBody.condoNumber || catToUpdate.condoNumber;
    catToUpdate.catName = requestBody.catName || catToUpdate.catName;
    catToUpdate.gender = requestBody.gender || catToUpdate.gender;
    catToUpdate.age = requestBody.age || catToUpdate.age;
    catToUpdate.physicalDescription = requestBody.physicalDescription || catToUpdate.physicalDescription;
    catToUpdate.personality = requestBody.personality || catToUpdate.personality;
    catToUpdate.adoptionFee = requestBody.adoptionFee || catToUpdate.adoptionFee;
    catToUpdate.entryDate = requestBody.entryDate || catToUpdate.entryDate;
    catToUpdate.dryFood = requestBody.dryFood || catToUpdate.dryFood;
    catToUpdate.flavorDryFood = requestBody.flavorDryFood || catToUpdate.flavorDryFood;
    catToUpdate.wetFood = requestBody.wetFood || catToUpdate.wetFood;
    catToUpdate.flavorWetFood = requestBody.flavorWetFood || catToUpdate.flavorWetFood;
    catToUpdate.quantityWetFood = requestBody.quantityWetFood || catToUpdate.quantityWetFood;
    catToUpdate.specialNeeds = requestBody.specialNeeds || catToUpdate.specialNeeds;

    return catToUpdate;
}

function deleteCat(catName) {
    const catToDelete = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

    if (!catToDelete) {
        return undefined;
    }

    catInfo.splice(catInfo.indexOf(catToDelete), 1);

    return catToDelete;
}

app.get("/api/cats", (request, response) => {
    const cats = getAllCats();

    if (!cats || cats.length === 0) {
        return response.status(404).json({
            data: "No cats found",
        });
    }

    response.status(200).json({
        data: cats,
    });
});

app.get("/api/cats/condo/:condoNumber", (request, response) => {
    const catsInCondo = getCatsByCondo(request.params.condoNumber);
    
    if (!catsInCondo || catsInCondo.length === 0) {
        return response.status(404).json({
            data: "No cats found in that condo",
        });
    }
    
    response.status(200).json({
        data: catsInCondo,
    });
});

app.get("/api/cats/name/:catName", (request, response) => {
    const cat = getCatByName(request.params.catName);
    
    if (!cat) {
        return response.status(404).json({
            data: "No cat found with that name",
        });
    }
    
    response.status(200).json({
        data: cat,
    });
});

app.post("/api/cats", (request, response) => {
    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }
    
    const newCat = createCat(request.body);
    
    if (!newCat) {
        return response.status(400).json({
            data: "Bad Request. Missing required information to create a new cat",
        });
    }
    
    response.status(201).json({
        data: newCat,
    });
});

app.put("/api/cats/:catName", (request, response) => {
    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }

    const updatedCat = updateCat(request.params.catName, request.body);

    if (!updatedCat) {
        return response.status(404).json({
            data: "No cat found with that name",
        });
    }

    response.status(200).json({
        data: updatedCat,
    });
});

app.delete("/api/cats/:catName", (request, response) => {
    const deletedCat = deleteCat(request.params.catName);

    if (!deletedCat) {
        return response.status(404).json({
            data: "No cat found with that name",
        });
    }

    response.status(200).json({
        data: `Successfully deleted cat: ${deletedCat.catName}`,
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});