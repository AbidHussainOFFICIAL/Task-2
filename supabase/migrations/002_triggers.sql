-- ============================================================
-- FS-2 — Triggers: auto-update timestamps + activity log
-- Migration: 002_triggers.sql
-- ============================================================

-- ─── Auto-update updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Vendor activity logging ────────────────────────────────
CREATE OR REPLACE FUNCTION log_vendor_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_log (event, message, entity_id, metadata)
        VALUES (
            'vendor_created',
            'New vendor "' || NEW.vendor_name || '" from ' || NEW.company_name || ' was onboarded',
            NEW.id,
            jsonb_build_object(
                'vendor_name', NEW.vendor_name,
                'company_name', NEW.company_name,
                'status', NEW.status
            )
        );
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            INSERT INTO activity_log (event, message, entity_id, metadata)
            VALUES (
                'vendor_updated',
                'Vendor "' || NEW.vendor_name || '" status changed to ' || NEW.status,
                NEW.id,
                jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
            );
        ELSE
            INSERT INTO activity_log (event, message, entity_id, metadata)
            VALUES (
                'vendor_updated',
                'Vendor "' || NEW.vendor_name || '" profile was updated',
                NEW.id,
                jsonb_build_object('company_name', NEW.company_name)
            );
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO activity_log (event, message, entity_id, metadata)
        VALUES (
            'vendor_deleted',
            'Vendor "' || OLD.vendor_name || '" was removed from the system',
            OLD.id,
            jsonb_build_object('vendor_name', OLD.vendor_name, 'company_name', OLD.company_name)
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendor_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON vendors
    FOR EACH ROW EXECUTE FUNCTION log_vendor_activity();

-- ─── Quotation activity logging ─────────────────────────────
CREATE OR REPLACE FUNCTION log_quotation_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_vendor_name TEXT;
BEGIN
    SELECT vendor_name INTO v_vendor_name FROM vendors WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);

    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_log (event, message, entity_id, metadata)
        VALUES (
            'quote_created',
            v_vendor_name || ' submitted a quotation of $' ||
            TO_CHAR(NEW.quotation_amount, 'FM999,999,999.00') ||
            ' for "' || NEW.quotation_title || '"',
            NEW.id,
            jsonb_build_object(
                'title', NEW.quotation_title,
                'amount', NEW.quotation_amount,
                'reference', NEW.vendor_reference,
                'vendor_id', NEW.vendor_id
            )
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO activity_log (event, message, entity_id, metadata)
        VALUES (
            CASE NEW.status
                WHEN 'Approved' THEN 'quote_approved'
                WHEN 'Rejected' THEN 'quote_rejected'
                ELSE 'quote_updated'
            END,
            'Quotation "' || NEW.quotation_title || '" by ' || v_vendor_name ||
            ' was ' || LOWER(NEW.status),
            NEW.id,
            jsonb_build_object(
                'title', NEW.quotation_title,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'amount', NEW.quotation_amount
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotation_activity_log
    AFTER INSERT OR UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION log_quotation_activity();
