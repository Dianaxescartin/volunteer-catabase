import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Setting up path to catInfo.json file for JSON controller functions
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catInfoPath = path.join(__dirname, "../data/catInfo.json");


// JSON controller functions
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