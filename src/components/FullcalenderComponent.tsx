/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PlannerCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [editEvent, setEditEvent] = useState<any>(null);

  // saat pilih tanggal
  const handleSelect = (info: any) => {
    setSelectedInfo(info);
    setTitle("");
    setEditEvent(null);
    setOpen(true);
  };

  // saat klik event
  const handleEventClick = (clickInfo: any) => {
    setEditEvent(clickInfo.event);
    setTitle(clickInfo.event.title);
    setOpen(true);
  };

  // simpan event baru / update event
  const handleSave = () => {
    if (editEvent) {
      // update event
      editEvent.setProp("title", title);
    } else {
      // tambah event baru
      setEvents([
        ...events,
        {
          title,
          start: selectedInfo.startStr,
          end: selectedInfo.endStr,
          allDay: selectedInfo.allDay,
        },
      ]);
    }
    setOpen(false);
  };

  // hapus event
  const handleDelete = () => {
    if (editEvent) {
      editEvent.remove();
      setOpen(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Planner Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleSelect}
        events={events}
        longPressDelay={1}
        eventClick={handleEventClick}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        buttonText={{
          today: "Hari ini",
          month: "Bulan",
          week: "Minggu",
          day: "Hari",
        }}
      />

      {/* Modal untuk tambah / edit event */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editEvent ? "Edit Event" : "Tambah Event"}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Judul catatan / event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogFooter>
            {editEvent && (
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            )}
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
