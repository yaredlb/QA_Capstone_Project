const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "n5prq3",
  // add retries
  retries: {
    runMode: 1,
    openMode: 1,
  },
  reporter: "cypress-mochawesome-reporter",
  video: true,
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    supportFile: "cypress/support/e2e.js",
    defaultCommandTimeout: 10000,
    failOnStatusCode: false, // Prevent Cypress from failing on 404
  },
});
