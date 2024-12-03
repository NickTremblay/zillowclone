import axios from "axios";
import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { AmenitiesChecklist } from "./AmenitiesChecklist";

export const ListingDialog = ({
    open,
    handleClose,
  }: {
    open: boolean;
    handleClose: () => void;
  }) => {

    const [checked, setChecked] = React.useState([] as string[]);
    
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            // Extract form data
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());

            // Extract individual fields from the form data
            const streetNumber = formJson.streetNumber as string;
            const streetName = formJson.streetName as string;
            const city = formJson.city as string;
            const zipCode = formJson.zipCode as string;
            const state = formJson.state as string;
            const appraisedValue = parseFloat(formJson.price as string);
            const uid = null;
            const dateListed = formJson.dateListed as string; // Assuming `dateListed` is a valid date string
            const price = parseFloat(formJson.price as string);
            const bedCount = parseInt(formJson.bedCount as string, 10);
            const bathCount = parseInt(formJson.bathCount as string, 10);
            const squareFootage = parseInt(formJson.sqft as string, 10);
            const listingType = 1;
            const amenities = checked; // Assuming `checked` is an array of amenities from another state

            // Prepare the payload
            const payload = {
                streetNumber,
                streetName,
                city,
                zipCode,
                state,
                appraisedValue,
                uid,
                dateListed,
                price,
                bedCount,
                bathCount,
                squareFootage,
                amenities,
                listingType
            };

            // Send POST request
            axios
                .post("http://localhost:5555/api/listing", payload)
                .then((response) => {
                console.log("Listing created successfully:", response.data);
                })
                .catch((error) => {
                console.error("Error creating listing:", error.response?.data || error.message);
                });

            handleClose();
          },
        }}
      >
        <DialogTitle>Create Listing</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To create a listing, please enter all of following required information.
            </DialogContentText>
              <TextField
              margin="dense"
              label="Street Number"
              name="streetNumber"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              margin="dense"
              label="Street Name"
              name="streetName"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              margin="dense"
              label="City"
              name="city"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              margin="dense"
              label="Zip Code"
              name="zipCode"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              margin="dense"
              label="State"
              name="state"
              fullWidth
              variant="standard"
              required
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="price"
                name="price"
                label="Price"
                type="number"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="bedCount"
                name="bedCount"
                label="Bed Count"
                type="number"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="bathCount"
                name="bathCount"
                label="Bath Count"
                type="number"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="sqft"
                name="sqft"
                label="Square Footage"
                type="number"
                fullWidth
                variant="standard"
            />
            <AmenitiesChecklist checked={checked} setChecked={setChecked}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    )
}