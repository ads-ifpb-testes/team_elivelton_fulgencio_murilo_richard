/// <reference types="Cypress" />

describe("template spec", () => {
  const host = "http://localhost:8080";
  beforeEach(() => {
    cy.visit(host);
    cy.get("#open-atendimento-page").click();
    cy.get(".form-login").should("exist");
    cy.get("#login-email").type(Cypress.env("email"));
    cy.get("#login-password").type(Cypress.env("senha"));
    cy.get("#button-login").click();

    cy.url().should("eq", `${host}/home`);
    cy.get("#pet-page").click();
  });

  it("Deve ser possível criar um pet", () => {
    cy.get(".form-pet").should("exist");

    cy.get("#nomePet").type("Bidu");
    cy.get("#tutorPet").type("João");
    cy.get("#telefonePet").type("999999");
    cy.get("#enderecoPet").type("IFPB");

    cy.get("#button-create-pet").click();
    cy.get("#card-pets-container")
      .find(".card-pets")
      .should("have.length.at.least", 1);
  });

  it("Deve ser possível editar um pet", () => {
    cy.get(".form-pet").should("exist");
    cy.get(".edit-button-pet").last().click();

    cy.get("#nomePet").type(" Editado");
    cy.get("#tutorPet").type(" Editado");
    cy.get("#telefonePet").type(" 111");
    cy.get("#enderecoPet").type(" 2");

    cy.get("#button-edit-pet").last().click();
    cy.url().should("eq", `${host}/pet`);

    cy.get("#card-pets-container")
      .find(".card-pets")
      .should("have.length.at.least", 1);
    cy.get(".nome-card-pet")
      .last()
      .should((text) => {
        const val = text.get(0).innerText;
        expect(val).to.include("Bidu Editado");
      });
    cy.get(".tutor-card-pet")
      .last()
      .should((text) => {
        const val = text.get(0).innerText;
        expect(val).to.include("João Editado");
      });
    cy.get(".telefone-card-pet")
      .last()
      .should((text) => {
        const val = text.get(0).innerText;
        expect(val).to.include("999999 111");
      });
    cy.get(".endereco-card-pet")
      .last()
      .should((text) => {
        const val = text.get(0).innerText;
        expect(val).to.include("IFPB 2");
      });
  });

  it("Deve ser possível deletar um pet", () => {
    cy.get(".form-pet").should("exist");

    cy.get("#nomePet").type("Bidu");
    cy.get("#tutorPet").type("João");
    cy.get("#telefonePet").type("999999");
    cy.get("#enderecoPet").type("IFPB");

    cy.get("#button-create-pet").click();

    cy.get(".delete-pet-id")
      .last()
      .then((id1) => {
        cy.get(".delete-button-pet").last().click();

        cy.get("#confirm-delete").click();
        cy.get(".delete-pet-id").last().then((id2) => {
          expect(id1).not.to.eq(id2);
        });
      });
  });
});
