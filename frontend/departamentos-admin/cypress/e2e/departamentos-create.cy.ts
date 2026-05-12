describe('Crear departamento', () => {
  it('inicia sesion y crea un departamento', () => {
    const departamentos: Array<{ id: number; nombre: string; descripcion: string | null }> = [];

    cy.intercept('GET', '**/api/v1/departamentos', (req) => {
      req.reply({ statusCode: 200, body: departamentos });
    }).as('getDepartamentos');

    cy.intercept('POST', '**/api/v1/departamentos', (req) => {
      const nuevoDepartamento = {
        id: departamentos.length + 1,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion ?? null
      };

      departamentos.push(nuevoDepartamento);
      req.reply({ statusCode: 201, body: nuevoDepartamento });
    }).as('postDepartamento');

    cy.visit('http://localhost:4200/login');
    cy.get('[data-cy="login-email"]').type('admin@example.com');
    cy.get('[data-cy="login-password"]').type('123456');
    cy.get('[data-cy="login-submit"]').click();

    cy.location('pathname').should('eq', '/departamentos');
    cy.wait('@getDepartamentos');

    cy.get('[data-cy="departamento-nombre"]').type('TI');
    cy.get('[data-cy="departamento-descripcion"]').type('Departamento de tecnologia');
    cy.get('[data-cy="departamento-submit"]').click();

    cy.wait('@postDepartamento')
      .its('request.body')
      .should((body) => {
        expect(body.nombre).to.equal('TI');
        expect(body.descripcion).to.equal('Departamento de tecnologia');
      });

    cy.wait('@getDepartamentos');
    cy.contains('[data-cy="departamentos-list"] li', 'TI').should('be.visible');
  });
});
