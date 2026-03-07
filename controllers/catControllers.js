import moment from 'moment';
import { jsonReadCatInfo, jsonWriteCatInfo } from '../data/jsonService.js';

moment().format("YYYY-MM-DD");

// Using moment library to calculate days in store
function calculateDaysInStore(entryDate) {
    const currentDate = moment();
    const entryDateCat = moment(entryDate);
    const daysInStore = currentDate.diff(entryDateCat, 'days');
    return daysInStore;
} 

// Cat controller functions
export async function getAllCats() {
    try {
        const catInfo = await jsonReadCatInfo();

        catInfo.forEach((cat) => {
            cat.daysInStore = calculateDaysInStore(cat.entryDate);
        });
        catInfo.sort((a, b) => a.condoNumber - b.condoNumber);
        
        return catInfo;
    }
    catch (error) {
        console.error("Error getting all cats:", error);
    }
}

export async function getCatsByCondo(condoNumber) {
    try {
        const catInfo = await jsonReadCatInfo();
        const condo = parseInt(condoNumber);
        const catsInCondo = catInfo.filter((cat) => cat.condoNumber === condo);
        
        catsInCondo.forEach((cat) => {
            cat.daysInStore = calculateDaysInStore(cat.entryDate);
        });

        return catsInCondo;
    }
    catch (error) {
        console.error("Error getting cats by condo:", error);
    }
}

export async function getCatByName(catName) {
    try {
        const catInfo = await jsonReadCatInfo();
        const cat = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

        if (!cat) {
            return undefined;
        }

        cat.daysInStore = calculateDaysInStore(cat.entryDate);

        return cat;
    }
    catch (error) {
        console.error("Error getting cat by name:", error);
    }
}
    
export async function createCat(requestBody) {
    try {
        const catInfo = await jsonReadCatInfo();

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
        newCat.condoNumber = parseInt(newCat.condoNumber);
        newCat.adoptionFee = parseInt(newCat.adoptionFee);

        catInfo.sort((a, b) => a.condoNumber - b.condoNumber);

        await jsonWriteCatInfo(catInfo);

        return newCat;
    }
    catch (error) {
        console.error("Error creating new cat:", error);
    }
}

export async function updateCat(catName, requestBody) {
    try {
        const catInfo = await jsonReadCatInfo();
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

        catToUpdate.daysInStore = calculateDaysInStore(catToUpdate.entryDate);
        catToUpdate.condoNumber = parseInt(catToUpdate.condoNumber);
        catToUpdate.adoptionFee = parseInt(catToUpdate.adoptionFee);

        catInfo.sort((a, b) => a.condoNumber - b.condoNumber);

        await jsonWriteCatInfo(catInfo);

        return catToUpdate;
    }
    catch (error) {
        console.error("Error updating cat:", error);
    }
}

export async function deleteCat(catName) {
    try {
        const catInfo = await jsonReadCatInfo();
        const catToDelete = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

        if (!catToDelete) {
            return undefined;
        }

        catInfo.splice(catInfo.indexOf(catToDelete), 1);

        await jsonWriteCatInfo(catInfo);

        return catToDelete;
    } catch (error) {
        console.error("Error deleting cat:", error);
    }
}