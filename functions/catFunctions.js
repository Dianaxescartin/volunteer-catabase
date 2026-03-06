import moment from 'moment';
import { catInfo } from "../data/catInfo.js";

moment().format("YYYY-MM-DD");

// Using moment library to calculate days in store
function calculateDaysInStore(entryDate) {
    const currentDate = moment();
    const entryDateCat = moment(entryDate);
    const daysInStore = currentDate.diff(entryDateCat, 'days');
    return daysInStore;
} 

const catFunctions = {
    getAllCats: function() {
        catInfo.forEach((cat) => {
            cat.daysInStore = calculateDaysInStore(cat.entryDate);
        });
        catInfo.sort((a, b) => a.condoNumber - b.condoNumber);
        
        return catInfo;
    },
    getCatsByCondo: function(condoNumber) {
        const condo = parseInt(condoNumber);
        const catsInCondo = catInfo.filter((cat) => cat.condoNumber === condo);
        catsInCondo.forEach((cat) => {
            cat.daysInStore = calculateDaysInStore(cat.entryDate);
        });

        return catsInCondo;
    },
    getCatByName: function(catName) { 
        const cat = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

        if (!cat) {
            return undefined;
        }
        cat.daysInStore = calculateDaysInStore(cat.entryDate);

        return cat;
    },
    createCat: function(requestBody) {
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
    },
    updateCat: function(catName, requestBody) {
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
    },
    deleteCat: function(catName) {
        const catToDelete = catInfo.find((cat) => cat.catName.toLowerCase() === catName.toLowerCase());

        if (!catToDelete) {
            return undefined;
        }

        catInfo.splice(catInfo.indexOf(catToDelete), 1);

        return catToDelete;
    }
};

export default catFunctions;