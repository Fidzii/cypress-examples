/// <reference types="cypress" />

describe('Create a New Item', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  it('should have a form', () => {
    cy.get('form').should('exist');
  });

  it('should have a new item input', () => {
    cy.get('[data-test="new-item-input"]').should('exist');
  });

  it('should have an add item button', () => {
    cy.get('[data-test="add-item"]').should('be.disabled');
  });

  it('should add new item named "some item"', () => {
    cy.get('[data-test="new-item-input"]').type('some item');
    cy.get('[data-test="add-item"]').should('be.enabled');
    cy.get('[data-test="add-item"]').click();
    cy.get('[data-test="items-unpacked"]').contains('some item');
  });
});
