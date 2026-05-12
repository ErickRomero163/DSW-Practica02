describe('Login E2E visual', () => {
  it('permite iniciar sesion y navegar a departamentos', () => {
    cy.visit('http://localhost:4200/login');

    cy.get('[data-cy="login-email"]').should('exist').and('be.visible');
    cy.get('[data-cy="login-password"]').should('exist').and('be.visible');

    cy.get('[data-cy="login-email"]').type('test@example.com');
    cy.get('[data-cy="login-password"]').type('123456');
    cy.get('[data-cy="login-submit"]').click();

    cy.location('pathname').should('eq', '/departamentos');
  });
});
