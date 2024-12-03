import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2"
import { useParams } from "react-router-dom";

interface IOfferDialogProps {
  open: boolean;
  onClose: () => void;
  offer?: {
    lid: number;
    amount: number;
  };
  onSave: (offer: { lid: number; amount: number; }) => void;
}

export const OfferDialog: React.FC<IOfferDialogProps> = ({ open, onClose, offer, onSave }) => {
  const { lid } = useParams<{ lid: string }>();
  const [formState, setFormState] = React.useState({
    lid: parseInt(lid ?? "1"),
    amount: offer?.amount || 0,
  });

  React.useEffect(() => {
    if (offer) {
      setFormState({
        lid: parseInt(lid ?? "1"),
        amount: offer.amount,
      });
    }
  }, [offer, lid]);

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
