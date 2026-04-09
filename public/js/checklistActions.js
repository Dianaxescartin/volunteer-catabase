export async function deleteChecklistInfo(date) {
    try {
        const response = await fetch(`http://localhost:8080/api/checklists/${date}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete checklist info: ${response.statusText}`);
        }
    }
    catch (error) {
        console.error(error.message);
    }
}

export async function addChecklistInfo() {

    let catsInfo;
    let condoNumbersUnique;

    try {
        const response = await fetch(`http://localhost:8080/api/cats`);
        const parsedData = await response.json();
        catsInfo = parsedData.data;
        condoNumbersUnique = [...new Set(catsInfo.map(cat => cat.condoNumber))];
    }
    catch (error) {
        console.error(error.message);
    }

    let newEntry;

    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);
    
        newEntry = {
            date: data.get("date"),
            volunteerName: data.get("volunteer-name"),
            careTasks: []
        };

        newEntry.careTasks = condoNumbersUnique.map(condoNumber => {
            return {
                condoNumber: condoNumber,
                cats: [],
                areCatsHealthy: data.get(`cats-healthy-${condoNumber}`) === "Yes" ? "Yes" : data.get(`cats-healthy-${condoNumber}`) === "No" ? "No" : "",
                symptoms: (data.get(`cats-healthy-${condoNumber}`) === "Yes" || data.get(`cats-healthy-${condoNumber}`) === "") ? "" : data.get(`symptoms-${condoNumber}`),
                isCondoCleaned: data.get(`condo-cleaned-${condoNumber}`) === "on" ? "true" : "false",
                isLitterBoxCleaned: data.get(`litter-box-cleaned-${condoNumber}`) === "on" ? "true" : "false",
                isLitterBoxRefilled: data.get(`litter-box-refilled-${condoNumber}`) === "on" ? "true" : "false",
                areBedsChanged: data.get(`beds-changed-${condoNumber}`) === "on" ? "true" : "false",
                isSweepingDone: data.get(`sweeping-done-${condoNumber}`) === "on" ? "true" : "false",
                dryFood: catsInfo.find(cat => cat.condoNumber === condoNumber).dryFood,
                flavorDryFood: catsInfo.find(cat => cat.condoNumber === condoNumber).flavorDryFood,
                isDryFoodRefilled: data.get(`dry-food-refilled-${condoNumber}`) === "on" ? "true" : "false",
                wetFood: catsInfo.find(cat => cat.condoNumber === condoNumber).wetFood,
                flavorWetFood: catsInfo.find(cat => cat.condoNumber === condoNumber).flavorWetFood,
                quantityWetFood: catsInfo.find(cat => cat.condoNumber === condoNumber).quantityWetFood,
                isWetFoodGiven: data.get(`wet-food-given-${condoNumber}`) === "on" ? "true" : "false",
                isWaterRefilled: data.get(`water-refilled-${condoNumber}`) === "on" ? "true" : "false",
                areSpecialNeedsAttended: data.get(`special-needs-attended-${condoNumber}`) === "on" ? "true" : "false",
                isCondoLocked: data.get(`condo-locked-${condoNumber}`) === "on" ? "true" : "false",
                comments: data.get(`comments-${condoNumber}`) || "No comments"
            };
        });

        newEntry.careTasks.forEach(task => {
            const catsByCondo = catsInfo.filter(cat => cat.condoNumber === task.condoNumber);
            task.cats = catsByCondo.map(cat => ({
                catName: cat.catName,
                physicalDescription: cat.physicalDescription,
                specialNeeds: cat.specialNeeds
            }));
        });

        try {
            const postRequest = await fetch("http://localhost:8080/api/checklists", {
                method: "POST",
                body: JSON.stringify(newEntry),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });
            if (postRequest.status === 201) {
                window.alert("Checklist info added successfully!");
                window.location.href = `../checklistInfo.html`;
            } else if (postRequest.status === 409) {
                window.alert(`Failed to add checklist info, this date: ${newEntry.date} already exists. Please choose another date.`);
            }
        }
        catch (error) {
            console.error(error.message);
        }
    });
}

export async function editChecklistInfo(date) {

    let updatedEntry;

    try {
        const response = await fetch(`http://localhost:8080/api/checklists/${date}`);
        const parsedData = await response.json();
        updatedEntry = parsedData.data[0];
        
    } catch (error) {
    console.error(error.message);
    }

    const form = document.querySelector("form");
    form.method = "PUT";
    form.action = `/api/checklists/${date}`;
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        
        updatedEntry.date = data.get("date");
        updatedEntry.volunteerName = data.get("volunteer-name");
        updatedEntry.careTasks.forEach(task => {
            task.areCatsHealthy = data.get(`cats-healthy-${task.condoNumber}`) === "Yes" ? "Yes" : data.get(`cats-healthy-${task.condoNumber}`) === "No" ? "No" : "";
            if (task.areCatsHealthy === "Yes") {
                task.symptoms = "";
            } else {
                task.symptoms = data.get(`symptoms-${task.condoNumber}`);
            }
            task.isCondoCleaned = data.get(`condo-cleaned-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isLitterBoxCleaned = data.get(`litter-box-cleaned-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isLitterBoxRefilled = data.get(`litter-box-refilled-${task.condoNumber}`) === "on" ? "true" : "false";
            task.areBedsChanged = data.get(`beds-changed-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isSweepingDone = data.get(`sweeping-done-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isDryFoodRefilled = data.get(`dry-food-refilled-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isWetFoodGiven = data.get(`wet-food-given-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isWaterRefilled = data.get(`water-refilled-${task.condoNumber}`) === "on" ? "true" : "false";
            task.areSpecialNeedsAttended = data.get(`special-needs-attended-${task.condoNumber}`) === "on" ? "true" : "false";
            task.isCondoLocked = data.get(`condo-locked-${task.condoNumber}`) === "on" ? "true" : "false";
            task.comments = data.get(`comments-${task.condoNumber}`) || "No comments";
        });

        try {
            const putRequest = await fetch(`http://localhost:8080/api/checklists/${date}`, {
                method: "PUT",
                body: JSON.stringify(updatedEntry),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });
            if (putRequest.status === 200) {
                window.alert("Checklist info updated successfully!");
                window.location.href = `../checklistInfo.html`;
            } else if (putRequest.status === 409) {
                window.alert(`Failed to update checklist info, this date: ${updatedEntry.date} already exists. Please choose another date.`);
            }            
        }
        catch (error) {
            console.error(error.message);
        }
    });
}