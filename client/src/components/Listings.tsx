import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IListing } from "types/listing";
import Grid from  "@mui/material/Grid2";
import { Button, Paper, Typography } from "@mui/material"
import { ListingDialog } from "./ListingDialog"

export const Listings = () => { 
  const [listings, setListings] = useState<IListing[]>([]);

  const [openCL, setOpenCL] = React.useState(false);

  const handleOpenCL = () => {
    setOpenCL(true);
  };
    
  const handleCloseCL = () => {
    setOpenCL(false);
    // Update listings in case listing was created
    axios
      .get("http://localhost:5555/api/listings")
      .then((response) => setListings(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/listings")
      .then((response) => setListings(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  return ( 
    <Paper elevation={3} sx={{
      marginTop: 10,
      marginLeft: 40,
      marginRight: 40,
      p: 2
    }}>
      <Grid container>
        <Grid size={6}>
          <Typography>Listings</Typography>
        </Grid>
        <Grid container size={6} justifyContent={'flex-end'}>
          <Button onClick={handleOpenCL}>Create Listing</Button>
        </Grid>
        <Grid>
          <ul>
          {
            listings.map(listing => { 
              return (
                <li>
                  <Link to={`/listing/${listing.lid}`}>{listing.streetNumber} {listing.streetName} {listing.city}, {listing.state} {listing.zipCode}</Link>
                </li>
              )
            })
          }
          </ul>
        </Grid>
      </Grid>

      <ListingDialog open={openCL} handleClose={handleCloseCL} />
    </Paper>
  )
}