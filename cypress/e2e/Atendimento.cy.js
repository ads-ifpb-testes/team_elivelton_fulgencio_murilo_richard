/// <reference types="Cypress" />

describe('template spec', () => {
  const host = 'http://localhost:8080';

  beforeEach(() => cy.visit(`${host}/responsavel/login`));

  it('Deve exibir uma formulário para logar um responsável na conta', () => {
    cy.get('.form-login').should('exist');
  });

  it('Deve permitir entrar na conta', () => {
    cy.get('#login-email').type(Cypress.env('email'));
    cy.get('#login-password').type(Cypress.env('senha'));
    cy.get('#button-login').click();

    cy.url().should('eq', `${host}/home`);
  });
});
