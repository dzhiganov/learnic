/* eslint-disable jest/valid-expect */
import buildUser from '../support/generate';

describe('Register', () => {
  beforeEach(() => {
    cy.clearFirebaseAuth();
  });
  it('should register a new user', () => {
    const user = buildUser();

    cy.visit('http://localhost:3000/')
      .get('.styles_link__ifYYK')
      .click()
      .get('#login')
      .type(user.username)
      .get('#pass')
      .type(user.password)
      .get('[data-testid=submit-button]')
      .click()
      .location()
      .should((loc) => {
        expect(loc.pathname.toString()).to.equal('/home');
      });
  });
});
