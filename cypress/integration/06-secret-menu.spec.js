/// <reference types="cypress" />

const restaurants = [
  'Chick-fil-A',
  'McDonalds',
  'In-N-Out',
  'KFC',
  'Jack In The Box',
  'Jamba Juice',
  'Starbucks',
  'Dairy Queen',
  'Burger King',
  'Chipotle',
  'Taco Bell',
  'Five Guys',
  'Sonic',
  'Subway',
  'Panera Bread',
];

const properties = [
  'name',
  'whereToOrder',
  'description',
  'secret',
  'ingredients',
  'popularity',
  'price',
  'howToOrder',
];

const ratings = [1, 2, 3, 4, 5, 6, 7];

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
  });

  it('should exist have the title on the page', () => {
    cy.get('h1').should('contain', 'Secret Menu Items');
  });

  for (const rating of ratings) {
    it(`should set minimum rating: ${rating}`, () => {
      cy.get('#minimum-rating-visibility').invoke('val', rating).trigger('input');
      cy.get('td[headers="popularity-column"]').each((cell) =>
        cy.wrap(cell).invoke('text').then(parseInt).should('be.at.least', rating),
      );
    });
  }

  for (const restaurant of restaurants) {
    it(`should select restaurant: ${restaurant}`, () => {
      cy.get('#restaurant-visibility-filter').select(restaurant);
      cy.get('.whereToOrder > .cell').each((cell) => cy.wrap(cell).contains(restaurant));
    });
  }

  for (const property of properties) {
    it(`should uncheck property ${property}`, () => {
      cy.get(`[for="show-${property}"]`).click();
      cy.get(`#${property}-column`).should('be.hidden');
      cy.get(`td.${property}`).should('be.hidden');
    });
  }
});
