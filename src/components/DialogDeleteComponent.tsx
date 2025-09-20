/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { Planner } from './PlannerListComponent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

type DialogDeleteProps = {
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
  planner?: Planner | null;
  selectedPlanner?: Planner | null;
  selectedDelete?: Planner | null;
  setSelectedPlanner?: (planner: null) => void;
  setSelectedDelete?: (planner: null) => void;
}

export function DialogDeleteComponent({ 
  isOpen, 
  setOpen, 
  planner,
  setSelectedPlanner,
  setSelectedDelete,
  selectedPlanner,
  selectedDelete
}: DialogDeleteProps) {

  const handlerClickDelete = async () => {
    try {
      const res = await fetch('/api/planner', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idPlanner: planner?._id }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Delete Event failed!")
        return;
      }

      // setSelectedDelete((prev) => prev.filter(event => event._id !== planner?._id))
    } catch (err: any) {
      toast.error("Delete Event failed!")
      return;
    }
  }

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{planner?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure delete this event?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setOpen?.(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 cursor-pointer"
              onClick={() => setOpen?.(false)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}