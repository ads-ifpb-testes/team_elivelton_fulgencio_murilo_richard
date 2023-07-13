/// <reference types="Cypress" />

describe("template spec", () => {
  const host = "http://localhost:8080";
  beforeEach(() => cy.visit(`${host}/responsavel/login`));

  it("Deve ser possível criar um pet", () => {
    cy.get(".form-login").should("exist");
    cy.get("#login-email").type(Cypress.env("email"));
    cy.get("#login-password").type(Cypress.env("senha"));
    cy.get("#button-login").click();

    cy.url().should("eq", `${host}/home`);
    cy.get("#pet-page").click();

    cy.get(".form-pet").should("exist");
    const cardsAntes = document.getElementsByClassName("card-pets").length;

    cy.get("#nomePet").type("Bidu");
    cy.get("#tutorPet").type("João");
    cy.get("#telefonePet").type("999999");
    cy.get("#enderecoPet").type("IFPB");

    cy.get("#button-create-pet").click();
    cy.get("#card-pets-container")
      .find(".card-pets")
      .should("have.length.at.least", cardsAntes + 1);
  });
});
