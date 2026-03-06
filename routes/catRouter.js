import express from "express";
import catFunctions from "../functions/catFunctions.js";

const catRouter = express.Router();

catRouter.get("/", (request, response) => {
    const cats = catFunctions.getAllCats();

    if (!cats || cats.length === 0) {
        return response.status(404).json({
            data: "No cats found",
        });
    }

    response.status(200).json({
        data: cats,
    });
});

catRouter.get("/condo/:condoNumber", (request, response) => {
    const condoNumber = request.params.condoNumber;
    const catsInCondo = catFunctions.getCatsByCondo(condoNumber);

    if (!catsInCondo || catsInCondo.length === 0) {
        return response.status(404).json({
            data: `No cats found in condo number ${condoNumber}`,
        });
    }
    
    response.status(200).json({
        data: catsInCondo,
    });
});

catRouter.get("/name/:catName", (request, response) => {
    const catName = request.params.catName;
    const cat = catFunctions.getCatByName(catName);
    
    if (!cat) {
        return response.status(404).json({
            data: `No cat found with the name: ${catName}`,
        });
    }
    
    response.status(200).json({
        data: cat,
    });
});

catRouter.post("/", (request, response) => {
    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }
    
    const newCat = catFunctions.createCat(request.body);
    
    if (!newCat) {
        return response.status(400).json({
            data: "Bad Request. Missing required information to create a new cat",
        });
    }
    
    response.status(201).json({
        data: newCat,
    });
});

catRouter.put("/:catName", (request, response) => {
    const catName = request.params.catName;

    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }

    const updatedCat = catFunctions.updateCat(catName, request.body);

    if (!updatedCat) {
        return response.status(404).json({
            data: `No cat found with the name: ${catName}`,
        });
    }

    response.status(200).json({
        data: updatedCat,
    });
});

catRouter.delete("/:catName", (request, response) => {
    const catName = request.params.catName;
    const deletedCat = catFunctions.deleteCat(catName);

    if (!deletedCat) {
        return response.status(404).json({
            data: `No cat found with the name: ${catName}`,
        });
    }

    response.status(200).json({
        data: `Successfully deleted cat: ${deletedCat.catName}`,
    });
});

export default catRouter;