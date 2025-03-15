class LoginPage {
  visit() {
    cy.visit("/web/index.php/auth/login");
  }

  enterUsername(username) {
    cy.get('input[name="username"]').should("be.visible").clear();
    if (username) {
      cy.get('input[name="username"]').type(username);
    }
  }

  enterPassword(password) {
    cy.get('input[name="password"]').should("be.visible").clear();
    if (password) {
      cy.get('input[name="password"]').type(password);
    }
  }

  clickLogin() {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .click()
      .then(() => {
        cy.wait(1000); // Wait for the response
      })
      .then(() => {
        // Additional logic can be added here if needed
      });
  }

  verifyDashboard() {
    cy.url()
      .should("include", "/dashboard")
      .then((url) => {
        if (!url.includes("/dashboard")) {
          cy.log("Dashboard not found");
        }
      });
  }

  verifyErrorMessage() {
    cy.get(".oxd-alert-content")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  }

  verifyRequiredFields() {
    cy.get(".oxd-input-group")
      .eq(0)
      .should("contain", "Required")
      .then(($el) => {
        if ($el.length) {
          expect($el).to.contain("Required");
        } else {
          cy.log("Required field message not found for field 1");
        }
      });
    cy.get(".oxd-input-group")
      .eq(1)
      .should("contain", "Required")
      .then(($el) => {
        if ($el.length) {
          expect($el).to.contain("Required");
        } else {
          cy.log("Required field message not found for field 2");
        }
      });
  }

  logout() {
    cy.get(".oxd-userdropdown-name").click();
    cy.contains("Logout").click();
    cy.url().should("include", "/auth/login");
  }
}

export default new LoginPage();
