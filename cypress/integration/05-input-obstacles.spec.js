/// <reference types="cypress" />

describe('Input obstacles', () => {
  beforeEach(() => {
    cy.visit('/obstacle-course');
  });

  it('should input text into the input field', () => {
    const thought = 'Ravioli are a form of pop tart.';

    cy.get('[data-test="text-input"]').type(thought);
    cy.get('[data-test="text-result"]').contains(thought);
  });

  it('should control a select input', () => {
    cy.get('[data-test="select-input"]').select('Hulk');
    cy.get('[data-test="select-result"]').contains('Hulk');
  });

  it('should find and control a checkbox input', () => {
    cy.get('[data-test="checkbox-result"]').contains('(None)');
    cy.get('[data-test="checkbox-tomato"]').should('not.be.checked').check().should('be.checked');
    cy.get('[data-test="checkbox-result"]').contains('Tomato');
  });

  it('should find and control a radio input', () => {
    cy.get('[data-test="radio-ringo"]').should('not.be.checked').check().should('be.checked');
    cy.get('[data-test="radio-result"]').contains('Ringo');
  });

  it('should find and control a color input', () => {
    cy.get('[data-test="color-input"]').invoke('val', '#00ff00').trigger('input');
    cy.get('[data-test="color-result"]').contains('#00ff00');
  });

  it('should find and control a date input', () => {
    cy.get('[data-test="date-input"]').invoke('val', '2022-07-21').trigger('input');
    cy.get('[data-test="date-result"]').contains('2022-07-21');
  });

  it('should find and control a range input', () => {
    cy.get('[data-test="range-input"]').invoke('val', 8).trigger('input');
    cy.get('[data-test="range-result"]').contains(8);
  });

  it('should find and control a file input', () => {
    cy.get('[data-test="file-input"]').attachFile({
      fileContent: 'some content',
      mimeType: 'text/plain',
      fileName: 'important-file.txt',
    });
    cy.get('[data-test="file-result"]').contains('important-file.txt');
  });
});
