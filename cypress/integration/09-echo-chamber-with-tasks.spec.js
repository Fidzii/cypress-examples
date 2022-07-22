/// <reference types="cypress" />

const user = {
  email: `firstUser@example.com`,
  password: 'password123',
};

const existingUser = {
  email: 'second@example.com',
  password: 'password456',
};

describe('Sign Up', () => {
  beforeEach(() => {
    cy.task('reset');
  });

  it('should successfully create a user when entering an email and a password', () => {
    // Sign Up
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').type(user.email);
    cy.get('[data-test="sign-up-password"]').type(user.password);
    cy.get('[data-test="sign-up-submit"]').click();

    // Sign In
    cy.visit('/echo-chamber/sign-in');
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });

  it('should not create a user when entering already existing credentials', () => {
    cy.task('seed');
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').type(existingUser.email);
    cy.get('[data-test="sign-up-password"]').type(existingUser.password);
    cy.get('[data-test="sign-up-submit"]').click();

    cy.location('search').should('contain', '?error=A+user+already+exists+with+that+email.');
    cy.contains('A user already exists with that email.');
  });
});

describe('Sign In', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('seed');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should fail with bad credentials', () => {
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('not.contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email).should('not.exist');
    cy.contains('No such user exists');
  });

  it('should succeed with good credentials', () => {
    cy.visit('/echo-chamber/sign-in');
    cy.get('[data-test="sign-in-email"]').type(existingUser.email);
    cy.get('[data-test="sign-in-password"]').type(existingUser.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + existingUser.email);
  });
});
