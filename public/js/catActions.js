export async function deleteCatInfo(catName) {
    try {
        const response = await fetch(`http://localhost:8080/api/cats/${catName}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete cat info: ${response.statusText}`);
        }
    }
    catch (error) {
        console.error(error.message);
    }
}

export async function addCatInfo() {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);

        const newEntry = {
            condoNumber: data.get("condo-number"),
            catName: data.get("cat-name"),
            gender: data.get("gender"),
            age: data.get("age"),
            physicalDescription: data.get("physical-description"),
            personality: data.get("personality"),
            adoptionFee: data.get("adoption-fee"),
            entryDate: data.get("entry-date"),
            dryFood: data.get("dry-food"),
            flavorDryFood: data.get("flavor-dry-food"),
            wetFood: data.get("wet-food"),
            flavorWetFood: data.get("flavor-wet-food"),
            quantityWetFood: data.get("quantity-wet-food"),
            specialNeeds: data.get("special-needs")
        }

        if (newEntry.dryFood === "Other") {
            newEntry.dryFood = data.get("other-dry-food");
        }

        if (newEntry.flavorDryFood === "Other") {
            newEntry.flavorDryFood = data.get("other-flavor-dry-food");
        }

        if (newEntry.wetFood === "N/A") {
            newEntry.flavorWetFood = "N/A";
            newEntry.quantityWetFood = "N/A";
        }

        if (newEntry.wetFood === "Other") {
            newEntry.wetFood = data.get("other-wet-food");
        }

        if (newEntry.flavorWetFood === "Other") {
            newEntry.flavorWetFood = data.get("other-flavor-wet-food");
        }

        try {
            const postRequest = await fetch("http://localhost:8080/api/cats", {
                method: "POST",
                body: JSON.stringify(newEntry),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });
            if (postRequest.status === 201) {
                window.alert("Cat info added successfully!");
                window.location.href = `../name.html?catName=${newEntry.catName}`;
            } else if (postRequest.status === 400) {
                window.alert(`Failed to add cat info: ${await postRequest.text()}`);
            }
        }
        catch (error) {
            console.error(error.message);
        }        
    });
}

export async function editCatInfo(catName) {
    const form = document.querySelector("form");
    form.method = "PUT";
    form.action = `/api/cats/${catName}`;
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);

        const updatedEntry = {
            condoNumber: data.get("condo-number"),
            catName: data.get("cat-name"),
            gender: data.get("gender"),
            age: data.get("age"),
            physicalDescription: data.get("physical-description"),
            personality: data.get("personality"),
            adoptionFee: data.get("adoption-fee"),
            entryDate: data.get("entry-date"),
            dryFood: data.get("dry-food"),
            flavorDryFood: data.get("flavor-dry-food"),
            wetFood: data.get("wet-food"),
            flavorWetFood: data.get("flavor-wet-food"),
            quantityWetFood: data.get("quantity-wet-food"),
            specialNeeds: data.get("special-needs")
        }

        if (updatedEntry.dryFood === "Other") {
            updatedEntry.dryFood = data.get("other-dry-food");
        }

        if (updatedEntry.flavorDryFood === "Other") {
            updatedEntry.flavorDryFood = data.get("other-flavor-dry-food");
        }

        if (updatedEntry.wetFood === "N/A") {
            updatedEntry.flavorWetFood = "N/A";
            updatedEntry.quantityWetFood = "N/A";
        }

        if (updatedEntry.wetFood === "Other") {
            updatedEntry.wetFood = data.get("other-wet-food");
        }

        if (updatedEntry.flavorWetFood === "Other") {
            updatedEntry.flavorWetFood = data.get("other-flavor-wet-food");
        }

        try {
            const putRequest = await fetch(`http://localhost:8080/api/cats/${catName}`, {
                method: "PUT",
                body: JSON.stringify(updatedEntry),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });
            if (putRequest.status === 200) {
                window.alert("Cat info updated successfully!");
                window.location.href = `../name.html?catName=${updatedEntry.catName}`;
            } else if (putRequest.status === 400) {
                window.alert(`Failed to update cat info: ${await putRequest.text()}`);
            }   
        }
        catch (error) {
            console.error(error.message);
        }
    });
}