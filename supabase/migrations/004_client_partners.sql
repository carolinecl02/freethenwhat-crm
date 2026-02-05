-- Client partners table: same shape as clients, owned by the user who created them (user_id).
-- RLS ensures each user only sees and edits their own client partners.

create table if not exists public.client_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  last_contact_date date,
  status text not null default 'lead' check (status in ('lead', 'client', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast "my client partners" queries
create index if not exists client_partners_user_id_idx on public.client_partners (user_id);

-- Enable RLS
alter table public.client_partners enable row level security;

-- Users can only see their own client partners
create policy "Users can view own client partners"
  on public.client_partners for select
  using (auth.uid() = user_id);

-- Users can only insert client partners for themselves
create policy "Users can insert own client partners"
  on public.client_partners for insert
  with check (auth.uid() = user_id);

-- Users can only update their own client partners
create policy "Users can update own client partners"
  on public.client_partners for update
  using (auth.uid() = user_id);

-- Users can only delete their own client partners
create policy "Users can delete own client partners"
  on public.client_partners for delete
  using (auth.uid() = user_id);

-- Keep updated_at in sync using the shared helper
create trigger client_partners_updated_at
  before update on public.client_partners
  for each row execute procedure public.set_updated_at();

