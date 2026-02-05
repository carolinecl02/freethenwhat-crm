-- Add 'signed CP' status to client_partners status options

alter table public.client_partners
  drop constraint if exists client_partners_status_check;

alter table public.client_partners
  add constraint client_partners_status_check
  check (status in (
    'Identified',
    'Reached out',
    'Meeting booked',
    'Meeting held - waiting',
    'Meeting held - interested',
    'Meeting held - no go',
    'signed CP'
  ));
