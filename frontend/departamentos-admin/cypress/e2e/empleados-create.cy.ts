describe('Crear empleado', () => {
  it('inicia sesion y crea un empleado', () => {
    const departamentos: Array<{ id: number; nombre: string; descripcion: string | null }> = [
      { id: 1, nombre: 'TI', descripcion: 'Departamento de tecnologia' }
    ];

    const empleados: Array<{
      clave: string;
      nombre: string;
      direccion: string;
      telefono: string;
      departamento: { id: number; nombre: string; descripcion: string | null };
    }> = [];

    cy.intercept('GET', '**/api/v1/departamentos', (req) => {
      req.reply({ statusCode: 200, body: departamentos });
    }).as('getDepartamentos');

    cy.intercept('GET', '**/api/v1/empleados', (req) => {
      req.reply({ statusCode: 200, body: empleados });
    }).as('getEmpleados');

    cy.intercept('POST', '**/api/v1/empleados', (req) => {
      const departamentoSeleccionado = departamentos.find((d) => d.id === req.body.departamentoId);

      expect(departamentoSeleccionado, 'departamento para el empleado').to.exist;

      const nuevoEmpleado = {
        clave: `EMP-${empleados.length + 1}`,
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        departamento: departamentoSeleccionado as { id: number; nombre: string; descripcion: string | null }
      };

      empleados.push(nuevoEmpleado);
      req.reply({ statusCode: 201, body: nuevoEmpleado });
    }).as('postEmpleado');

    cy.visit('http://localhost:4200/login');
    cy.get('[data-cy="login-email"]').type('admin@example.com');
    cy.get('[data-cy="login-password"]').type('123456');
    cy.get('[data-cy="login-submit"]').click();

    cy.location('pathname').should('eq', '/departamentos');
    cy.wait('@getDepartamentos');

    cy.get('[data-cy="nav-empleados"]').click();
    cy.location('pathname').should('eq', '/empleados');

    cy.wait('@getEmpleados');
    cy.wait('@getDepartamentos');

    cy.get('[data-cy="empleado-nombre"]').type('Juan Perez');
    cy.get('[data-cy="empleado-direccion"]').type('Av. Principal 123');
    cy.get('[data-cy="empleado-telefono"]').type('5551234567');
    cy.get('[data-cy="empleado-departamento"]').select('TI');
    cy.get('[data-cy="empleado-submit"]').click();

    cy.wait('@postEmpleado')
      .its('request.body')
      .should((body) => {
        expect(body.nombre).to.equal('Juan Perez');
        expect(body.direccion).to.equal('Av. Principal 123');
        expect(body.telefono).to.equal('5551234567');
        expect(body.departamentoId).to.equal(1);
      });

    cy.wait('@getEmpleados');
    cy.contains('li', 'Juan Perez').should('be.visible');
  });
});
