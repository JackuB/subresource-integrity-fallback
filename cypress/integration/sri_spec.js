/*
  Scenarios
  - fail SRI on first script and load fallback without SRI
*/

describe('Plain JS', function() {
  it('successfully loads original script', function() {
    cy.visit('scenario-1.html');
    cy.contains('body', 'First script loaded');
  });
});

describe('JS with valid SRI', function() {
  it('successfully loads original script', function() {
    cy.visit('scenario-2.html');
    cy.contains('body', 'First script loaded');
  });
});

describe('JS with invalid SRI, but valid fallback', function() {
  it('fails to load original script', function() {
    cy.visit('scenario-3.html');
    cy.get('body').should('not.contain', 'First script loaded');
  });

  it('loads the fallback script', function() {
    cy.contains('body', 'Fallback script loaded');
  });

  it('does not execute the resourceLoadError callback', function() {
    cy.get('body').should('not.contain', 'resourceLoadError');
  });
});

describe('JS with invalid SRI and fallback (invalid hash)', function() {
  it('fails to load original script', function() {
    cy.visit('scenario-4.html');
    cy.get('body').should('not.contain', 'First script loaded');
  });

  it('fails to load the fallback script', function() {
    cy.get('body').should('not.contain', 'Fallback script loaded');
  });

  it('executes the resourceLoadError callback', function() {
    cy.contains('body', 'resourceLoadError');
    cy.contains('body', 'Loading original and fallback failed');
  });
});

describe('JS with invalid SRI (compromised file)', function() {
  it('fails to load original script', function() {
    cy.visit('scenario-5.html');
    cy.get('body').should('not.contain', 'First script loaded');
  });

  it('executes the resourceLoadError callback', function() {
    cy.contains('body', 'resourceLoadError');
    cy.contains('body', 'Loading original failed');
  });
});

describe('Multiple JS files with SRI, one is compromised', function() {
  it('fails to load original script', function() {
    cy.visit('scenario-5.html');
    cy.get('body').should('not.contain', 'First script loaded');
  });

  it('executes the resourceLoadError callback', function() {
    cy.contains('body', 'resourceLoadError');
    cy.contains('body', 'Loading original failed');
  });
});