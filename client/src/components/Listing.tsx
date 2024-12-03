import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Typography, Card, CardContent } from "@mui/material";
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

  const handleDelete = () => {
    axios
      .delete("http://localhost:5555/api/listing/" + lid)
      .then(() => navigate("/"))
      .catch((error) => console.error("Error deleting listing:", error));
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
          <Button color="inherit" sx={{m: 1}} onClick={handleDialogOpen}>
            Update Listing
          </Button>

          {/* Delete Listing Button */}
          <Button color="error" onClick={handleDelete}>
            Delete Listing
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
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        <h1>
          {listing.streetNumber} {listing.streetName} {listing.city}, {listing.state}{" "}
          {listing.zipCode}
        </h1>
        <Images lid={parseInt(lid ?? "")} />
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Typography variant="body1">
              <strong>Price:</strong> ${listing.price.toLocaleString("en-US")}
            </Typography>
            <Typography variant="body1">
              <strong>Beds & Baths:</strong> {listing.bedCount} beds, {listing.bathCount} baths
            </Typography>
            <Typography variant="body1">
              <strong>Square Footage:</strong> {listing.squareFootage.toLocaleString("en-US")} sq ft
            </Typography>
            <Typography variant="body1">
              <strong>Date Listed:</strong>{" "}
              {new Date(listing.dateListed).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </CardContent>
        </Card>
        <Amenities lid={parseInt(lid ?? "")} />
        <Offers lid={parseInt(lid ?? "")} />
      </div>
    </>
  )
}