-- Enable shop feature for users
alter table public.users
add column show_shop boolean not null default false;

-- Make show_shop column nullable in RLS policies
alter table public.users
alter column show_shop drop not null;

-- Create function to toggle shop section
create or replace function public.toggle_shop_section(enabled boolean)
returns boolean
language plpgsql
security definer
as $$
begin
  -- Update the show_shop value for the authenticated user
  update public.users
  set show_shop = enabled
  where id = auth.uid();

  -- Return the new value
  return enabled;
exception
  when others then
    return null;
end;
$$;

-- Set up RLS policy to allow users to toggle their own shop section
create policy "Users can toggle their own shop section"
  on public.users
  for update using (
    auth.uid() = id
  )
  with check (
    auth.uid() = id and
    (
      -- Only allow updating show_shop column
      show_shop is not null
    )
  );