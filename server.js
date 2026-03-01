import express from "express";
import moment from 'moment';

const app = express();
const port = 8080;

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
        adoptionFee: 180, entryDate: "2026-02-25", daysInStore: "", 
        dryFood: "iams", flavorDryFood: "chicken", wetFood: "iams", flavorWetFood: "salmon", quantityWetFood: "a quarter of can",
        specialNeeds: "add a spoon of probiotics powder to the dry food bowl"
    },
    { condoNumber: 2, catName: "Luffy", gender: "male", age: "4 months", physicalDescription: "white", personality: "calm and friendly",
        adoptionFee: 150, entryDate: "2026-02-20", daysInStore: "", 
        dryFood: "intuition", flavorDryFood: "chicken", wetFood: "N/A", flavorWetFood: "N/A", quantityWetFood: "N/A",
        specialNeeds: "N/A"
    },
    { condoNumber: 2, catName: "Nami", gender: "female", age: "4 months", physicalDescription: "brown tabby", personality: "playful and outgoing",
        adoptionFee: 150, entryDate: "2026-02-20", daysInStore: "", 
        dryFood: "intuition", flavorDryFood: "chicken", wetFood: "N/A", flavorWetFood: "N/A", quantityWetFood: "N/A",
        specialNeeds: "N/A"
    }
]

function getAllCats() {
    catInfo.forEach((cat) => {
        cat.daysInStore = calculateDaysInStore(cat.entryDate);
    });
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
    if (cat) {
        cat.daysInStore = calculateDaysInStore(cat.entryDate);
    }

    return cat;
}

app.get("/cats", (request, response) => {
    const cats = getAllCats();
    response.status(200).json({
        data: cats,
    });
});

app.get("/cats/condo/:condoNumber", (request, response) => {
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

app.get("/cats/name/:catName", (request, response) => {
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});