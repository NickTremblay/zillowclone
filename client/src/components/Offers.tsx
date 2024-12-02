import axios from "axios";
import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import Grid from "@mui/material/Grid2"
import { OfferDialog } from "./OfferDialog";

interface IProps {
  lid: number;
}

export interface IOffer {
  oid: number;
  amount: number;
  dateOffered: string;
}

export const Offers = ({ lid }: IProps) => {
  const [offers, setOffers] = useState([] as IOffer[]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const handleOpenDialog = (offer?: any) => {
    setSelectedOffer(offer || { oid: 0, amount: 0, dateOffered: "" });
    setDialogOpen(true);
  };

  const handleSaveOffer = (offer: any) => {
    console.log("Offer saved:", offer);
    setDialogOpen(false);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5555/api/offers/${lid}`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setOffers(data);
        } else if (Array.isArray(data[0])) {
          setOffers(data[0]);
        } else {
          console.error("Unexpected API response format:", data);
          setOffers([]);
        }
      })
      .catch((error) => console.error("Error fetching offers:", error));
  }, [lid]);

  if (offers.length === 0)
    return (
      <Typography variant="h6" color="error">
        Unable to get offers
      </Typography>
    );

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Typography variant="h5">Offers</Typography>
        <Button onClick={() => handleOpenDialog()} variant="contained" color="primary">
          Make an Offer
        </Button>
        <OfferDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        offer={selectedOffer}
        onSave={handleSaveOffer}
        />
      </Grid>
      <List>
        {offers.map((offer) => (
          <ListItem key={offer.oid} divider>
            <ListItemText
              primary={`$${offer.amount.toLocaleString("en-US")}`}
              secondary={new Date(offer.dateOffered).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
