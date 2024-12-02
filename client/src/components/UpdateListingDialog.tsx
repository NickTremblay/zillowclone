import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from "@mui/material";
import axios from "axios";
import { IListing } from "../types/listing"

export const UpdateListingDialog = ({
  open,
  handleClose,
  listing,
  onUpdateSuccess,
}: {
  open: boolean;
  handleClose: () => void;
  listing: IListing;
  onUpdateSuccess?: () => void;
}) => {
  const [formValues, setFormValues] = useState({
    streetNumber: "",
    streetName: "",
    city: "",
    zipCode: "",
    state: "",
    appraisedValue: "",
    price: "",
    bedCount: "",
    bathCount: "",
    squareFootage: "",
  });

  // Update state with listing data when dialog opens
  useEffect(() => {
    if (listing) {
      setFormValues({
        streetNumber: listing.streetNumber.toString(),
        streetName: listing.streetName,
        city: listing.city,
        zipCode: listing.zipCode.toString(),
        state: listing.state,
        appraisedValue: listing.price.toString(),
        price: listing.price.toString(),
        bedCount: listing.bedCount.toString(),
        bathCount: listing.bathCount.toString(),
        squareFootage: listing.squareFootage.toString()
      });
    }
  }, [listing]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        ...formValues,
        appraisedValue: parseFloat(formValues.appraisedValue),
        price: parseFloat(formValues.price),
        bedCount: parseInt(formValues.bedCount, 10),
        bathCount: parseInt(formValues.bathCount, 10),
        squareFootage: parseInt(formValues.squareFootage, 10),
      };

      await axios.put("http://localhost:5555/api/listing/" + listing?.lid, payload);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      handleClose();
    } catch (error: any) {
      console.error("Error updating listing:", error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Listing</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the details for the listing. Make sure all fields are filled correctly.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            label="Street Number"
            name="streetNumber"
            value={formValues.streetNumber}
            onChange={handleChange}
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="Street Name"
            name="streetName"
            value={formValues.streetName}
            onChange={handleChange}
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="City"
            name="city"
            value={formValues.city}
            onChange={handleChange}
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="Zip Code"
            name="zipCode"
            value={formValues.zipCode}
            onChange={handleChange}
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="State"
            name="state"
            value={formValues.state}
            onChange={handleChange}
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            value={formValues.price}
            onChange={handleChange}
            type="number"
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="Bed Count"
            name="bedCount"
            value={formValues.bedCount}
            onChange={handleChange}
            type="number"
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="Bath Count"
            name="bathCount"
            value={formValues.bathCount}
            onChange={handleChange}
            type="number"
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            label="Square Footage"
            name="squareFootage"
            value={formValues.squareFootage}
            onChange={handleChange}
            type="number"
            fullWidth
            variant="standard"
            required
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="update-listing-form">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
