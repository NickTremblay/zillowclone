import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
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
    axios
    .post("http://localhost:5555/api/offer", offer)
    .then((response) => {
      fetchOffers();
      setDialogOpen(false);
    })
    .catch((error) => {
      console.error("Error creating offer:", error.response?.data || error.message);
    });
  };

  useEffect(() => {
    fetchOffers();
  }, [lid]);

  const fetchOffers = () => {
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
  };

  const handleDeleteOffer = (oid: number) => {
    axios
      .delete(`http://localhost:5555/api/offers/${oid}`)
      .then(() => {
        console.log(`Offer with ID ${oid} deleted.`);
        fetchOffers(); // Refresh the list of offers
      })
      .catch((error) => console.error(`Error deleting offer with ID ${oid}:`, error));
  };

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
      {offers.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No current offers.
        </Typography>
      ) : (
        <List>
          {offers.map((offer) => (
            <ListItem
              key={offer.oid}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDeleteOffer(offer.oid)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
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
      )}
    </Paper>
  );
};
