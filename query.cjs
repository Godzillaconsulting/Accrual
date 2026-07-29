const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:godzilla2026@localhost:5432/accrual' });
pool.query("SELECT numero_contacto, contexto_ia FROM wa_workflow_states WHERE numero_contacto LIKE '%70687024771160%'")
  .then(res => { console.log(JSON.stringify(res.rows, null, 2)); process.exit(0); })
  .catch(console.error);
