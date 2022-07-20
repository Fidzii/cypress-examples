/// <reference types="cypress" />

describe('Aliases', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
    cy.get('[data-test="filter-items"]').as('filterInput');
    cy.get('[data-test="items"] li').as('items');
  });

  it('should contain only matching items', () => {
    const phrase = 'Tooth';

    cy.get('@filterInput').type(phrase);
    cy.get('@items').each((item) => {
      cy.wrap(item).should('contain.text', phrase).should('not.contain.text', 'Hoodie');
    });
  });
});
