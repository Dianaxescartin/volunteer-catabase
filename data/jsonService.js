import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setting up path to catInfo.json file for JSON controller functions
const catInfoPath = path.join(__dirname, "../data/catInfo.json");

// JSON cat controller functions
export async function jsonReadCatInfo() {
    try {
        const catInfo = await fs.readFile(catInfoPath);

        return JSON.parse(catInfo);
    } catch (error) {
        console.error("Error reading cat info from JSON file:", error);
    }
}

export async function jsonWriteCatInfo(catInfo) {
    try {
        await fs.writeFile(catInfoPath, JSON.stringify(catInfo, null, 4));
    } catch (error) {
        console.error("Error writing cat info to JSON file:", error);
    }
}

// Setting up path to checklist.json file for JSON controller functions
const checklistPath = path.join(__dirname, "../data/checklist.json");

// JSON checklist controller functions
export async function jsonReadChecklist() {
    try {
        const checklist = await fs.readFile(checklistPath);

        return JSON.parse(checklist);
    } catch (error) {
        console.error("Error reading checklist from JSON file:", error);
    }
}

export async function jsonWriteChecklist(checklist) {
    try {
        await fs.writeFile(checklistPath, JSON.stringify(checklist, null, 4));
    } catch (error) {
        console.error("Error writing checklist to JSON file:", error);
    }
}