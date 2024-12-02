import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useUserAPI from "@/fetchAPI/useUserAPI";

type LogoutDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const LogoutDialog: React.FC<LogoutDialogProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const { logout } = useUserAPI();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[24rem] rounded-[10px] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will need to log back in to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-4">
          <Button variant="secondary" className="" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="" onClick={handleLogout}>
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
