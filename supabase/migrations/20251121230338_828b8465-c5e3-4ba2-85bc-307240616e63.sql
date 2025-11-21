-- Add service column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN servicio text NOT NULL DEFAULT 'Corte de pelo';

-- Add check constraint to ensure valid services
ALTER TABLE public.bookings
ADD CONSTRAINT valid_service CHECK (
  servicio IN (
    'Corte de pelo',
    'Coloración',
    'Tratamiento capilar',
    'Peinado',
    'Barba y afeitado',
    'Manicura y pedicura'
  )
);