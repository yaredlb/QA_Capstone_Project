import vacanciesPage from "../support/vacanciesPage";
import LoginPage from "../support/LoginPage";
import { readExcel } from "../support/readExcel";

describe("Recruitment Module - Vacancies", () => {
  beforeEach(() => {
    LoginPage.visit();
    LoginPage.enterUsername("Admin");
    LoginPage.enterPassword("admin123");
    LoginPage.clickLogin();
    vacanciesPage.visit();
    vacanciesPage.clickVacancies();
  });

  // this test adds and verifies a new vacancy
  it("Add and Verify New Vacancies from Excel", () => {
    readExcel("Vacancies").then((vacancies) => {
      vacancies.forEach((vacancy) => {
        vacanciesPage.clickAddVacancy();
        vacanciesPage.enterVacancyDetails(
          vacancy["vacancy"],
          vacancy["jobTitle"],
          vacancy["hiringManager"]
        );
        vacanciesPage.clickSaveVacancy();
        vacanciesPage.verifyVacancyAdded(vacancy["vacancy"]);
      });
    });
  });

  // this test searches for a vacancy
  it("Search Vacancy from Excel", () => {
    readExcel("Vacancies").then((vacancies) => {
      vacancies.forEach((vacancy) => {
        vacanciesPage.searchVacancy(vacancy["vacancy"]);
        vacanciesPage.verifyVacancySearchResults(vacancy["vacancy"]);
      });
    });
  });
});
