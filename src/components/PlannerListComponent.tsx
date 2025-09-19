import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CalendarDays, CircleAlert, Clock, Trash } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

type Planner = {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  idUser: string;
}

interface PlannerListProps {
  planners: Planner[];
}

export function PlannerListComponent({ planners }: PlannerListProps) {
  if (!planners || planners.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            All your planners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Belum ada planner dibuat.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          All your planners
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3">
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planners.map((planner) => (
              <div
                key={planner._id.toString()}
                className="flex flex-col justify-between p-5 rounded-xl bg-gray-300/50 backdrop-blur-md border border-border/30 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold tracking-tight line-clamp-1 text-gray-600">
                      {planner.title}
                    </h2>
                    {planner.description && (
                      <p className="text-sm mt-1 line-clamp-2 text-gray-600/70">
                        {planner.description.replace(/<[^>]+>/g, "")}
                      </p>
                    )}
                  </div>
                  <Badge
                    className="ml-3 whitespace-nowrap"
                    variant={planner.allDay ? "default" : "secondary"}
                  >
                    {planner.allDay ? "All Day" : "Timed"}
                  </Badge>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                  {/* Date & Time */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-gray-800 text-gray-200 px-2 py-1 rounded-md">
                      <CalendarDays className="w-3 h-3" />
                      <span>
                        {new Date(planner.start).toLocaleDateString()} -{" "}
                        {new Date(planner.end).toLocaleDateString()}
                      </span>
                    </div>

                    {!planner.allDay && (
                      <div className="flex items-center gap-1 bg-yellow-300/40 text-gray-900 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(planner.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(planner.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full cursor-pointer"
                    >
                      <CircleAlert className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

  )
}