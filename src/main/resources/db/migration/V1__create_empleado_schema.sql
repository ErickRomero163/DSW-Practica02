CREATE SEQUENCE IF NOT EXISTS empleado_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS empleado (
    clave VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    CONSTRAINT chk_empleado_clave_formato CHECK (clave ~ '^E-[0-9]+$')
);
