-- Add role to profiles so we can identify admin users.
-- Admins can see and manage ALL clients; regular users only their own.
--
-- To grant admin: update public.profiles set role = 'admin' where id = '<user-uuid>';

-- Add role column (default 'user'; use 'admin' for full access)
alter table public.profiles
  add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

-- Backfill existing profiles that might have been created before this column
update public.profiles set role = 'user' where role is null;

-- Helper: true if the current user is an admin (used in clients RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Drop existing clients policies so we can replace them with admin-aware ones
drop policy if exists "Users can view own clients" on public.clients;
drop policy if exists "Users can update own clients" on public.clients;
drop policy if exists "Users can delete own clients" on public.clients;
-- Keep "Users can insert own clients" for insert; admins still use their own user_id when creating.

-- Select: own clients OR admin sees all
create policy "Users can view own clients or admin views all"
  on public.clients for select
  using (auth.uid() = user_id or public.is_admin());

-- Update: own clients OR admin can update any
create policy "Users can update own clients or admin updates any"
  on public.clients for update
  using (auth.uid() = user_id or public.is_admin());

-- Delete: own clients OR admin can delete any
create policy "Users can delete own clients or admin deletes any"
  on public.clients for delete
  using (auth.uid() = user_id or public.is_admin());
