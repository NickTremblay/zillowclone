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

    const [checked, setChecked] = React.useState([""]);
    
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
            const uid = formJson.uid as string; // Assuming `uid` is provided in the form
            const dateListed = formJson.dateListed as string; // Assuming `dateListed` is a valid date string
            const bedCount = parseInt(formJson.bedCount as string, 10);
            const bathCount = parseInt(formJson.bathCount as string, 10);
            const squareFootage = parseInt(formJson.sqft as string, 10);
            const listingType = formJson.listingType as string; // Assuming this is a dropdown or input field
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
                bedCount,
                bathCount,
                squareFootage,
                listingType,
                amenities, // Include amenities if needed for the listing
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
                autoFocus
                required
                margin="dense"
                id="address"
                name="address"
                label="Address"
                type="address"
                fullWidth
                variant="standard"
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