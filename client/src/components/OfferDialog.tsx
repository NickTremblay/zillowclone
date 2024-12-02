import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2"

interface IOfferDialogProps {
  open: boolean;
  onClose: () => void;
  offer?: {
    oid: number;
    amount: number;
    dateOffered: string;
  };
  onSave: (offer: { oid: number; amount: number; dateOffered: string }) => void;
}

export const OfferDialog: React.FC<IOfferDialogProps> = ({ open, onClose, offer, onSave }) => {
  const [formState, setFormState] = React.useState({
    oid: offer?.oid || 0,
    amount: offer?.amount || 0,
    dateOffered: offer?.dateOffered || "",
  });

  React.useEffect(() => {
    if (offer) {
      setFormState({
        oid: offer.oid,
        amount: offer.amount,
        dateOffered: offer.dateOffered,
      });
    }
  }, [offer]);

  const handleInputChange = (field: keyof typeof formState, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formState);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle p={1}>{"New Offer"}</DialogTitle>
      <DialogContent>
        <Grid container m={2}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formState.amount}
              onChange={(e) => handleInputChange("amount", Number(e.target.value))}
            />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
