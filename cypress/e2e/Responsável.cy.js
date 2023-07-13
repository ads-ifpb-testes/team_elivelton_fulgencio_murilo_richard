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
    cy.get('#botaoVoltar').click();
  });

});
