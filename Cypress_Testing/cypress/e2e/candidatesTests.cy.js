import candidatesPage from "../support/candidatesPage";
import LoginPage from "../support/LoginPage";
import { readExcel } from "../support/readExcel";

describe("Recruitment Module - Candidates", () => {
  beforeEach(() => {
    LoginPage.visit();
    LoginPage.enterUsername("Admin");
    LoginPage.enterPassword("admin123");
    LoginPage.clickLogin();
    candidatesPage.visit();
  });

  // this test adds and verifies a new candidate
  it("Add and Verify New Candidates from Excel", () => {
    readExcel("Candidates").then((candidates) => {
      if (candidates.length === 0) {
        throw new Error("No candidates found in the Excel sheet.");
      }

      candidates.forEach((candidate) => {
        candidatesPage.clickAddCandidate();
        candidatesPage.enterCandidateDetails(
          candidate["firstName"],
          candidate["lastName"],
          candidate["email"]
        );
        candidatesPage.clickSaveCandidate();
      });
    });
  });

  // this test searches for a candidate
  it("Search Candidate from Excel", () => {
    readExcel("Candidates").then((candidates) => {
      candidates.forEach((candidate) => {
        candidatesPage.searchCandidate(candidate["firstName"]);
        candidatesPage.verifyCandidateSearchResults(candidate["firstName"]);
      });
    });
  });
});
