CREATE TABLE IF NOT EXISTS departamento (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT uk_departamento_nombre UNIQUE (nombre)
);

INSERT INTO departamento (nombre, descripcion)
VALUES ('SIN_ASIGNAR', 'Departamento por defecto para migración de empleados existentes')
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE empleado
    ADD COLUMN IF NOT EXISTS departamento_id BIGINT;

UPDATE empleado e
SET departamento_id = d.id
FROM departamento d
WHERE d.nombre = 'SIN_ASIGNAR'
  AND e.departamento_id IS NULL;

ALTER TABLE empleado
    ALTER COLUMN departamento_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_empleado_departamento'
          AND table_name = 'empleado'
    ) THEN
        ALTER TABLE empleado
            ADD CONSTRAINT fk_empleado_departamento
            FOREIGN KEY (departamento_id)
            REFERENCES departamento (id);
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_empleado_departamento_id
    ON empleado (departamento_id);
