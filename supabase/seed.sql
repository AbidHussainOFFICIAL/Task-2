-- ============================================================
-- FS-2 Seed Data — Development & Demo
-- ============================================================

-- ─── Vendors ────────────────────────────────────────────────
INSERT INTO vendors (vendor_name, company_name, email_address, contact_number, business_address, status) VALUES
('Sarah Mitchell',    'Apex Logistics Ltd',        'sarah.mitchell@apexlogistics.com',   '+1-555-0101', '1200 Industrial Blvd, Suite 400, Chicago, IL 60601',         'Active'),
('James Thornton',   'ByteCode Solutions LLC',     'james.thornton@bytecodesol.com',     '+1-555-0102', '89 Tech Park Ave, Floor 3, Austin, TX 78701',                'Active'),
('Priya Kapoor',     'Meridian Supply Co.',        'priya.kapoor@meridiansupply.com',    '+1-555-0103', '340 Commerce Street, Unit 12, New York, NY 10013',           'Active'),
('David Okonkwo',    'SteelBridge Engineering',   'david.okonkwo@steelbridge.com',      '+1-555-0104', '5500 Fabrication Way, Detroit, MI 48201',                    'Active'),
('Amelia Foster',    'CloudPeak Infrastructure',  'amelia.foster@cloudpeak.io',         '+1-555-0105', '200 Data Center Drive, Ashburn, VA 20147',                   'Active'),
('Carlos Rivera',    'Vantage Print & Media',     'carlos.rivera@vantageprint.com',     '+1-555-0106', '77 Press Lane, Los Angeles, CA 90015',                       'Active'),
('Natalie Wong',     'PrecisionEdge Manufacturing','natalie.wong@precisionedge.com',    '+1-555-0107', '4100 Mill Road, Cincinnati, OH 45202',                       'Active'),
('Liam O''Brien',   'GreenRoute Transport',       'liam.obrien@greenroute.com',         '+1-555-0108', '900 Freight Terminal, Memphis, TN 38101',                    'Inactive'),
('Fatima Al-Hassan', 'Nexus Consulting Group',    'fatima.alhassan@nexusconsult.com',   '+1-555-0109', '1 Financial Plaza, 22nd Floor, Boston, MA 02110',            'Active'),
('Mark Stevenson',   'Pioneer Hardware Corp.',    'mark.stevenson@pioneerhardware.com', '+1-555-0110', '6200 Hardware District, Phoenix, AZ 85001',                  'Active');

-- ─── Quotations ─────────────────────────────────────────────
INSERT INTO quotations (vendor_id, quotation_title, description, vendor_reference, quotation_amount, submission_date, status) VALUES
-- Office Hardware Procurement
(1,  'Office Hardware Procurement', 'Supply of 50 workstation setups including monitors, keyboards, mice and docking stations for the new downtown office expansion.', 'REF-QUOTE-2024-0001', 48500.00,  '2024-01-15', 'Approved'),
(2,  'Office Hardware Procurement', 'Provision of 50 complete workstation bundles with extended warranty coverage and on-site installation support.', 'REF-QUOTE-2024-0002', 52000.00,  '2024-01-16', 'Rejected'),
(10, 'Office Hardware Procurement', 'Competitive supply of 50 workstations with priority delivery within 5 business days and 3-year hardware guarantee.', 'REF-QUOTE-2024-0003', 44750.00,  '2024-01-17', 'Approved'),

-- Cloud Infrastructure Migration
(5,  'Cloud Infrastructure Migration', 'Full migration of on-premise servers to AWS environment including architecture design, data transfer, and 90-day post-migration support.', 'REF-QUOTE-2024-0004', 125000.00, '2024-02-01', 'Approved'),
(2,  'Cloud Infrastructure Migration', 'Azure-based cloud migration package with zero-downtime deployment strategy and 6 months managed services.', 'REF-QUOTE-2024-0005', 139000.00, '2024-02-03', 'Pending'),
(9,  'Cloud Infrastructure Migration', 'Hybrid cloud migration consulting and implementation with dedicated project manager and weekly reporting.', 'REF-QUOTE-2024-0006', 118500.00, '2024-02-05', 'Rejected'),

-- Annual Office Supplies
(3,  'Annual Office Supplies Contract', 'Yearly contract for stationery, paper, printer consumables and breakroom supplies with weekly delivery schedule.', 'REF-QUOTE-2024-0007', 18200.00,  '2024-02-10', 'Approved'),
(6,  'Annual Office Supplies Contract', 'Premium office supplies package including branded stationery and eco-certified products with monthly invoicing.', 'REF-QUOTE-2024-0008', 21500.00,  '2024-02-11', 'Pending'),
(1,  'Annual Office Supplies Contract', 'Cost-effective annual supplies bundle with consolidated billing and dedicated account manager.', 'REF-QUOTE-2024-0009', 16800.00,  '2024-02-12', 'Pending'),

-- Warehouse Shelving Installation
(4,  'Warehouse Shelving Installation', 'Design and installation of heavy-duty industrial shelving system for 15,000 sq ft warehouse including safety compliance certification.', 'REF-QUOTE-2024-0010', 67000.00,  '2024-03-01', 'Approved'),
(7,  'Warehouse Shelving Installation', 'Modular shelving solution with seismic bracing and load capacity of 2,000 lbs per shelf unit, installation within 2 weeks.', 'REF-QUOTE-2024-0011', 71500.00,  '2024-03-03', 'Rejected'),

-- Marketing Campaign Print
(6,  'Q2 Marketing Campaign Print', 'Full-colour printing of 10,000 brochures, 500 banners and 2,000 posters for Q2 product launch campaign.', 'REF-QUOTE-2024-0012', 14200.00,  '2024-03-15', 'Approved'),
(3,  'Q2 Marketing Campaign Print', 'Print and digital asset package including brochures, social media templates and billboard designs.', 'REF-QUOTE-2024-0013', 17800.00,  '2024-03-16', 'Pending'),

-- Security System Upgrade
(5,  'Security System Upgrade',  'Installation of IP camera network (48 units), access control system and 24/7 monitoring service for all three office locations.', 'REF-QUOTE-2024-0014', 89000.00,  '2024-04-01', 'Pending'),
(9,  'Security System Upgrade',  'Biometric access control and AI-powered surveillance system with cloud recording and mobile alerts.', 'REF-QUOTE-2024-0015', 95500.00,  '2024-04-02', 'Pending'),
(4,  'Security System Upgrade',  'Physical security upgrade including reinforced door hardware, CCTV, and on-site security assessment report.', 'REF-QUOTE-2024-0016', 76000.00,  '2024-04-03', 'Pending'),

-- Fleet Logistics
(8,  'Fleet Logistics Contract Q3',   'Dedicated fleet of 5 vehicles for Q3 inter-office and supplier delivery runs with GPS tracking and fuel management.', 'REF-QUOTE-2024-0017', 38000.00,  '2024-04-10', 'Rejected'),
(1,  'Fleet Logistics Contract Q3',   'Outsourced logistics package covering all inbound and outbound freight with real-time tracking portal access.', 'REF-QUOTE-2024-0018', 34500.00,  '2024-04-11', 'Pending'),

-- ERP System Integration
(2,  'ERP System Integration', 'Custom integration between existing SAP instance and new e-commerce platform including API development and UAT support.', 'REF-QUOTE-2024-0019', 215000.00, '2024-05-01', 'Approved'),
(9,  'ERP System Integration', 'End-to-end ERP integration project with dedicated dev team, 6-week timeline and full documentation handover.', 'REF-QUOTE-2024-0020', 198000.00, '2024-05-02', 'Pending'),

-- Staff Training Programme
(9,  'Staff Training Programme 2024',  'Leadership development and technical skills training for 200 employees across 8 departments over a 6-month period.', 'REF-QUOTE-2024-0021', 42000.00,  '2024-05-15', 'Approved'),
(3,  'Staff Training Programme 2024',  'Blended learning programme with online modules and in-person workshops, includes LMS platform access for 12 months.', 'REF-QUOTE-2024-0022', 37500.00,  '2024-05-16', 'Pending'),

-- Data Centre Cooling
(4,  'Data Centre Cooling Upgrade', 'Installation of precision cooling units (CRAC) for primary data centre with N+1 redundancy and energy efficiency optimisation.', 'REF-QUOTE-2024-0023', 155000.00, '2024-06-01', 'Pending'),
(5,  'Data Centre Cooling Upgrade', 'Liquid cooling system retrofit for high-density server racks with automated temperature monitoring and alerting.', 'REF-QUOTE-2024-0024', 168000.00, '2024-06-02', 'Pending'),

-- Cafeteria Renovation
(7,  'Cafeteria Renovation Project', 'Full renovation of ground-floor cafeteria including new kitchen equipment, seating for 120, and ADA-compliant counters.', 'REF-QUOTE-2024-0025', 93000.00,  '2024-06-10', 'Pending');
