// Página de reserva de citas.
// - Usa Supabase cliente (ver `src/integrations/supabase/client.ts`) para leer/escribir reservas.
// - Variables necesarias (cliente) en `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
// - No expongas claves privadas en `VITE_`.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Clock, Calendar as CalendarIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WORKING_HOURS = {
  weekday: { start: 10, end: 20 },
  saturday: { start: 10, end: 15 },
};

const Booking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    servicio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const isSaturday = dayOfWeek === 6;
    const hours = isSaturday ? WORKING_HOURS.saturday : WORKING_HOURS.weekday;

    const slots: string[] = [];
    for (let hour = hours.start; hour < hours.end; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < hours.end - 1 || !isSaturday) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      fetchBookedTimes(selectedDate);
    }
  }, [selectedDate]);

  // Realtime subscription to update available times when bookings change
  useEffect(() => {
    if (!selectedDate) return;

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          // Refetch booked times when any booking changes
          fetchBookedTimes(selectedDate);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const fetchBookedTimes = async (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const { data, error } = await supabase
      .from("bookings")
      .select("hora")
      .eq("fecha", formattedDate);

    if (error) {
      console.error("Error fetching bookings:", error);
      return;
    }

    const booked = data.map((booking) => booking.hora);
    setBookedTimes(booked);
    const allSlots = generateTimeSlots(date);
    setAvailableTimes(allSlots.filter((slot) => !booked.includes(slot)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error("Por favor selecciona una fecha y hora");
      return;
    }

    if (!formData.nombre || !formData.apellidos || !formData.telefono || !formData.servicio) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("bookings").insert([
      {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        servicio: formData.servicio,
        fecha: format(selectedDate, "yyyy-MM-dd"),
        hora: selectedTime,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("Esta hora ya ha sido reservada. Por favor elige otra.");
        fetchBookedTimes(selectedDate);
      } else {
        toast.error("Error al reservar la cita. Por favor intenta nuevamente.");
      }
      return;
    }

    toast.success("¡Cita reservada exitosamente!");
    setTimeout(() => navigate("/"), 2000);
  };

  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    return day === 0 || date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Reservar Cita
              </h1>
              <p className="text-lg text-muted-foreground">
                Selecciona el día y hora que mejor te convenga
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Selecciona una fecha
                  </CardTitle>
                  <CardDescription>
                    Cerrado los domingos. Sábados hasta las 15:00
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    locale={es}
                    className="rounded-md border pointer-events-auto"
                  />
                </CardContent>
              </Card>

              {/* Time Selection & Form */}
              <div className="space-y-6">
                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Horas disponibles
                      </CardTitle>
                      <CardDescription>
                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className="w-full"
                          >
                            {time}
                          </Button>
                        ))}
                        {availableTimes.length === 0 && (
                          <p className="col-span-3 text-center text-muted-foreground py-4">
                            No hay horas disponibles para este día
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedDate && selectedTime && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tus datos</CardTitle>
                      <CardDescription>
                        Completa tus datos para confirmar la reserva
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="servicio">Servicio</Label>
                          <Select
                            value={formData.servicio}
                            onValueChange={(value) =>
                              setFormData({ ...formData, servicio: value })
                            }
                            required
                          >
                            <SelectTrigger id="servicio">
                              <SelectValue placeholder="Selecciona un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Corte de pelo">Corte de pelo</SelectItem>
                              <SelectItem value="Coloración">Coloración</SelectItem>
                              <SelectItem value="Tratamiento capilar">Tratamiento capilar</SelectItem>
                              <SelectItem value="Peinado">Peinado</SelectItem>
                              <SelectItem value="Barba y afeitado">Barba y afeitado</SelectItem>
                              <SelectItem value="Manicura y pedicura">Manicura y pedicura</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData({ ...formData, nombre: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="apellidos">Apellidos</Label>
                          <Input
                            id="apellidos"
                            value={formData.apellidos}
                            onChange={(e) =>
                              setFormData({ ...formData, apellidos: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) =>
                              setFormData({ ...formData, telefono: e.target.value })
                            }
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {!selectedDate && (
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        Selecciona una fecha para ver las horas disponibles
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
