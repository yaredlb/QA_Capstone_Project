import LoginPage from "../support/LoginPage";
const XLSX = require("xlsx");
const fs = require("fs");

describe("Login Module - Data Driven Testing", () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it("Testing Multiple Login Scenarios", function () {
    cy.log("Starting multiple login scenarios");

    // Load test data from fixture
    cy.fixture("data/test-data.xlsx", "binary").then((excelFile) => {
      const workbook = XLSX.read(excelFile, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const testData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      testData.forEach((user, index) => {
        cy.log(`Entering username: ${user.username}`);
        LoginPage.enterUsername(user.username);

        cy.log(`Entering password for user: ${user.username}`);
        LoginPage.enterPassword(user.password);

        LoginPage.clickLogin();

        let actualResult = "";

        cy.log(`Checking expected result: ${user.expectedResult}`);

        if (user.expectedResult === "dashboard") {
          LoginPage.verifyDashboard();
          actualResult = "dashboard";
          LoginPage.logout();
        } else if (user.expectedResult === "Invalid credentials") {
          LoginPage.verifyErrorMessage();
          actualResult = "Invalid credentials";
        } else if (user.expectedResult === "Required") {
          LoginPage.verifyRequiredFields();
          actualResult = "Required";
        }

        // Update the testData array with the actual result
        user.actualResult = actualResult;

        cy.log("Reloading the page before the next test");
        cy.reload();
        cy.wait(2000);
      });

      // Convert the modified testData back to sheet format
      const newWorksheet = XLSX.utils.json_to_sheet(testData);
      workbook.Sheets[sheetName] = newWorksheet;

      // Write the updated Excel file
      const newExcelFile = XLSX.write(workbook, {
        type: "binary",
        bookType: "xlsx",
      });

      // Save the file
      cy.writeFile(
        "cypress/fixtures/data/test-data.xlsx",
        new Buffer.from(newExcelFile, "binary"),
        "binary"
      );
    });
  });
});
