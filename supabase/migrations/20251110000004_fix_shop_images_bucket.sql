-- Drop existing policies
drop policy if exists "Authenticated users can upload shop images" on storage.objects;
drop policy if exists "Users can update their own shop images" on storage.objects;
drop policy if exists "Users can delete their own shop images" on storage.objects;
drop policy if exists "Anyone can view shop images" on storage.objects;
drop policy if exists "Users can upload their shop images" on storage.objects;
drop policy if exists "Users can update their shop images" on storage.objects;
drop policy if exists "Users can delete their shop images" on storage.objects;

-- Remove the bucket
delete from storage.buckets where id = 'shop_images';

-- Create the shop_images bucket with correct configuration
insert into storage.buckets (id, name, public)
values ('shop_images', 'shop_images', true);

-- Allow public to read shop images
create policy "Anyone can view shop images" on storage.objects
  for select using (bucket_id = 'shop_images');

-- Users can upload their own shop images (with size and type validation)
create policy "Users can upload their shop images" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'shop_images'
    and auth.uid()::text = (storage.foldername(name))[1]
    and length(name) < 255
    and (LOWER(SUBSTRING(name FROM '\.([^\.]*?)$')) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
  );

-- Users can update their own shop images
create policy "Users can update their shop images" on storage.objects
  for update using (
    bucket_id = 'shop_images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own shop images
create policy "Users can delete their shop images" on storage.objects
  for delete using (
    bucket_id = 'shop_images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );