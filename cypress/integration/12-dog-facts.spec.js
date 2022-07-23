/// <reference types="cypress" />

describe('Dog Facts', () => {
  beforeEach(() => {
    cy.visit('/dog-facts');

    cy.get('[data-test="fetch-button"]').as('fetchButton');
    cy.get('[data-test="clear-button"]').as('clearButton');
    cy.get('[data-test="amount-select"]').as('amountSelect');
    cy.get('[data-test="empty-state"]').as('emptyState');

    cy.intercept('/dog-facts/api?*').as('api');
  });

  it('should start out with an empty state', () => {
    cy.get('@emptyState');
  });

  it('should make a request when the button is called', () => {
    cy.get('@fetchButton').click();
    cy.wait('@api').should('exist');
  });

  it('should adjust the amount when the select is changed', () => {
    cy.get('@amountSelect').select('7 Facts').invoke('val').should('equal', '7');
    cy.get('@fetchButton').click();
    cy.wait('@api').then((int) => cy.wrap(int).its('request.url').should('contain', '?amount=7'));
  });

  it('should show the correct number of facts on the page', () => {
    cy.get('@amountSelect').select('7 Facts').invoke('val').should('equal', '7');
    cy.get('@fetchButton').click();
    cy.wait('@api');
    cy.get('#facts article').should('have.length', 7);
  });

  it('should clear the facts when the "Clear" button is pressed', () => {
    cy.get('@amountSelect').select('7 Facts').invoke('val').should('equal', '7');
    cy.get('@fetchButton').click();
    cy.wait('@api');
    cy.get('@emptyState').should('not.exist');
    cy.get('@clearButton').click();
    cy.get('@emptyState').should('exist');
    cy.get('#facts article').should('have.length', 0);
  });

  it("should reflect the number of facts we're looking for in the title", () => {
    cy.get('@amountSelect').select('7 Facts').invoke('val').should('equal', '7');
    cy.get('@fetchButton').click();
    cy.wait('@api');
    cy.title().should('equal', `7 Dog Facts`);
  });
});
