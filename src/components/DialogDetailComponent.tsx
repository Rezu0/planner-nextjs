import { Planner } from "./PlannerListComponent";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { ScrollArea } from "./ui/scroll-area";

type DialogDetailProps = {
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
  planner?: Planner | null;
}

export function DialogDetailComponent({ isOpen, setOpen, planner }: DialogDetailProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-3xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>{planner?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="h-48">
              <p 
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: planner?.description || "" }}
              ></p>
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen?.(false)}
            className="cursor-pointer"
          >
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}