/// <reference types="cypress" />

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  describe('Adding a new item', () => {
    it('should put a new item on the page after clicking on "Add Item"', () => {
      cy.get('[data-test="new-item-input"]').type('new item');
      cy.get('[data-test="add-item"]').click();
      cy.contains('new item');
    });

    it('should put a new item in the "Unpacked Items" list', () => {
      cy.get('[data-test="new-item-input"]').type('other item');
      cy.get('[data-test="add-item"]').click();
      cy.get('[data-test="items-unpacked"]').contains('other item');
    });

    it('should put a new item as the last item in the "Unpacked Items" list', () => {
      cy.get('[data-test="new-item-input"]').type('another item');
      cy.get('[data-test="add-item"]').click();
      cy.get('[data-test="items-unpacked"] li').last().contains('another item');
    });
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      cy.get('[data-test="filter-items"]').type('tooth');
      cy.get('[data-test="items"] li').each((element) => {
        cy.wrap(element).contains('tooth', { matchCase: false });
      });
    });

    it('should hide items that do not match whatever is in the filter field', () => {
      cy.get('[data-test="filter-items"]').type('tooth');
      cy.get('[data-test="items"] li')
        .contains('iphone charger', { matchCase: false })
        .should('not.exist');
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        cy.get('[data-test="items"] li').should('have.length.above', 0);
        cy.get('[data-test="remove-all"]').should('be.enabled').click();
        cy.get('[data-test="items"] li').should('have.length', 0);
      });
    });

    describe('Remove individual items', () => {
      it('should have a remove button on an item', () => {
        cy.get('[data-test="items-unpacked"] li').each((element) => {
          cy.wrap(element).find('[data-test="remove"]').should('exist');
        });
      });

      it('should remove an item from the page', () => {
        cy.get('[data-test="items-unpacked"] li').each((element) => {
          cy.wrap(element).find('[data-test="remove"]').click();
          cy.wrap(element).should('not.exist');
        });
      });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
      cy.get('[data-test="mark-all-as-unpacked"]').click();
      cy.get('[data-test="items-packed"] li').should('have.length', 0);
    });

    it('should empty have all of the items in the "Unpacked" list', () => {
      cy.get('[data-test="mark-all-as-unpacked"]').click();
      cy.get('[data-test="items-unpacked"] li').should('have.length', 5);
    });
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      cy.get('[data-test="items-unpacked"] li').contains('Tooth Paste').find('input').click();
      cy.get('[data-test="items-unpacked"] li').contains('Tooth Paste').should('not.exist');
      cy.get('[data-test="items-packed"] li').contains('Tooth Paste').should('exist');
    });
  });
});
