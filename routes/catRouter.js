import express from "express";
import {
    getAllCats, 
    getCatsByCondo, 
    getCatByName, 
    createCat, 
    updateCat, 
    deleteCat
} from "../controllers/catControllers.js";

const catRouter = express.Router();

catRouter.get("/", async (request, response) => {
    const cats = await getAllCats();

    if (!cats || cats.length === 0) {
        return response.status(404).json({
            data: "No cats found",
        });
    }

    response.status(200).json({
        data: cats,
    });
});

catRouter.get("/condo/:condoNumber", async (request, response) => {
    const condoNumber = request.params.condoNumber;
    const catsInCondo = await getCatsByCondo(condoNumber);

    if (!catsInCondo || catsInCondo.length === 0) {
        return response.status(404).json({
            data: `No cats found in condo number ${condoNumber}`,
        });
    }
    
    response.status(200).json({
        data: catsInCondo,
    });
});

catRouter.get("/name/:catName", async (request, response) => {
    const catName = request.params.catName;
    const cat = await getCatByName(catName);
    
    if (!cat) {
        return response.status(404).json({
            data: `No cat found with the name: ${catName}`,
        });
    }
    
    response.status(200).json({
        data: cat,
    });
});

catRouter.post("/", async (request, response) => {
    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }
    
    const newCat = await createCat(request.body);
    
    if (!newCat) {
        return response.status(400).json({
            data: "Bad Request. Missing required information to create a new cat",
        });
    }
    
    response.status(201).json({
        data: newCat,
    });
});

catRouter.put("/:catName", async (request, response) => {
    const catName = request.params.catName;

    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }

    const updatedCat = await updateCat(catName, request.body);

    if (!updatedCat) {
        return response.status(404).json({
            data: `No cat found with the name: ${catName}`,
        });
    }

    response.status(200).json({
        data: updatedCat,
    });
});

catRouter.delete("/:catName", async (request, response) => {
    const catName = request.params.catName;
    const deletedCat = await deleteCat(catName);

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