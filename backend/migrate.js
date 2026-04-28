import pool from './src/config/database.js';
import fs from 'fs';
import path from 'path';

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    
    const connectionURL = `${process.env.DB_HOST}/${process.env.DB_NAME}`;
    console.log(`📊 Connecting to database...`);

    const connection = await pool.getConnection();
    
    // Read schema
    const schemaPath = path.join(process.cwd(), '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split and execute
    const statements = schemaSQL.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log('✅ Executed:', statement.substring(0, 50).trim());
      }
    }

    // Read seed
    const seedPath = path.join(process.cwd(), '../database/seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    const seedStatements = seedSQL.split(';').filter(s => s.trim());
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log('🌱 Seeded:', statement.substring(0, 50).trim());
      }
    }

    connection.release();
    
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
