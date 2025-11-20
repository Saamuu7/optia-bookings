-- Create bookings table for appointments
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  telefono TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(fecha, hora)
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert bookings (clients can book)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for public to read bookings (to check availability)
CREATE POLICY "Anyone can view bookings"
  ON public.bookings
  FOR SELECT
  TO public
  USING (true);

-- Create index for faster queries on date
CREATE INDEX idx_bookings_fecha ON public.bookings(fecha);

-- Create index for faster queries on date and time
CREATE INDEX idx_bookings_fecha_hora ON public.bookings(fecha, hora);