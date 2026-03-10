import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("care_tracker.db");

// Initialize Database with full schema
db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    billing_method TEXT CHECK(billing_method IN ('monthly', 'completed')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS therapists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT,
    phone TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    therapist_id INTEGER,
    name TEXT NOT NULL,
    service_type TEXT,
    total_sessions INTEGER NOT NULL,
    price_per_session REAL NOT NULL,
    start_date DATE,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'paused')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    therapist_id INTEGER,
    session_date DATE NOT NULL,
    session_number INTEGER,
    status TEXT DEFAULT 'pending' CHECK(status IN ('completed', 'pending', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    month INTEGER,
    year INTEGER,
    total_sessions INTEGER DEFAULT 0,
    total_amount REAL DEFAULT 0,
    amount_paid REAL DEFAULT 0,
    status TEXT DEFAULT 'unpaid' CHECK(status IN ('unpaid', 'partially_paid', 'paid')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    amount REAL NOT NULL,
    payment_date DATE NOT NULL,
    method TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS company_service_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    price REAL NOT NULL,
    UNIQUE(company_id, service_id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  -- Seed Data
  INSERT OR IGNORE INTO services (id, name, description, base_price) VALUES 
  (1, 'علاج طبيعي', 'Physiotherapy sessions', 150),
  (2, 'زيارة ممرضة', 'Nurse home visit', 100),
  (3, 'زيارة طبيب', 'Doctor home visit', 300),
  (4, 'مقدم رعاية', 'Caregiver services', 80);

  INSERT OR IGNORE INTO companies (id, name, contact_person, phone, email, billing_method) VALUES 
  (1, 'ذات قروب - That Group', 'المسؤول', '0500000001', 'thatgroup@example.com', 'monthly'),
  (2, 'إشفاء - Ishfaa', 'المسؤول', '0500000002', 'ishfaa@example.com', 'monthly'),
  (3, 'حكيم كير - Hakeem Care', 'المسؤول', '0500000003', 'hakeemcare@example.com', 'monthly'),
  (4, 'نرعاكم - Naraakum', 'المسؤول', '0500000004', 'naraakum@example.com', 'monthly'),
  (5, 'وتد - Watad', 'المسؤول', '0500000005', 'watad@example.com', 'monthly');

  INSERT OR IGNORE INTO therapists (id, name, specialty, phone) VALUES 
  (1, 'د. فهد الشمري', 'علاج طبيعي', '0560001111'),
  (2, 'م. نورة القحطاني', 'تمريض', '0560002222');

  INSERT OR IGNORE INTO patients (id, company_id, therapist_id, name, service_type, total_sessions, price_per_session, start_date) VALUES 
  (1, 1, 1, 'محمد العتيبي', 'علاج طبيعي', 12, 150, '2024-03-01'),
  (2, 2, 2, 'فهد السبيعي', 'زيارة ممرضة', 10, 100, '2024-03-05');

  INSERT OR IGNORE INTO sessions (id, patient_id, therapist_id, session_date, session_number, status) VALUES 
  (1, 1, 1, '2024-03-02', 1, 'completed'),
  (2, 1, 1, '2024-03-04', 2, 'completed'),
  (3, 2, 2, '2024-03-06', 1, 'completed');

  INSERT OR IGNORE INTO invoices (id, company_id, month, year, total_sessions, total_amount, amount_paid, status) VALUES 
  (1, 1, 3, 2024, 2, 300, 150, 'partially_paid');

  INSERT OR IGNORE INTO payments (id, invoice_id, amount, payment_date, method) VALUES 
  (1, 1, 150, '2024-03-07', 'Cash');
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Services API
  app.get("/api/services", (req, res) => {
    const services = db.prepare("SELECT * FROM services ORDER BY name ASC").all();
    res.json(services);
  });

  app.post("/api/services", (req, res) => {
    const { name, description, base_price } = req.body;
    try {
      const result = db.prepare("INSERT INTO services (name, description, base_price) VALUES (?, ?, ?)").run(name, description, base_price);
      res.json({ id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Service name must be unique" });
    }
  });

  app.put("/api/services/:id", (req, res) => {
    const { name, description, base_price } = req.body;
    db.prepare("UPDATE services SET name = ?, description = ?, base_price = ? WHERE id = ?").run(name, description, base_price, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/services/:id", (req, res) => {
    db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

// Company Service Prices API
app.get("/api/company-prices/:companyId", (req, res) => {
  const prices = db.prepare(`
    SELECT csp.*, s.name as service_name 
    FROM company_service_prices csp
    JOIN services s ON csp.service_id = s.id
    WHERE csp.company_id = ?
  `).all(req.params.companyId);
  res.json(prices);
});

app.post("/api/company-prices", (req, res) => {
  const { company_id, service_id, price } = req.body;
  db.prepare(`
    INSERT INTO company_service_prices (company_id, service_id, price) 
    VALUES (?, ?, ?)
    ON CONFLICT(company_id, service_id) DO UPDATE SET price = excluded.price
  `).run(company_id, service_id, price);
  res.json({ success: true });
});

// Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const { company_id, month, year, service_type } = req.query;
    let sessionFilter = "WHERE status = 'completed'";
    let patientFilter = "WHERE 1=1";
    let params: any[] = [];

    if (company_id) {
      sessionFilter += " AND patient_id IN (SELECT id FROM patients WHERE company_id = ?)";
      patientFilter += " AND company_id = ?";
      params.push(company_id);
    }
    if (month && year) {
      sessionFilter += " AND strftime('%m', session_date) = ? AND strftime('%Y', session_date) = ?";
      params.push(month.toString().padStart(2, '0'), year.toString());
    }
    if (service_type) {
      sessionFilter += " AND patient_id IN (SELECT id FROM patients WHERE service_type = ?)";
      patientFilter += " AND service_type = ?";
      params.push(service_type);
    }

    const stats = {
      totalCompanies: db.prepare("SELECT COUNT(*) as count FROM companies").get().count,
      totalPatients: db.prepare(`SELECT COUNT(*) as count FROM patients ${patientFilter}`).get(...(company_id || service_type ? [company_id || service_type] : [])).count,
      totalTherapists: db.prepare("SELECT COUNT(*) as count FROM therapists").get().count,
      totalSessionsCompleted: db.prepare(`SELECT COUNT(*) as count FROM sessions ${sessionFilter}`).get(...params).count,
      remainingSessions: db.prepare(`
        SELECT SUM(total_sessions) - (SELECT COUNT(*) FROM sessions WHERE status = 'completed') as count 
        FROM patients
      `).get().count || 0,
      monthlyRevenue: db.prepare(`
        SELECT SUM(amount) as total FROM payments 
        WHERE strftime('%m', payment_date) = strftime('%m', 'now')
      `).get().total || 0,
      outstandingBalance: db.prepare("SELECT SUM(total_amount - amount_paid) as total FROM invoices").get().total || 0,
    };
    res.json(stats);
  });

  // Search
  app.get("/api/search", (req, res) => {
    const { q } = req.query;
    const query = `%${q}%`;
    const results = {
      patients: db.prepare("SELECT * FROM patients WHERE name LIKE ? LIMIT 5").all(query),
      companies: db.prepare("SELECT * FROM companies WHERE name LIKE ? LIMIT 5").all(query),
      therapists: db.prepare("SELECT * FROM therapists WHERE name LIKE ? LIMIT 5").all(query),
      invoices: db.prepare("SELECT i.*, c.name as company_name FROM invoices i JOIN companies c ON i.company_id = c.id WHERE c.name LIKE ? OR i.id LIKE ? LIMIT 5").all(query, query),
    };
    res.json(results);
  });

  // Companies
  app.get("/api/companies", (req, res) => {
    const { company_id } = req.query;
    let filter = "WHERE 1=1";
    let params: any[] = [];
    if (company_id) {
      filter += " AND c.id = ?";
      params.push(company_id);
    }

    const companies = db.prepare(`
      SELECT c.*, 
      (SELECT COUNT(*) FROM patients WHERE company_id = c.id) as patient_count,
      (SELECT SUM(total_amount) FROM invoices WHERE company_id = c.id) as total_revenue,
      (SELECT SUM(total_amount - amount_paid) FROM invoices WHERE company_id = c.id) as unpaid_balance
      FROM companies c
      ${filter}
    `).all(...params);
    res.json(companies);
  });

  app.post("/api/companies", (req, res) => {
    const { name, contact_person, phone, email, address, billing_method, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO companies (name, contact_person, phone, email, address, billing_method, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, contact_person, phone, email, address, billing_method, notes);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/companies/:id", (req, res) => {
    const { name, contact_person, phone, email, address, billing_method, notes } = req.body;
    db.prepare(`
      UPDATE companies 
      SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?, billing_method = ?, notes = ?
      WHERE id = ?
    `).run(name, contact_person, phone, email, address, billing_method, notes, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/companies/:id", (req, res) => {
    db.prepare("DELETE FROM companies WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Therapists
  app.get("/api/therapists", (req, res) => {
    const therapists = db.prepare(`
      SELECT t.*, 
      (SELECT COUNT(*) FROM sessions WHERE therapist_id = t.id AND status = 'completed') as session_count
      FROM therapists t
    `).all();
    res.json(therapists);
  });

  app.post("/api/therapists", (req, res) => {
    const { name, specialty, phone, notes } = req.body;
    const result = db.prepare("INSERT INTO therapists (name, specialty, phone, notes) VALUES (?, ?, ?, ?)").run(name, specialty, phone, notes);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/therapists/:id", (req, res) => {
    const { name, specialty, phone, notes } = req.body;
    db.prepare(`
      UPDATE therapists 
      SET name = ?, specialty = ?, phone = ?, notes = ?
      WHERE id = ?
    `).run(name, specialty, phone, notes, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/therapists/:id", (req, res) => {
    db.prepare("DELETE FROM therapists WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Patients
  app.get("/api/patients", (req, res) => {
    const { company_id, service_type } = req.query;
    let filter = "WHERE 1=1";
    let params: any[] = [];
    if (company_id) {
      filter += " AND p.company_id = ?";
      params.push(company_id);
    }
    if (service_type) {
      filter += " AND p.service_type = ?";
      params.push(service_type);
    }

    const patients = db.prepare(`
      SELECT p.*, c.name as company_name, t.name as therapist_name,
      (SELECT COUNT(*) FROM sessions WHERE patient_id = p.id AND status = 'completed') as completed_sessions
      FROM patients p
      LEFT JOIN companies c ON p.company_id = c.id
      LEFT JOIN therapists t ON p.therapist_id = t.id
      ${filter}
    `).all(...params);
    res.json(patients);
  });

  app.post("/api/patients", (req, res) => {
    const { name, company_id, therapist_id, service_type, total_sessions, price_per_session, start_date, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO patients (name, company_id, therapist_id, service_type, total_sessions, price_per_session, start_date, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, company_id, therapist_id, service_type, total_sessions, price_per_session, start_date, notes);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/patients/:id", (req, res) => {
    const { name, company_id, therapist_id, service_type, total_sessions, price_per_session, start_date, status, notes } = req.body;
    db.prepare(`
      UPDATE patients 
      SET name = ?, company_id = ?, therapist_id = ?, service_type = ?, total_sessions = ?, price_per_session = ?, start_date = ?, status = ?, notes = ?
      WHERE id = ?
    `).run(name, company_id, therapist_id, service_type, total_sessions, price_per_session, start_date, status, notes, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/patients/:id", (req, res) => {
    db.prepare("DELETE FROM patients WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Sessions
  app.get("/api/sessions", (req, res) => {
    const { company_id, service_type } = req.query;
    let filter = "WHERE 1=1";
    let params: any[] = [];
    if (company_id) {
      filter += " AND p.company_id = ?";
      params.push(company_id);
    }
    if (service_type) {
      filter += " AND p.service_type = ?";
      params.push(service_type);
    }

    const sessions = db.prepare(`
      SELECT s.*, p.name as patient_name, c.name as company_name, t.name as therapist_name, p.service_type
      FROM sessions s
      JOIN patients p ON s.patient_id = p.id
      JOIN companies c ON p.company_id = c.id
      JOIN therapists t ON s.therapist_id = t.id
      ${filter}
      ORDER BY s.session_date DESC
    `).all(...params);
    res.json(sessions);
  });

  app.post("/api/sessions", (req, res) => {
    const { patient_id, therapist_id, session_date, session_number, status, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO sessions (patient_id, therapist_id, session_date, session_number, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(patient_id, therapist_id, session_date, session_number, status, notes);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/sessions/:id", (req, res) => {
    const { patient_id, therapist_id, session_date, session_number, status, notes } = req.body;
    db.prepare(`
      UPDATE sessions 
      SET patient_id = ?, therapist_id = ?, session_date = ?, session_number = ?, status = ?, notes = ?
      WHERE id = ?
    `).run(patient_id, therapist_id, session_date, session_number, status, notes, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/sessions/:id", (req, res) => {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Invoices
  app.get("/api/invoices", (req, res) => {
    const { company_id } = req.query;
    let filter = "WHERE 1=1";
    let params: any[] = [];
    if (company_id) {
      filter += " AND i.company_id = ?";
      params.push(company_id);
    }

    const invoices = db.prepare(`
      SELECT i.*, c.name as company_name
      FROM invoices i
      JOIN companies c ON i.company_id = c.id
      ${filter}
    `).all(...params);
    res.json(invoices);
  });

  app.post("/api/invoices/generate", (req, res) => {
    const { company_id, month, year } = req.body;
    
    // Calculate sessions for this company/month
    const sessions = db.prepare(`
      SELECT s.*, p.price_per_session
      FROM sessions s
      JOIN patients p ON s.patient_id = p.id
      WHERE p.company_id = ? 
      AND strftime('%m', s.session_date) = ? 
      AND strftime('%Y', s.session_date) = ?
      AND s.status = 'completed'
    `).all(company_id, month.toString().padStart(2, '0'), year.toString());

    const totalSessions = sessions.length;
    const totalAmount = sessions.reduce((sum, s) => sum + s.price_per_session, 0);

    const result = db.prepare(`
      INSERT INTO invoices (company_id, month, year, total_sessions, total_amount) 
      VALUES (?, ?, ?, ?, ?)
    `).run(company_id, month, year, totalSessions, totalAmount);

    res.json({ id: result.lastInsertRowid, totalSessions, totalAmount });
  });

  app.put("/api/invoices/:id", (req, res) => {
    const { company_id, month, year, total_sessions, total_amount, amount_paid, status } = req.body;
    db.prepare(`
      UPDATE invoices 
      SET company_id = ?, month = ?, year = ?, total_sessions = ?, total_amount = ?, amount_paid = ?, status = ?
      WHERE id = ?
    `).run(company_id, month, year, total_sessions, total_amount, amount_paid, status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/invoices/:id", (req, res) => {
    db.prepare("DELETE FROM invoices WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Payments
  app.post("/api/payments", (req, res) => {
    const { invoice_id, amount, payment_date, method, notes } = req.body;
    
    const insertPayment = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO payments (invoice_id, amount, payment_date, method, notes) 
        VALUES (?, ?, ?, ?, ?)
      `).run(invoice_id, amount, payment_date, method, notes);

      // Update invoice status
      const invoice = db.prepare("SELECT total_amount, amount_paid FROM invoices WHERE id = ?").get(invoice_id);
      const newPaid = invoice.amount_paid + amount;
      let status = 'partially_paid';
      if (newPaid >= invoice.total_amount) status = 'paid';
      
      db.prepare("UPDATE invoices SET amount_paid = ?, status = ? WHERE id = ?").run(newPaid, status, invoice_id);
      
      return result;
    });

    const result = insertPayment();
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/payments/history/:invoice_id", (req, res) => {
    const history = db.prepare("SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC").all(req.params.invoice_id);
    res.json(history);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
