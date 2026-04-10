import { calculateDaysInStore } from "../controllers/catControllers.js";
import moment from "moment";

moment().format("YYYY-MM-DD");

test("calculateDaysInStore should return 0 given current date", () => {
    // Arrange
    const entryDate = moment();
    const expectedDaysInStore = 0;

    // Act
    const result = calculateDaysInStore(entryDate);

    // Assert
    expect(result).toBe(expectedDaysInStore);
});

test("calculateDaysInStore should return 10 given current date minus 10 days", () => {
    // Arrange
    const entryDate = moment().add(-10, "days");
    const expectedDaysInStore = 10;

    // Act
    const result = calculateDaysInStore(entryDate);

    // Assert
    expect(result).toBe(expectedDaysInStore);
});