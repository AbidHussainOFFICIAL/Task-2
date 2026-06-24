-- ============================================================
-- FS-2 — Row Level Security Policies
-- Migration: 003_rls.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE vendors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log  ENABLE ROW LEVEL SECURITY;

-- ─── Authenticated users: full access ───────────────────────
-- (Procurement managers with valid session)

CREATE POLICY "authenticated_full_access_vendors"
    ON vendors FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "authenticated_full_access_quotations"
    ON quotations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "authenticated_read_activity_log"
    ON activity_log FOR SELECT
    TO authenticated
    USING (true);

-- ─── Service role: bypass RLS (for server-side API routes) ──
-- Service role key bypasses RLS automatically in Supabase.
-- No explicit policy needed.

-- ─── Anon: no access (deny by default) ──────────────────────
-- No policies for anon role = no access (RLS default deny)
