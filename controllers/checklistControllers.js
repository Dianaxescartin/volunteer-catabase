import moment from 'moment';
import { jsonReadChecklist, jsonWriteChecklist } from '../data/jsonService.js';

moment().format("YYYY-MM-DD");

// Checklist controller functions
export async function getAllChecklists() {
    try {
        const checklists = await jsonReadChecklist();

        checklists.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return checklists;
    } catch (error) {
        console.error("Error getting all checklists:", error);
    }
}

export async function getChecklistByDate(date) {
    try {
        const checklists = await jsonReadChecklist();
        const dateFormatted = new Date(date).toISOString().split('T')[0];
        const checklistByDate = checklists.filter(item => item.date === dateFormatted);
        
        return checklistByDate;
    } catch (error) {
        console.error("Error getting checklist by date:", error);
    }
}

export async function createChecklist(requestBody) {
    try {
        const checklists = await jsonReadChecklist();

        const newChecklist = {
            date: requestBody.date,
            volunteerName: requestBody.volunteerName,
            careTasks: requestBody.careTasks.map(element => ({
                condoNumber: element.condoNumber,
                cats: element.cats.map(cat => ({
                        catName: cat.catName,
                        physicalDescription: cat.physicalDescription,
                        specialNeeds: cat.specialNeeds
                    })),
                areCatsHealthy: element.areCatsHealthy,
                symptoms: element.symptoms,
                isCondoCleaned: element.isCondoCleaned,
                isLitterBoxCleaned: element.isLitterBoxCleaned,
                isLitterBoxRefilled: element.isLitterBoxRefilled,
                areBedsChanged: element.areBedsChanged,
                isSweepingDone: element.isSweepingDone,
                dryFood: element.dryFood,
                flavorDryFood: element.flavorDryFood,
                isDryFoodRefilled: element.isDryFoodRefilled,
                wetFood: element.wetFood,
                flavorWetFood: element.flavorWetFood,
                quantityWetFood: element.quantityWetFood,
                isWetFoodGiven: element.isWetFoodGiven,
                isWaterRefilled: element.isWaterRefilled,
                areSpecialNeedsAttended: element.areSpecialNeedsAttended,
                isCondoLocked: element.isCondoLocked,
                comments: element.comments || "No comments"
            }))
        };

        newChecklist.date = moment(newChecklist.date).format("YYYY-MM-DD");

        if (checklists.some(item => moment(item.date).format("YYYY-MM-DD") === newChecklist.date)) {
            return "invalid date";
        }

        if (!newChecklist) {
            return undefined;
        }

        checklists.push(newChecklist)

        newChecklist.careTasks.forEach(element => {
            element.condoNumber = parseInt(element.condoNumber);
        });

        checklists.sort((a, b) => new Date(a.date) - new Date(b.date));

        await jsonWriteChecklist(checklists);

        return newChecklist;
    } catch (error) {
        console.error("Error creating new checklist:", error);
    }
}

export async function updateChecklist(date, requestBody) {
    try {
        const checklists = await jsonReadChecklist();
        const dateFormatted = new Date(date).toISOString().split('T')[0];
        const checklistToUpdate = checklists.find((item) => item.date === dateFormatted);

        if (!checklistToUpdate) {
            return undefined;
        }      

        checklistToUpdate.date = requestBody.date || checklistToUpdate.date;
        checklistToUpdate.volunteerName = requestBody.volunteerName || checklistToUpdate.volunteerName;
        checklistToUpdate.careTasks = requestBody.careTasks.map(element => ({
            condoNumber: element.condoNumber,
            cats: element.cats.map(cat => ({
                    catName: cat.catName,
                    physicalDescription: cat.physicalDescription,
                    specialNeeds: cat.specialNeeds,
                })),
            areCatsHealthy: element.areCatsHealthy,
            symptoms: element.symptoms,
            isCondoCleaned: element.isCondoCleaned,
            isLitterBoxCleaned: element.isLitterBoxCleaned,
            isLitterBoxRefilled: element.isLitterBoxRefilled,
            areBedsChanged: element.areBedsChanged,
            isSweepingDone: element.isSweepingDone,
            dryFood: element.dryFood,
            flavorDryFood: element.flavorDryFood,
            isDryFoodRefilled: element.isDryFoodRefilled,
            wetFood: element.wetFood,
            flavorWetFood: element.flavorWetFood,
            quantityWetFood: element.quantityWetFood,
            isWetFoodGiven: element.isWetFoodGiven,
            isWaterRefilled: element.isWaterRefilled,
            areSpecialNeedsAttended: element.areSpecialNeedsAttended,
            isCondoLocked: element.isCondoLocked,
            comments: element.comments || "No comments"
        }));

        checklistToUpdate.date = moment(checklistToUpdate.date).format("YYYY-MM-DD");
        
        if (checklists.some(item => moment(item.date).format("YYYY-MM-DD") === checklistToUpdate.date && item !== checklistToUpdate)) {
            return "invalid date";
        }

        checklistToUpdate.careTasks.forEach(element => {
            element.condoNumber = parseInt(element.condoNumber);
        });

        checklists.sort((a, b) => new Date(a.date) - new Date(b.date));

        await jsonWriteChecklist(checklists);

        return checklistToUpdate;
    } catch (error) {
        console.error("Error updating checklist:", error);
    }
}

export async function deleteChecklist(date) {
    try {
        const checklists = await jsonReadChecklist();
        const dateFormatted = new Date(date).toISOString().split('T')[0];
        const checklistToDelete = checklists.find((item) => item.date === dateFormatted);

        if (!checklistToDelete) {
            return undefined;
        }

        checklists.splice(checklists.indexOf(checklistToDelete), 1);

        await jsonWriteChecklist(checklists);

        return checklistToDelete;
    } catch (error) {
        console.error("Error deleting checklist:", error);
    }
}