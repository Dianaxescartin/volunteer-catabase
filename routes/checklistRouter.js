import express from "express";
import {
    getAllChecklists,
    getChecklistByDate,
    createChecklist,
    updateChecklist,
    deleteChecklist
} from "../controllers/checklistControllers.js";

const checklistRouter = express.Router();

checklistRouter.get("/", async (request, response) => {
    const checklists = await getAllChecklists();

    if (!checklists || checklists.length === 0) {
        return response.status(404).json({
            data: "No checklists found",
        });
    }

    response.status(200).json({
        data: checklists,
    });
});

checklistRouter.get("/:date", async (request, response) => {
    const date = request.params.date;
    const checklist = await getChecklistByDate(date);

    if (!checklist || checklist.length === 0) {
        return response.status(404).json({
            data: `No checklist found for this date: ${date}`,
        });
    }

    response.status(200).json({
        data: checklist,
    });
});

checklistRouter.post("/", async (request, response) => {
    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }
    
    const newChecklist = await createChecklist(request.body);
    
    if (!newChecklist) {
        return response.status(400).json({
            data: "Bad Request. Missing required information to create a new checklist",
        });
    }

    if (newChecklist === "invalid date") {
        return response.status(409).json({
            data: `Bad Request. A checklist for this date: ${request.body.date} already exists`,
        });
    }

    response.status(201).json({
        data: newChecklist,
    });
});

checklistRouter.put("/:date", async (request, response) => {
    const date = request.params.date;

    if (!request.body) {
        return response.status(400).json({
            data: "Bad Request. Missing request body",
        });
    }

    const updatedChecklist = await updateChecklist(date, request.body);

    if (!updatedChecklist) {
        return response.status(404).json({
            data: `No checklist found for the date: ${date}`,
        });
    }

    if (updatedChecklist === "invalid date") {
        return response.status(409).json({
            data: `Bad Request. A checklist for this date: ${request.body.date} already exists`,
        });
    }

    response.status(200).json({
        data: updatedChecklist,
    });
});

checklistRouter.delete("/:date", async (request, response) => {
    const date = request.params.date;
    const deletedChecklist = await deleteChecklist(date);

    if (!deletedChecklist) {
        return response.status(404).json({
            data: `No checklist found for the date: ${date}`,
        });
    }

    response.status(200).json({
        data: `Successfully deleted checklist for the date: ${deletedChecklist.date}`,
    });
});

export default checklistRouter;