-- Clients table: owned by the user who created them (user_id).
-- RLS ensures each user only sees and edits their own clients.

create table if not exists public.clients (
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

-- Index for fast "my clients" queries
create index if not exists clients_user_id_idx on public.clients (user_id);

-- Enable RLS
alter table public.clients enable row level security;

-- Users can only see their own clients
create policy "Users can view own clients"
  on public.clients for select
  using (auth.uid() = user_id);

-- Users can only insert clients for themselves
create policy "Users can insert own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

-- Users can only update their own clients
create policy "Users can update own clients"
  on public.clients for update
  using (auth.uid() = user_id);

-- Users can only delete their own clients
create policy "Users can delete own clients"
  on public.clients for delete
  using (auth.uid() = user_id);

-- Optional: keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_updated_at
  before update on public.clients
  for each row execute procedure public.set_updated_at();
