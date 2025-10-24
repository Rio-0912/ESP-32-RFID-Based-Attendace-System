"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      window.location.href = "/login";
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/calendar?uid=${uid}`);
        
        // Transform events for react-big-calendar
        const calendarEvents = res.data.events.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(`${event.date}T${event.startTime}`),
          end: new Date(`${event.date}T${event.endTime}`),
          status: event.status,
          cid: event.cid,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3b82f6"; // Blue for upcoming
    let borderColor = "#2563eb";

    if (event.status === "attended") {
      backgroundColor = "#10b981"; // Green
      borderColor = "#059669";
    } else if (event.status === "missed") {
      backgroundColor = "#ef4444"; // Red
      borderColor = "#dc2626";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
        fontSize: "0.85rem",
        padding: "4px 8px",
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const getStatusIcon = (status) => {
    if (status === "attended") {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (status === "missed") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    if (status === "attended") return "Attended";
    if (status === "missed") return "Missed";
    return "Upcoming";
  };

  const getStatusColor = (status) => {
    if (status === "attended") return "text-green-500";
    if (status === "missed") return "text-red-500";
    return "text-blue-500";
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-muted-foreground animate-pulse">Loading calendar...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">My Calendar</h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Attended</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">Upcoming</span>
            </div>
          </div>

          {/* Calendar */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div style={{ height: "70vh" }}>
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  views={["month", "week", "day"]}
                  defaultView="month"
                  popup
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEvent && getStatusIcon(selectedEvent.status)}
                Lecture Details
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{selectedEvent.title}</h3>
                  <div className={`inline-flex items-center gap-1 text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {getStatusText(selectedEvent.status)}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">Classroom {selectedEvent.cid}</p>
                    </div>
                  </div>
                </div>

                {selectedEvent.status === "attended" && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✨ Great job! You attended this lecture.
                    </p>
                  </div>
                )}

                {selectedEvent.status === "missed" && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      You missed this lecture. Try to catch up on the material!
                    </p>
                  </div>
                )}

                {selectedEvent.status === "upcoming" && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      📅 This lecture is scheduled. Don't forget to attend!
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
