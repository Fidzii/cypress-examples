/// <reference types="cypress" />

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');

    cy.get('#minimum-rating-visibility').as('rating-filter');
    cy.get('#restaurant-visibility-filter').as('restaurant-filter');
  });

  it('should set the range and verify it', () => {
    cy.get('@rating-filter').invoke('val', 5).trigger('input').should('have.value', 5);

    cy.get('@rating-filter')
      .invoke('val')
      .then((val) => {
        cy.get('[headers="popularity-column"] .cell')
          .first()
          .invoke('text')
          .then(parseInt)
          .should('be.at.least', Number(val));
      });
  });

  it('should check the checkbox and verify it', () => {
    cy.get('[for="show-description"] input').should('be.checked').click().should('not.be.checked');

    cy.get('#description-column').should('be.hidden');
    cy.get('[headers="description-column"]').should('be.hidden');
  });

  it('should select an option from the select and verify it', () => {
    cy.get('@restaurant-filter').select(1).as('selected');
    cy.get('@selected')
      .find('option:selected')
      .invoke('text')
      .then((text) => {
        cy.get('.whereToOrder').each((element) => cy.wrap(element).should('have.text', text));
      });
  });
});
