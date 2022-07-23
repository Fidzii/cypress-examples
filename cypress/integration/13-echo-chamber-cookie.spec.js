/// <reference types="cypress" />

import '../support/commands-complete';

const user = {
  email: 'first@example.com',
  password: 'password123',
};

export const decodeToken = (token) => JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
export const encodeToken = (token) => Buffer.from(JSON.stringify(token)).toString('base64');

describe('Signing in with a seeded database', () => {
  beforeEach(() => {
    cy.task('seed');
    cy.visit('/echo-chamber/sign-in');
    cy.signIn(user);
  });

  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('should set a cookie', () => {
    cy.getCookie('jwt')
      .its('value')
      .then((token) => expect(decodeToken(token).email).to.equal(user.email));
  });
});

describe('Setting the cookie', () => {
  beforeEach(() => {
    cy.task('seed');
    cy.setCookie('jwt', encodeToken({ id: 2137, email: user.email }));
    cy.visit('/echo-chamber/sign-in');
  });

  it.skip('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('show that user on the page', () => {
    cy.contains(`Signed in as ${user.email}`);
  });
});

describe('Setting the cookie with real data', () => {
  beforeEach(() => {
    cy.fixture('users').as('users');

    cy.task('seed');
    cy.get('@users')
      .its('users')
      .then((users) => {
        const [user] = users;
        cy.setCookie('jwt', encodeToken(user)).then(() => user);
      })
      .as('user');
    cy.visit('/echo-chamber/sign-in');
  });

  it.skip('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('show that user on the page', () => {
    cy.get('@user').then((user) => cy.contains(`Signed in as ${user.email}`));
  });
});
