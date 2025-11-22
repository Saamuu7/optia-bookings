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
import { SERVICES } from "@/lib/services";
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
    nombreCompleto: "",
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

    // Validate using the unified nombreCompleto field
    if (!formData.nombreCompleto || !formData.telefono || !formData.servicio) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    // Split full name into first name and last name(s)
    const parts = formData.nombreCompleto.trim().split(/\s+/);
    const nombre = parts.shift() || "";
    const apellidos = parts.join(" ");

    const { error } = await supabase.from("bookings").insert([
      {
        nombre,
        apellidos,
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
    setTimeout(() => navigate("/"), 1500);
  };

  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    return day === 0 || date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 hover-scale group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Button>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Reservar Cita
              </h1>
              <p className="text-lg text-muted-foreground">
                Selecciona el día y hora que mejor te convenga
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar */}
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CalendarIcon className="h-5 w-5" />
                    Selecciona una fecha
                  </CardTitle>
                  <CardDescription>
                    Cerrado los domingos. Sábados hasta las 15:00
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    locale={es}
                    className="rounded-md border pointer-events-auto"
                    classNames={{
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground transition-colors",
                      day_today: "bg-primary/20 text-primary font-bold",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    }}
                  />
                </CardContent>
              </Card>

              {/* Time Selection & Form */}
              <div className="space-y-6">
                {selectedDate && (
                  <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
                    <CardHeader className="bg-gradient-to-br from-accent/5 to-transparent">
                      <CardTitle className="flex items-center gap-2 text-accent">
                        <Clock className="h-5 w-5" />
                        Horas disponibles
                      </CardTitle>
                      <CardDescription className="font-medium">
                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {availableTimes.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <Button
                              key={time}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className={`w-full transition-all duration-200 hover-scale ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md' 
                                  : 'hover:bg-primary/10 hover:border-primary'
                              }`}
                            >
                              {time}
                            </Button>
                          );
                        })}
                        {availableTimes.length === 0 && (
                          <p className="col-span-3 text-center text-muted-foreground py-8">
                            No hay horas disponibles para este día
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedDate && selectedTime && (
                  <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
                    <CardHeader className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
                      <CardTitle className="text-primary">Tus datos</CardTitle>
                      <CardDescription>
                        Completa tus datos para confirmar la reserva
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Summary: selected date/time */}
                        <div className="animate-fade-in">
                          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                                  <p className="font-semibold text-foreground">{format(selectedDate!, "EEEE, d 'de' MMMM", { locale: es })}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground mb-1">Hora</p>
                                  <p className="font-semibold text-primary text-lg">{selectedTime}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Service selector and summary */}
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
                                {SERVICES.map((s) => (
                                  <SelectItem key={s.id} value={s.title}>
                                    {s.title}{s.price ? ` — ${s.price}` : ""}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          {/* If a service is selected, show a compact summary */}
                          {formData.servicio && (
                            (() => {
                              const svc = SERVICES.find((x) => x.title === formData.servicio);
                              if (!svc) return null;
                              return (
                                <div className="mt-3 p-4 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 animate-fade-in">
                                  <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                      <p className="font-semibold text-primary">{svc.title}</p>
                                      {svc.description && <p className="text-sm text-muted-foreground mt-1">{svc.description}</p>}
                                    </div>
                                    <div className="text-right">
                                      {svc.duration && <p className="text-sm text-muted-foreground">{svc.duration}</p>}
                                      {svc.price && <p className="font-semibold text-accent text-lg">{svc.price}</p>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </div>

                        <div>
                          <Label htmlFor="nombreCompleto">Nombre completo</Label>
                          <Input
                            id="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={(e) =>
                              setFormData({ ...formData, nombreCompleto: e.target.value })
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
                          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover-scale font-semibold text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {!selectedDate && (
                  <Card className="border-dashed border-primary/30 animate-fade-in">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground py-8">
                        👈 Selecciona una fecha para ver las horas disponibles
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
