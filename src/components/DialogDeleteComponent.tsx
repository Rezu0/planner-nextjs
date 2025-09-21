/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { Planner } from './PlannerListComponent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type DialogDeleteProps = {
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
  planner?: Planner | null;
  selectedPlanner?: Planner | null;
  selectedDelete?: Planner | null;
  setSelectedPlanner?: (planner: null) => void;
  setSelectedDelete?: (planner: null) => void;
  setPlanners?: React.Dispatch<React.SetStateAction<Planner[]>>;
}

export function DialogDeleteComponent({ 
  isOpen, 
  setOpen, 
  planner,
  setPlanners,
}: DialogDeleteProps) {
  const [isLoading, setLoading] = useState(false)

  const handlerClickDelete = async () => {
    try {
      setLoading(true);
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

      setPlanners?.((prev: Planner[]) => 
        prev.filter(event => event._id !== planner?._id)
      );
      
      setTimeout(() => {
        toast.success(result.message || 'Delete Event Successfully 🎉' );
        setLoading(false);
        setOpen?.(false);
      }, 1000)
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
              onClick={handlerClickDelete}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}