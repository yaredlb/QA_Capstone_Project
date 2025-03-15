class candidatesPage {
  /**
   * Navigate to the Recruitment module
   */
  visit() {
    cy.visit("/web/index.php/recruitment/viewRecruitmentModule");
  }

  /**
   * Click on the Add Candidate button
   */
  clickAddCandidate() {
    // Wait for the page transition to complete
    cy.wait(2000);
    cy.get(".--visited > .oxd-topbar-body-nav-tab-item").click();

    // Click on the "Add" button
    cy.get(".orangehrm-header-container > .oxd-button", { timeout: 20000 })
      .should("be.visible")
      .contains("Add")
      .click();
  }

  /**
   * Enter the details for a new candidate
   */
  enterCandidateDetails(firstName, lastName, email) {
    if (firstName) {
      cy.get('input[name="firstName"]')
        .should("be.visible")
        .clear()
        .type(firstName);
    }

    if (lastName) {
      cy.get('input[name="lastName"]')
        .should("be.visible")
        .clear()
        .type(lastName);
    }

    if (email) {
      cy.get("input.oxd-input").eq(4).should("be.visible").clear().type(email);
    } else {
      cy.log("Skipping Email - Field is empty");
    }
  }

  /**
   * Click on the Save button to save the candidate
   */
  clickSaveCandidate() {
    cy.get(".oxd-button--secondary").click(); // Click Save button

    // Wait for success message or UI change after saving
    cy.get(".oxd-toast", { timeout: 15000 })
      .should("be.visible")
      .contains("Success"); // Ensure success notification appears

    // Wait for the table to update before checking the added candidate
    cy.get(".oxd-table", { timeout: 20000 }).should("be.visible");
  }

  /**
   * Search for a candidate by name
   */
  searchCandidate(name) {
    cy.get('input[placeholder="Type for hints..."]').type(name);
    cy.get(".oxd-autocomplete-dropdown .oxd-autocomplete-option").should(
      "have.length.greaterThan",
      0
    );
    cy.get(".oxd-autocomplete-dropdown .oxd-autocomplete-option")
      .first()
      .click();
    cy.get('button[type="submit"]').click();
  }

  /**
   * Verify that the candidate search results contain the expected name
   */
  verifyCandidateSearchResults(name) {
    cy.get(".oxd-table")
      .should("be.visible") // Ensure table is visible
      .within(() => {
        cy.contains(".oxd-table-cell", name, { timeout: 15000 })
          .should("exist") // Ensure name exists in the table
          .and("be.visible"); // Ensure it's visible
      });
  }
}

export default new candidatesPage();
