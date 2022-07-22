/// <reference types="cypress" />

const pokemon = [
  { id: 1, name: 'Bumblesaur' },
  { id: 2, name: 'Charmer' },
  { id: 3, name: 'Turtle' },
];

describe('Pokémon Search', () => {
  beforeEach(() => {
    cy.visit('/pokemon-search');

    cy.get('[data-test="search"]').as('search');
    cy.get('[data-test="search-label"]').as('label');

    cy.intercept('/pokemon-search/api?*').as('api');
  });

  it('should call the API when the user types', () => {
    cy.get('@search').type('char');
    cy.wait('@api');
  });

  it('should update the query parameter', () => {
    cy.get('@search').type('char');
    cy.wait('@api');
    cy.location('search').should('equal', '?name=char');
  });

  it('should call the API with correct query parameter', () => {
    cy.get('@search').type('char');
    cy.wait('@api').its('request.url').should('contain', '?name=char');
  });

  it('should pre-populate the search field with the query parameter', () => {
    cy.visit({ url: '/pokemon-search', qs: { name: 'char' } });
    cy.get('@search').invoke('val').should('equal', 'char');
  });

  it('should render the results to the page', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stub');
    cy.get('@search').type('char');
    cy.wait('@stub');
    cy.get('[data-test="result"]').should('have.length', 3);
  });

  it('should link to the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stub');

    cy.get('@search').type('char');
    cy.wait('@stub');

    cy.get('[data-test="result"] a').each((link, idx) =>
      cy.wrap(link).invoke('attr', 'href').should('contain', `/pokemon-search/${pokemon[idx].id}`),
    );
  });

  it('should persist the query parameter in the link to a pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stub');

    cy.get('@search').type('char');
    cy.wait('@stub');

    cy.get('[data-test="result"] a').each((link) =>
      cy.wrap(link).invoke('attr', 'href').should('contain', `name=char`),
    );
  });

  it('should bring you to the route for the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stub');
    cy.intercept('/pokemon-search/api/*', { fixture: 'bulbasaur.json' }).as('data');

    cy.get('@search').type('char');
    cy.wait('@stub');

    cy.get('[data-test="result"] a').first().click();
    cy.wait('@data');

    cy.location('pathname').should('contain', '/pokemon-search/1');
  });

  it('should immediately fetch a pokémon if a query parameter is provided', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stub');
    cy.intercept({ url: '/pokemon-search/api/1', method: 'GET' }, { fixture: 'bulbasaur.json' }).as(
      'data',
    );

    cy.visit({ url: '/pokemon-search/1', qs: { name: 'char' } });
    cy.wait('@data');
    cy.get('table').should('exist');

    cy.wait('@stub');
    cy.get('[data-test="result"]').should('have.length', 3);
  });
});
