/// <reference types="Cypress" />

describe('template spec', () => {
  const host = 'http://localhost:8080';

  beforeEach(() => {
    cy.visit(host)
  });

  it('Deve exibir uma formulário para logar um responsável na conta e entrar na conta', () => {
    cy.get('#open-responsavel-page').click();
    cy.get('.form-login').should('exist');

    cy.get('#login-email').type(Cypress.env('email'));
    cy.get('#login-password').type(Cypress.env('senha'));
    cy.get('#button-login').click();

    cy.url().should('eq', `${host}/home`);
  });
  
  it('Deve exibir uma formulário para cadastrar um novo responsável no sistema', () => {
    cy.get('#open-responsavel-page').click();
    cy.get('.form-login').should('exist');

    cy.get('#login-email').type(Cypress.env('email'));
    cy.get('#login-password').type(Cypress.env('senha'));
    cy.get('#button-login').click();

    cy.url().should('eq', `${host}/home`);
    cy.get('#open-responsavel-page').click();

    cy.get('#nomeRes').type('Dr. Hector Bonilha');
    cy.get('#funcaoRes').type('Veterinário');
    cy.get('#telefoneRes').type('129838293');
    cy.get('#emailRes').type('hectorbolinha@gmail.com');
    cy.get('#senhaRes').type('1234'); 
    cy.get('#senhaResConf').type('1234');
    cy.get('#enviarRes').click();

    cy.get(".card-responsaveis").last().should((text) => {
      const val = text.get(0).innerText
      expect(val).to.include("hectorbolinha@gmail.com")
  });

  cy.get('#botaoVoltar').click();

  });

  it("Deve ser possível deletar um responsável", () => {
    cy.get('#open-responsavel-page').click();
    cy.get('.form-login').should('exist');

    cy.get('#login-email').type(Cypress.env('email'));
    cy.get('#login-password').type(Cypress.env('senha'));
    cy.get('#button-login').click();

    cy.url().should('eq', `${host}/home`);
    cy.get('#open-responsavel-page').click();

    cy.get(".delete-responsavel-id")
      .last()
      .then((id1) => {
        cy.get(".delete-button-responsavel").last().click();

        cy.get("#confirm-delete").click();
        cy.get(".delete-responsavel-id").last().then((id2) => {
          expect(id1).not.to.eq(id2);
        });
      });
  });

});
