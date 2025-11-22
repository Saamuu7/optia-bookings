// Panel administrativo (solo UI) para ver las reservas almacenadas en Supabase.
// No incluye autenticación; si vas a publicar este panel en producción, protege
// esta ruta con autenticación server-side o mediante funciones protegidas.
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, Scissors } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Booking {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
}

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  const groupBookingsByDate = () => {
    const grouped: { [key: string]: Booking[] } = {};
    bookings.forEach((booking) => {
      if (!grouped[booking.fecha]) {
        grouped[booking.fecha] = [];
      }
      grouped[booking.fecha].push(booking);
    });
    return grouped;
  };

  const groupedBookings = groupBookingsByDate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando agenda...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Agenda de Citas
              </h1>
              <p className="text-lg text-muted-foreground">
                Todas las reservas organizadas por fecha
              </p>
            </div>

            {Object.keys(groupedBookings).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No hay citas reservadas aún
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedBookings).map(([date, dayBookings]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold text-foreground">
                        {format(new Date(date + "T00:00:00"), "EEEE, d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </h2>
                    </div>

                    <div className="grid gap-4">
                      {dayBookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-primary">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">
                                {booking.nombre} {booking.apellidos}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-primary font-semibold">
                                <Clock className="h-5 w-5" />
                                {booking.hora}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Scissors className="h-4 w-4" />
                                <span>{booking.servicio}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <a
                                  href={`tel:${booking.telefono}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {booking.telefono}
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
