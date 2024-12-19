-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create timers table
create table public.timers (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz not null default now(),
    end_time timestamptz not null,
    title text not null,
    is_completed boolean not null default false,
    user_id text not null,
    
    -- Add constraints
    constraint title_length check (char_length(title) >= 1 and char_length(title) <= 100),
    constraint end_time_future check (end_time > created_at)
);

-- Create indexes for better query performance
create index idx_timers_user_id on public.timers(user_id);
create index idx_timers_created_at on public.timers(created_at);
create index idx_timers_end_time on public.timers(end_time);
create index idx_timers_is_completed on public.timers(is_completed);

-- Enable Row Level Security
alter table public.timers enable row level security;

-- Create policies
create policy "Enable read access for all users"
    on public.timers for select
    using (true);

create policy "Enable insert access for all users"
    on public.timers for insert
    with check (true);

create policy "Enable update for users based on user_id"
    on public.timers for update
    using (auth.uid()::text = user_id)
    with check (auth.uid()::text = user_id);

create policy "Enable delete for users based on user_id"
    on public.timers for delete
    using (auth.uid()::text = user_id);

-- Create function to automatically update completed timers
create or replace function public.check_timer_completion()
returns trigger as $$
begin
    if new.end_time <= now() and not new.is_completed then
        new.is_completed := true;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for automatic completion
create trigger timer_completion_check
    before insert or update on public.timers
    for each row
    execute function public.check_timer_completion();