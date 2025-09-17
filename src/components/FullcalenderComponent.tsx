/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label} from "@/components/ui/label"
import RichTextEditor from "./RichTextEditorComponent";
import { Input } from "@/components/ui/input";

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
      
      <div className="w-full overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="00:30:00"
          nowIndicator={true}
          selectable={true}
          select={handleSelect}
          events={events}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // true kalau mau pakai AM/PM
          }}
          eventContent={(arg) => {
            const start = arg.event.start
              ? new Date(arg.event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";
            const end = arg.event.end
              ? new Date(arg.event.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";

            return {
              html: `
                <div class="px-1 text-xs bg-blue-500 text-white rounded">
                  <div class="font-semibold">${(arg.event.allDay) ? "All day" : `${start} - ${end}` }</div>
                  
                  <div>${arg.event.title}</div>
                </div>
              `,
            };
          }}
          longPressDelay={1}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay", 
          }}
          buttonText={{
            today: "Hari ini",
            month: "Bulan",
            week: "Minggu",
            day: "Hari",
          }}
        />

      </div>


      {/* Modal untuk tambah / edit event */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="sm:max-w-2xl w-[95%] sm:w-full rounded-xl p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              {editEvent ? "Edit Planner / To-do" : "Planner / To-do"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Title Event</Label>
              <Input 
                placeholder="Type title here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              {/* Rich Editor */}
              <RichTextEditor />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
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
