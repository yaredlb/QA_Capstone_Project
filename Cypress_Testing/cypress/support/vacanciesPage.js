class vacanciesPage {
  /**
   * Navigate to the Recruitment module
   */
  visit() {
    cy.visit("/web/index.php/recruitment/viewRecruitmentModule");
  }

  /**
   * Click on the Vacancies tab
   */
  clickVacancies() {
    cy.get("a.oxd-topbar-body-nav-tab-item").contains("Vacancies").click();
  }

  /**
   * Click on the Add Vacancy button
   */
  clickAddVacancy() {
    cy.get("button.oxd-button").contains("Add").click();
  }

  /**
   * Enter the details for a new vacancy
   */
  enterVacancyDetails(vacancyName, jobTitle, hiringManager) {
    cy.get(
      ".oxd-form > :nth-child(1) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
    ).type(vacancyName);

    cy.get(".oxd-select-text-input").should("be.visible").type(jobTitle);
    if (hiringManager) {
      cy.get(".oxd-autocomplete-text-input > input").type(hiringManager);
      cy.get(".oxd-autocomplete-dropdown").contains(hiringManager).click();
    } else {
      cy.log("Skipping Hiring Manager - Field is empty");
    }
  }

  /**
   * Click on the Save button to save the vacancy
   */
  clickSaveVacancy() {
    cy.get('button[type="submit"]').click();
    cy.log("✅ Save button clicked, checking if vacancy is saved...");
    cy.wait(3000); // ✅ Wait for the page to load
    cy.url().then((currentUrl) => {
      cy.log("Current URL after saving:", currentUrl);
    });

    // ✅ Ensure Cypress goes back to the vacancies list
    cy.get("a.oxd-topbar-body-nav-tab-item").contains("Vacancies").click();
  }

  /**
   * Verify that the newly added vacancy appears in the list
   */
  verifyVacancyAdded(vacancyName) {
    cy.log("🔄 Navigating back to the Vacancies tab...");
    cy.get("a.oxd-topbar-body-nav-tab-item").contains("Vacancies").click(); // ✅ Ensure we are on the right page

    cy.log("🔍 Checking if vacancy appears in the table...");
    cy.get(".oxd-table", { timeout: 15000 }).should("be.visible"); // ✅ Ensure table is loaded

    cy.get(".oxd-table-cell", { timeout: 15000 })
      .should("contain.text", vacancyName)
      .then(() => cy.log("✅ Vacancy found: " + vacancyName));
  }

  /**
   * Search for a vacancy by title
   */
  searchVacancy(title) {
    cy.get(
      ":nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text-input"
    ).type(title);
    cy.get('button[type="submit"]').click();
  }

  /**
   * Verify that the vacancy search results contain the expected title
   */
  verifyVacancySearchResults(title) {
    cy.get(".oxd-table-cell").should("contain", title, { timeout: 15000 });
  }
}

export default new vacanciesPage();
