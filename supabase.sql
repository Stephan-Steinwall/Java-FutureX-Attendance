-- Attendance table
create table if not exists public.attendance (
	id uuid primary key default gen_random_uuid(),
	created_at timestamp with time zone not null default now(),
	fname text not null,
	lname text not null,
	nic text not null unique,
	email text not null,
	batch text not null,
	meta jsonb
);

-- Allow anonymous inserts for registration
alter table public.attendance enable row level security;

-- Policy: anyone can insert (public registration)
create policy if not exists "allow-anon-insert-attendance" on public.attendance
	for insert to anon with check (true);

-- Policy: authenticated users (admins) can read everything
create policy if not exists "allow-authenticated-select" on public.attendance
	for select to authenticated using (true);

-- Enable realtime
alter publication supabase_realtime add table public.attendance;


