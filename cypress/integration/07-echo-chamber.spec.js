/// <reference types="cypress" />

describe('Initial Page', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber');
  });

  it('should have the title of the application in the header', () => {
    cy.get('[data-test="application-title"]').should('contain', 'Echo Chamber');
  });

  it('should have the title of the application in the window', () => {
    cy.title().should('contain', 'Echo Chamber');
  });

  it('should navigate to "/sign-in" when you click the "Sign In" button', () => {
    cy.get('[data-test="sign-in"]').click();
    cy.location('pathname').should('contain', '/sign-in');
  });

  it('should navigate to "/sign-up" when you click the "Sign Up" button', () => {
    cy.get('[data-test="sign-up"]').click();
    cy.location('pathname').should('contain', '/sign-up');
  });
});

describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-submit"]').as('sign-up');
    cy.get('[data-test="sign-up-email"]').as('input-email');
    cy.get('[data-test="sign-up-password"]').as('input-password');
  });

  it('should require an email', () => {
    cy.get('@sign-up').click();
    cy.get('@input-email')
      .should('be.empty')
      .invoke('prop', 'validity')
      .its('valueMissing')
      .should('be.true');
  });

  it('should require that the email actually be an email address', () => {
    cy.get('@input-email').should('be.empty').type('invalidemail');
    cy.get('@sign-up').click();
    cy.get('@input-email').invoke('prop', 'validity').its('typeMismatch').should('be.true');
  });

  it('should require a password when the email is present', () => {
    cy.get('@input-email').should('be.empty').type('email@example.com');
    cy.get('@sign-up').click();
    cy.get('@input-password')
      .should('be.empty')
      .invoke('prop', 'validity')
      .its('valueMissing')
      .should('be.true');
  });
});
