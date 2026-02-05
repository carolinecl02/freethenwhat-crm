-- Add niche and phone_number fields to client_partners

alter table public.client_partners
  add column if not exists niche text,
  add column if not exists phone_number text;

