-- Eliminar la columna created_at de la tabla bookings
ALTER TABLE public.bookings 
DROP COLUMN created_at;