import { query } from "./db";

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS staff (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_number VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      station VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS incidents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(10) UNIQUE NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
      severity VARCHAR(10) NOT NULL,
      station VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      incident_type VARCHAR(100) NOT NULL,
      date VARCHAR(20) NOT NULL,
      day VARCHAR(20) NOT NULL,
      time VARCHAR(20) NOT NULL,
      shift VARCHAR(20) NOT NULL,
      reported_by VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),

      detection JSONB,
      passenger JSONB,
      train_ops JSONB,
      evacuation JSONB,
      staff_data JSONB,
      impact JSONB
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      action VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id VARCHAR(50),
      user_job_number VARCHAR(20),
      user_name VARCHAR(100),
      details JSONB,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_incidents_station ON incidents(station);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
  `);

  console.log("[DB] Schema initialized successfully");
}
