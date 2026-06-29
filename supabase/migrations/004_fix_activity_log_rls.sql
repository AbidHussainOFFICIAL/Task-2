-- ============================================================
-- FS-2 — Fix: activity_log INSERT policy for triggers
-- Migration: 004_fix_activity_log_rls.sql
-- ============================================================
-- The triggers in 002_triggers.sql run in the security context
-- of the authenticated user who performs the action. Because
-- the trigger function uses INSERT into activity_log directly,
-- the calling user needs an INSERT privilege via RLS.
-- Without it, every vendor/quotation mutation raises:
--   "new row violates row-level security policy for table activity_log"
--
-- Solution: grant authenticated users INSERT on activity_log.
-- They should never be able to SELECT another user's writes
-- or UPDATE/DELETE log entries, so those remain restricted.

CREATE POLICY "authenticated_insert_activity_log"
    ON activity_log FOR INSERT
    TO authenticated
    WITH CHECK (true);
