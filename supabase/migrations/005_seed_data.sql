-- ============================================================
-- FS-2 — Migration: 005_seed_data.sql
-- Full production seed dataset for enterprise office procurement
-- ============================================================

-- ─── 1. Seed Vendors ─────────────────────────────────────────
INSERT INTO vendors (id, vendor_name, company_name, email_address, contact_number, business_address, status) VALUES
(1,  'Sarah Mitchell',    'Apex Logistics & Supply Ltd',    'sarah.mitchell@apexlogistics.com',   '+1-555-0101', '1200 Industrial Blvd, Suite 400, Chicago, IL 60601',         'Active'),
(2,  'James Thornton',   'ByteCode Systems LLC',          'james.thornton@bytecodesys.com',     '+1-555-0102', '89 Tech Park Ave, Floor 3, Austin, TX 78701',                'Active'),
(3,  'Priya Kapoor',     'Meridian Commercial Furnishings','priya.kapoor@meridianfurnishings.com','+1-555-0103', '340 Commerce Street, Unit 12, New York, NY 10013',           'Active'),
(4,  'David Okonkwo',    'SteelBridge Facility Services', 'david.okonkwo@steelbridgefs.com',    '+1-555-0104', '5500 Fabrication Way, Detroit, MI 48201',                    'Active'),
(5,  'Amelia Foster',    'CloudPeak Enterprise Networks', 'amelia.foster@cloudpeaknet.io',        '+1-555-0105', '200 Data Center Drive, Ashburn, VA 20147',                   'Active'),
(6,  'Carlos Rivera',    'Vantage Media & Printing',      'carlos.rivera@vantagemedia.com',     '+1-555-0106', '77 Press Lane, Los Angeles, CA 90015',                       'Active'),
(7,  'Natalie Wong',     'PrecisionTech Hardware Solutions','natalie.wong@precisiontechhw.com',   '+1-555-0107', '4100 Mill Road, Cincinnati, OH 45202',                       'Active'),
(8,  'Liam O''Brien',   'GreenRoute Couriers',           'liam.obrien@greenroutecouriers.com', '+1-555-0108', '900 Freight Terminal, Memphis, TN 38101',                    'Inactive'),
(9,  'Fatima Al-Hassan', 'Nexus Enterprise Consulting',   'fatima.alhassan@nexusconsult.com',   '+1-555-0109', '1 Financial Plaza, 22nd Floor, Boston, MA 02110',            'Active'),
(10, 'Mark Stevenson',   'Pioneer Industrial Hardware Corp','mark.stevenson@pioneerhwcorp.com',  '+1-555-0110', '6200 Hardware District, Phoenix, AZ 85001',                  'Active')
ON CONFLICT (id) DO UPDATE SET
  vendor_name = EXCLUDED.vendor_name,
  company_name = EXCLUDED.company_name,
  email_address = EXCLUDED.email_address,
  contact_number = EXCLUDED.contact_number,
  business_address = EXCLUDED.business_address,
  status = EXCLUDED.status;

-- Reset sequence for vendors
SELECT setval('vendors_id_seq', (SELECT MAX(id) FROM vendors));

-- ─── 2. Seed Quotations ──────────────────────────────────────
INSERT INTO quotations (id, vendor_id, quotation_title, description, vendor_reference, quotation_amount, submission_date, status) VALUES
-- Office Hardware Procurement (3 Vendor Comparison Scenario)
(1,  1,  'Office Hardware Procurement', 'Supply of 50 workstation setups including dual monitors, keyboards, ergonomic mice and thunderbolt docking stations for the downtown expansion.', 'REF-QUOTE-2024-0001', 48500.00,  '2024-01-15', 'Approved'),
(2,  2,  'Office Hardware Procurement', 'Provision of 50 high-performance workstation bundles with extended 3-year warranty coverage and on-site deployment support.', 'REF-QUOTE-2024-0002', 52250.00,  '2024-01-16', 'Rejected'),
(3,  10, 'Office Hardware Procurement', 'Competitive supply of 50 enterprise workstations with priority delivery within 5 business days and on-site hardware maintenance.', 'REF-QUOTE-2024-0003', 44750.00,  '2024-01-17', 'Approved'),

-- Executive Boardroom AV Upgrade
(4,  3,  'Executive Boardroom AV Upgrade', 'Installation of 4K ultra-HD video conferencing arrays, ceiling beamforming microphones, and acoustic wall panelling for HQ boardroom.', 'REF-QUOTE-2024-0004', 34800.00,  '2024-02-01', 'Approved'),
(5,  7,  'Executive Boardroom AV Upgrade', 'Turnkey AV package featuring interactive 85-inch touch displays, wireless screen sharing systems, and automated lighting controls.', 'REF-QUOTE-2024-0005', 38500.00,  '2024-02-03', 'Pending'),

-- HQ Ergonomic Furniture Refresh
(6,  3,  'HQ Ergonomic Furniture Refresh', 'Supply and assembly of 120 electric height-adjustable standing desks and certified lumbar-support mesh task chairs.', 'REF-QUOTE-2024-0006', 62000.00,  '2024-02-10', 'Approved'),
(7,  6,  'HQ Ergonomic Furniture Refresh', 'Custom timber executive desks, ergonomic seating, and modular acoustic quiet pods for open-plan workspace areas.', 'REF-QUOTE-2024-0007', 68400.00,  '2024-02-12', 'Pending'),

-- Cloud Workstation Server Infrastructure
(8,  5,  'Cloud Workstation Server Infrastructure', 'Deployment of primary rack servers with NVMe storage arrays, redundancy power units, and high-speed fiber interconnects.', 'REF-QUOTE-2024-0008', 128500.00, '2024-03-01', 'Approved'),
(9,  2,  'Cloud Workstation Server Infrastructure', 'Hybrid infrastructure setup featuring failover clusters, SAN storage integration, and 24/7 network monitoring.', 'REF-QUOTE-2024-0009', 142000.00, '2024-03-04', 'Pending'),

-- Enterprise ERP System Integration
(10, 9,  'Enterprise ERP System Integration', 'End-to-end integration between SAP S/4HANA and e-commerce portals including custom API middleware and compliance auditing.', 'REF-QUOTE-2024-0010', 195000.00, '2024-03-15', 'Approved'),
(11, 2,  'Enterprise ERP System Integration', 'Consulting and implementation of enterprise ERP workflows with dedicated dev support and staff training workshops.', 'REF-QUOTE-2024-0011', 215000.00, '2024-03-18', 'Pending'),

-- Annual Stationery & Breakroom Supplies
(12, 1,  'Annual Stationery & Breakroom Supplies', 'Consolidated annual supply contract for FSC-certified paper goods, printer consumables, and breakroom refreshments.', 'REF-QUOTE-2024-0012', 16800.00,  '2024-04-01', 'Pending'),
(13, 6,  'Annual Stationery & Breakroom Supplies', 'Premium eco-friendly office stationery package including custom branded notebooks and monthly recurring delivery.', 'REF-QUOTE-2024-0013', 19200.00,  '2024-04-05', 'Approved'),

-- Facility Security System Upgrade
(14, 4,  'Facility Security System Upgrade', 'Comprehensive physical security installation: 48 IP cameras, biometric access control gates, and monitoring console setup.', 'REF-QUOTE-2024-0014', 87500.00,  '2024-04-12', 'Pending')
ON CONFLICT (id) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id,
  quotation_title = EXCLUDED.quotation_title,
  description = EXCLUDED.description,
  vendor_reference = EXCLUDED.vendor_reference,
  quotation_amount = EXCLUDED.quotation_amount,
  submission_date = EXCLUDED.submission_date,
  status = EXCLUDED.status;

-- Reset sequence for quotations
SELECT setval('quotations_id_seq', (SELECT MAX(id) FROM quotations));
