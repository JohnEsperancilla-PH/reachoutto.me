-- Add show_shop toggle to users table
alter table public.users 
add column if not exists show_shop boolean default false;

-- Create shop_items table
create table if not exists public.shop_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    title text not null,
    description text,
    price decimal(10,2),
    currency text default 'USD',
    image_url text,
    product_url text,
    position integer not null,
    created_at timestamptz default timezone('utc', now()),
    constraint positive_price check (price > 0)
);

-- Enable RLS
alter table public.shop_items enable row level security;

-- Create indexes
create index if not exists shop_items_user_id_idx on public.shop_items(user_id);
create index if not exists shop_items_position_idx on public.shop_items(position);

-- RLS policies
create policy "Users can view their own shop items"
    on public.shop_items
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own shop items"
    on public.shop_items
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own shop items"
    on public.shop_items
    for update
    using (auth.uid() = user_id);

create policy "Users can delete their own shop items"
    on public.shop_items
    for delete
    using (auth.uid() = user_id);

-- Allow public to view all shop items
create policy "Public can view all shop items"
    on public.shop_items
    for select
    using (true);