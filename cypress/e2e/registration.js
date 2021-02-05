import buildUser from '../support/generate';

describe('Register', () => {
  beforeEach(() => {
    cy.clearFirebaseAuth();
  });
  it('should register a new user', () => {
    const user = buildUser();

    cy.visit('/')
      .get('.styles_link__ifYYK')
      .click()
      .get('#login')
      .type(user.username)
      .get('#pass')
      .type(user.password)
      .get('[data-test-id=submit-button]')
      .click()
      .url()
      .should('eq', `${Cypress.config().baseUrl}/home`);
  });
});
