-- Add type field (CP / Referrer) to client_partners

alter table public.client_partners
  add column if not exists type text not null default 'CP';

alter table public.client_partners
  drop constraint if exists client_partners_type_check;

alter table public.client_partners
  add constraint client_partners_type_check
  check (type in ('CP', 'Referrer'));

