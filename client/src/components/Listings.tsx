import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IListing } from "types/listing";

export const Listings = () => { 
  const [listings, setListings] = useState<IListing[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/listings")
      .then((response) => setListings(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  return ( 
    <div>
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
    </div>
  )
}