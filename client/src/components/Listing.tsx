import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IListing } from "types/listing";
import { Images } from "./Images";
import { Offers } from "./Offers";
import { Amenities } from "./Amenities";

export const Listing = () => { 
  const { lid } = useParams<{ lid: string }>();
  const [listing, setListing] = useState<IListing | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/listing/" + lid)
      .then((response) => {setListing(response.data[0])})
      .catch((error) => console.error("Error fetching data:", error));
  }, [lid])

  if(!listing) return <h1>Listing not found</h1>;

  return ( 
    <>
      <h1>{listing.streetNumber} {listing.streetName} {listing.city}, {listing.state} {listing.zipCode}</h1>
      <Images lid={parseInt(lid ?? "")} />
      <h3>${listing.price.toLocaleString("en-US")}</h3>
      <h3>{listing.bedCount} beds, {listing.bathCount} baths</h3>
      <h3>{listing.squareFootage.toLocaleString("en-US")} sq ft</h3>
      <h3>Listed { (new Date(listing.dateListed)).toLocaleString("en-US", {
        weekday: "long",    // Optional: e.g., "Friday"
        year: "numeric",    // e.g., "2023"
        month: "long",      // e.g., "December"
        day: "numeric",     // e.g., "1"
        })}
      </h3>
      <Amenities lid={parseInt(lid ?? "")} />
      <Offers lid={parseInt(lid ?? "")} />
    </>
  )
}