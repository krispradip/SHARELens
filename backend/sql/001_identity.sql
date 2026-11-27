-- SHARE Service360 identity and Ambassador management schema.
-- Apply with a dedicated migration user. Runtime account needs DML permissions only.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS s360_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  login text NOT NULL UNIQUE,
  password_hash text,
  role text NOT NULL CHECK(role IN ('admin','service','manager','ambassador')),
  status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  display_name text NOT NULL,
  identity_provider text NOT NULL DEFAULT 'local' CHECK(identity_provider IN ('local','entra')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS s360_ambassadors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES s360_users(id),
  share_ambassador_id text NOT NULL UNIQUE,
  external_staff_id text,
  employer text NOT NULL,
  business_unit text NOT NULL,
  brand text NOT NULL,
  store text NOT NULL,
  country text NOT NULL,
  manager_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_s360_ambassadors_store ON s360_ambassadors(country,business_unit,brand,store);
CREATE TABLE IF NOT EXISTS s360_user_scopes (
  user_id uuid NOT NULL REFERENCES s360_users(id) ON DELETE CASCADE,
  country text NOT NULL DEFAULT '*',
  business_unit text NOT NULL DEFAULT '*',
  brand text NOT NULL DEFAULT '*',
  store text NOT NULL DEFAULT '*',
  PRIMARY KEY (user_id,country,business_unit,brand,store)
);
CREATE TABLE IF NOT EXISTS s360_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES s360_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_s360_sessions_expiry ON s360_sessions(expires_at);
CREATE TABLE IF NOT EXISTS s360_audit (
  id bigserial PRIMARY KEY,
  actor_user_id uuid REFERENCES s360_users(id),
  action text NOT NULL,
  subject_user_id uuid REFERENCES s360_users(id),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
