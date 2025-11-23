// Panel administrativo (solo UI) para ver las reservas almacenadas en Supabase.
// No incluye autenticación; si vas a publicar este panel en producción, protege
// esta ruta con autenticación server-side o mediante funciones protegidas.
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Phone, Scissors, Eye, EyeOff } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICES } from "@/lib/services";

interface Booking {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
}

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER ?? 'admin';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS ?? 'Eryck_style1234';

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(startOfMonth(new Date()));
  const [bookingsByDate, setBookingsByDate] = useState<Record<string, Booking[]>>({});
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editFecha, setEditFecha] = useState('');
  const [editHora, setEditHora] = useState('');
  const [editServicio, setEditServicio] = useState('');

  const fetchBookingsForDate = async (date: Date) => {
    setLoading(true);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('fecha', formattedDate)
      .order('hora', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  const fetchBookingsForMonth = async (monthStart: Date) => {
    setLoading(true);
    const start = format(startOfMonth(monthStart), 'yyyy-MM-dd');
    const end = format(endOfMonth(monthStart), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('fecha', start)
      .lte('fecha', end)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (error) {
      console.error('Error fetching monthly bookings:', error);
      setBookingsByDate({});
      setLoading(false);
      return;
    }

    const grouped: Record<string, Booking[]> = {};
    (data || []).forEach((b: any) => {
      const key = b.fecha as string;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(b as Booking);
    });

    setBookingsByDate(grouped);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchBookingsForDate(selectedDate);
      fetchBookingsForMonth(viewMonth);
    }
  }, [selectedDate, authenticated, viewMonth]);

  // Realtime subscription: refresh bookings when table changes for the selected date or month
  useEffect(() => {
    if (!authenticated) return;
    const monthStart = format(startOfMonth(viewMonth), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(viewMonth), 'yyyy-MM-dd');

    const channel = supabase
      .channel('bookings-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
        try {
          const rec = payload.new as any;
          const oldRec = payload.old as any;
          const affectedDate = rec?.fecha ?? oldRec?.fecha;
          if (!affectedDate) return;
          if (affectedDate >= monthStart && affectedDate <= monthEnd) {
            // refetch month and selected date if affected
            fetchBookingsForMonth(viewMonth);
            if (affectedDate === format(selectedDate, 'yyyy-MM-dd')) {
              fetchBookingsForDate(selectedDate);
            }
          }
        } catch (err) {
          console.error('Realtime handler error', err);
        }
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
    };
  }, [authenticated, viewMonth, selectedDate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthenticated(true);
      fetchBookingsForDate(selectedDate);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUsername('');
    setPassword('');
    setBookings([]);
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) return;
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error('Error deleting booking:', error);
      alert('Error al eliminar la cita');
      return;
    }

    // Refresh bookings
    await fetchBookingsForDate(selectedDate);
    await fetchBookingsForMonth(viewMonth);
  };

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setEditFecha(booking.fecha);
    setEditHora(booking.hora);
    setEditServicio(booking.servicio);
  };

  const handleModify = async () => {
    if (!editingBooking) return;

    const { error } = await supabase
      .from('bookings')
      .update({
        fecha: editFecha,
        hora: editHora,
        servicio: editServicio,
      })
      .eq('id', editingBooking.id);

    if (error) {
      console.error('Error updating booking:', error);
      alert('Error al modificar la cita');
      return;
    }

    // Close dialog and refresh
    setEditingBooking(null);
    await fetchBookingsForDate(selectedDate);
    await fetchBookingsForMonth(viewMonth);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {authenticated ? (
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Agenda</h1>
              <p className="text-muted-foreground">Accede con tus credenciales para ver la agenda por día.</p>
            </div>
          ) : null}

          {!authenticated ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Agenda</h1>
                <p className="text-muted-foreground">Accede con tus credenciales para ver la agenda por día.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-full bg-primary/10 text-primary p-3">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Acceso de la Agenda</h3>
                    <p className="text-sm text-muted-foreground">Introduce tus credenciales para acceder.</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label className="text-sm">Usuario</Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="usuario"
                      autoComplete="off"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Contraseña</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="contraseña"
                        autoComplete="off"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-4">
                    <Button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-sm">Entrar</Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="sticky top-28">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setViewMonth(subMonths(viewMonth, 1))} className="px-2 py-1 rounded hover:bg-muted/30">‹</button>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{format(viewMonth, 'MMMM yyyy', { locale: es })}</div>
                    </div>
                    <button onClick={() => setViewMonth(addMonths(viewMonth, 1))} className="px-2 py-1 rounded hover:bg-muted/30">›</button>
                  </div>

                  <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                    {/* Weekday headers */}
                    {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d) => (
                      <div key={d} className="bg-card text-center text-xs py-2 font-medium">{d}</div>
                    ))}

                    {/* Days */}
                    {(() => {
                      const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
                      const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
                      const today = new Date();
                      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const days: JSX.Element[] = [];
                      for (let day = start; day <= end; day = addDays(day, 1)) {
                        const key = format(day, 'yyyy-MM-dd');
                        const dayBookings = bookingsByDate[key] || [];
                        const isPast = day.getTime() < startOfToday.getTime();
                        const isToday = isSameDay(day, today);
                        const isSelected = isSameDay(day, selectedDate);

                        days.push(
                          <div
                            key={key}
                            onClick={() => { if (!isPast) setSelectedDate(day); }}
                            className={`min-h-[90px] p-2 text-sm transition-all duration-200 ease-in-out ${isSameMonth(day, viewMonth) ? '' : 'opacity-50'} ${isPast ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-muted/20'} ${isSelected ? 'ring-2 ring-primary/40 bg-primary/5 rounded' : 'bg-background'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className={`${isSelected ? 'text-primary font-bold' : isToday ? 'text-red-600 font-bold' : isPast ? 'text-muted-foreground' : 'text-xs font-medium'}`}>{format(day, 'd')}</div>
                            </div>
                            <div className="mt-2 space-y-1">
                              {dayBookings.slice(0,3).map((b) => (
                                <div key={b.id} className="rounded px-1 py-0.5 bg-primary/10 text-primary text-xs truncate">
                                  <span className="font-semibold">{b.hora}</span> {b.servicio}
                                </div>
                              ))}
                              {dayBookings.length > 3 && (
                                <div className="text-xs text-muted-foreground">+{dayBookings.length - 3} más</div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return days;
                    })()}
                  </div>

                  <div className="mt-4">
                    <button onClick={handleLogout} className="w-full rounded-md py-2 bg-red-600 text-white hover:bg-red-700">Cerrar sesión</button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Reservas del día</h2>
                  <div className="text-sm text-muted-foreground">{format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}</div>
                </div>

                {loading ? (
                  <p className="text-muted-foreground">Cargando...</p>
                ) : bookings.length === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>No hay citas para este día</CardTitle>
                    </CardHeader>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => {
                      // compute if the booking is in the past (finished)
                      let finished = false;
                      try {
                        const [y, m, d] = (b.fecha || '').split('-').map((x: string) => parseInt(x, 10));
                        const [hh, mm] = (b.hora || '').split(':').map((x: string) => parseInt(x, 10));
                        if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(hh) && !isNaN(mm)) {
                          const bookingDate = new Date(y, m - 1, d, hh, mm, 0);
                          finished = bookingDate.getTime() < Date.now();
                        }
                      } catch (e) {
                        // ignore parse errors
                      }

                      return (
                        <Card key={b.id} className={`border-l-4 ${finished ? 'border-l-green-500' : 'border-l-primary'}`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-semibold">{b.nombre} {b.apellidos}</CardTitle>
                              <div className="text-primary font-semibold flex items-center gap-2"><Clock className="w-4 h-4" />{b.hora}</div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Servicio</div>
                                <div className="font-medium">{b.servicio}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Teléfono</div>
                                <a href={`tel:${b.telefono}`} className="font-medium hover:text-primary">{b.telefono}</a>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                              <Button
                                type="button"
                                onClick={() => openEditDialog(b)}
                                className="bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-500"
                                size="sm"
                              >
                                Modificar
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handleDelete(b.id)}
                                className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
                                size="sm"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modificar Cita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input value={`${editingBooking?.nombre} ${editingBooking?.apellidos}`} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={editFecha}
                onChange={(e) => setEditFecha(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Select value={editHora} onValueChange={setEditHora}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona hora" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select value={editServicio} onValueChange={setEditServicio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona servicio" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditingBooking(null)}>
                Cancelar
              </Button>
              <Button onClick={handleModify} className="bg-primary text-primary-foreground">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Admin;
