-- Client partner notes table: notes associated with client partners.
-- Users can see notes for client partners they can view (following admin pattern).

create table if not exists public.client_partner_notes (
  id uuid primary key default gen_random_uuid(),
  client_partner_id uuid not null references public.client_partners (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  note text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast queries by client_partner_id
create index if not exists client_partner_notes_client_partner_id_idx on public.client_partner_notes (client_partner_id);

-- Index for fast queries by user_id
create index if not exists client_partner_notes_user_id_idx on public.client_partner_notes (user_id);

-- Enable RLS
alter table public.client_partner_notes enable row level security;

-- Users can view notes for client partners they can view (own or admin sees all)
create policy "Users can view notes for visible client partners"
  on public.client_partner_notes for select
  using (
    exists (
      select 1 from public.client_partners cp
      where cp.id = client_partner_notes.client_partner_id
      and (cp.user_id = auth.uid() or public.is_admin())
    )
  );

-- Users can insert notes for client partners they can view
create policy "Users can insert notes for visible client partners"
  on public.client_partner_notes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.client_partners cp
      where cp.id = client_partner_notes.client_partner_id
      and (cp.user_id = auth.uid() or public.is_admin())
    )
  );

-- Users can update their own notes
create policy "Users can update own notes"
  on public.client_partner_notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own notes
create policy "Users can delete own notes"
  on public.client_partner_notes for delete
  using (auth.uid() = user_id);

-- Keep updated_at in sync using the shared helper
create trigger client_partner_notes_updated_at
  before update on public.client_partner_notes
  for each row execute procedure public.set_updated_at();
