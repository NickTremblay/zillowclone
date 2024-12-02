import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IListing } from "types/listing";
import { Images } from "./Images";
import { Offers } from "./Offers";
import { Amenities } from "./Amenities";
import { UpdateListingDialog } from "./UpdateListingDialog";

export const Listing = () => { 
  const { lid } = useParams<{ lid: string }>();
  const [listing, setListing] = useState<IListing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/listing/" + lid)
      .then((response) => {setListing(response.data[0])})
      .catch((error) => console.error("Error fetching data:", error));
  }, [lid])

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateSuccess = () => {
    // Refresh listing details after successful update
    axios
      .get("http://localhost:5555/api/listing/" + lid)
      .then((response) => setListing(response.data[0]))
      .catch((error) => console.error("Error fetching data:", error));
  };

  if(!listing) return <h1>Listing not found</h1>;

  return ( 
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Back Button */}
          <IconButton edge="start" color="inherit" onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {listing.streetNumber} {listing.streetName}, {listing.city}
          </Typography>

          {/* Update Listing Button */}
          <Button color="inherit" onClick={handleDialogOpen}>
            Update Listing
          </Button>
        </Toolbar>
      </AppBar>

      <UpdateListingDialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        listing={listing}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Content */}
      <div style={{ padding: "1rem" }}>
        <h1>
          {listing.streetNumber} {listing.streetName} {listing.city}, {listing.state}{" "}
          {listing.zipCode}
        </h1>
        <Images lid={parseInt(lid ?? "")} />
        <h3>${listing.price.toLocaleString("en-US")}</h3>
        <h3>
          {listing.bedCount} beds, {listing.bathCount} baths
        </h3>
        <h3>{listing.squareFootage.toLocaleString("en-US")} sq ft</h3>
        <h3>
          Listed{" "}
          {new Date(listing.dateListed).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <Amenities lid={parseInt(lid ?? "")} />
        <Offers lid={parseInt(lid ?? "")} />
      </div>
    </>
  )
}