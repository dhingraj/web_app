"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PlusCircle } from "lucide-react"

type ScheduledEvent = {
  id: string;
  title: string;
  time: string;
};

export default function SchedulingPage() {
  const [date, setDate] = useState<Date | undefined>()
  const [events, setEvents] = useState<Record<string, ScheduledEvent[]>>({})
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventTime, setNewEventTime] = useState("")

  useEffect(() => {
    const today = new Date();
    setDate(today);
    setEvents({
      [format(today, "yyyy-MM-dd")]: [
        { id: "1", title: "Daily stand-up", time: "09:00 AM" },
        { id: "2", title: "Review new alerts", time: "11:00 AM" },
      ],
    })
  }, [])

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : ""
  const selectedEvents = events[selectedDateStr] || []

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !newEventTitle || !newEventTime) return

    const newEvent: ScheduledEvent = {
      id: `${Date.now()}`,
      title: newEventTitle,
      time: newEventTime,
    }

    setEvents((prev) => ({
      ...prev,
      [selectedDateStr]: [...(prev[selectedDateStr] || []), newEvent].sort((a,b) => a.time.localeCompare(b.time)),
    }));

    setNewEventTitle("")
    setNewEventTime("")
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 sm:p-6 border-b">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Scheduling</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[2fr_1fr] items-start">
          <div>
            <Card>
                <CardContent className="flex justify-center p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(day) => day > new Date() || day < new Date("1900-01-01")}
                        initialFocus
                        className="w-full"
                    />
                </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Schedule for {date ? format(date, "PPP") : "Loading..."}</CardTitle>
                <CardDescription>View and manage tasks for the selected day.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedEvents.length > 0 ? (
                    selectedEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No events scheduled.</p>
                  )}
                </div>
                <form onSubmit={handleAddEvent} className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Add New Event</h3>
                   <div className="space-y-2">
                      <Input
                        placeholder="Event Title"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                      />
                   </div>
                  <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
