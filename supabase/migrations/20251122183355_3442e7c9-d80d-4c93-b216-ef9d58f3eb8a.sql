-- Eliminar el constraint antiguo que tiene nombres de servicios incorrectos
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS valid_service;