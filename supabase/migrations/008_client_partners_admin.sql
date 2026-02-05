-- Admins can see and manage ALL client partners (same as clients).
-- Uses existing public.is_admin() from migration 003.

drop policy if exists "Users can view own client partners" on public.client_partners;
drop policy if exists "Users can update own client partners" on public.client_partners;
drop policy if exists "Users can delete own client partners" on public.client_partners;

create policy "Users can view own client partners or admin views all"
  on public.client_partners for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can update own client partners or admin updates any"
  on public.client_partners for update
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can delete own client partners or admin deletes any"
  on public.client_partners for delete
  using (auth.uid() = user_id or public.is_admin());
