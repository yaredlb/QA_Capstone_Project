import * as XLSX from "xlsx";

export function readExcel(sheetName) {
  return cy
    .readFile("cypress/fixtures/data/testData.xlsx", "binary")
    .then((fileContent) => {
      const workbook = XLSX.read(fileContent, { type: "binary" });
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(sheet);
    });
}
