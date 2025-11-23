-- Allow anyone to delete bookings
CREATE POLICY "Anyone can delete bookings"
ON public.bookings
FOR DELETE
USING (true);