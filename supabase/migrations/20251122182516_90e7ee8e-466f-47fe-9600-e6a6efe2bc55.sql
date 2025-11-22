-- Primero eliminamos el constraint existente
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_servicio_check;

-- Agregamos el nuevo constraint con los nombres completos de los servicios
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_servicio_check 
CHECK (servicio IN (
  'Corte de pelo',
  'Coloración',
  'Peinados y Recogidos',
  'Tratamientos Capilares',
  'Barba y Afeitado',
  'Alisados y Permanentes'
));