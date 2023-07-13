/// <reference types="Cypress" />

describe('template spec', () => {
  const host = 'http://localhost:8080';

  beforeEach(() => cy.visit(host));

  it('Deve ser possível cadastrar um novo atendimento', () => {
    //Para cadastrar um novo atendimento o responsável deve estar logado
    cy.get('#open-atendimento-page').click();
    cy.get('.form-login').should('exist');

    cy.get('#login-email').type(Cypress.env('email'));
    cy.get('#login-password').type(Cypress.env('senha'));
    cy.get('#button-login').click();

    cy.url().should('eq', `${host}/home`);

    //Para cadastrar um novo atendimento deve existir um pet
    cy.get('#pet-page').click();
    cy.get('.form-pet').should('exist');

    cy.get('#nomePet').type('Bidu');
    cy.get('#tutorPet').type('João');
    cy.get('#telefonePet').type('999999');
    cy.get('#enderecoPet').type('IFPB');

    cy.get('#button-create-pet').click();

    cy.get('#return-button').click();

    cy.url().should('eq', `${host}/home`);

    //Para cadastrar um novo atendimento deve ser aberto a página de atendimento
    cy.get('#open-atendimento-page').click();
    cy.get('#tipoAtend').select('Tosa');
    cy.get('#responsavelInput').type('admin');
    cy.get('#petInput').type('Bidu');

    cy.get('#search-pr').click();

    cy.get('#descricaoAtend').type('Descrição Teste');

    cy.get('#dataAtend').type(`${new Date().toISOString().substring(0, 16)}`);

    const cardsAntes = document.getElementsByClassName('card-atendimentos').length;

    cy.get('#send-atendimento').click();

    cy.get('#return-button').click();

    cy.url().should('eq', `${host}/home`);

    cy.get('#card-atendimentos-container')
      .find('.card-atendimentos')
      .should('have.length.at.least', cardsAntes + 1);
  });

  it('Deve ser possível buscar um atendimento pela descrição e tipo', () => {
    cy.get('#desc-search').type('Descrição Teste');
    cy.get('#tipo-search').select('Banho');

    cy.get('#button-search').click();

    cy.get('.card')
      .last()
      .should((card) => {
        const val = card.get(0).innerText;
        expect(val).to.include('Descrição Teste');
      });
  });
});
