import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IListing } from "types/listing";

export const Listing = () => { 
  const { lid } = useParams<{ lid: string }>();
  const [listing, setListing] = useState<IListing | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/listing/" + lid)
      .then((response) => setListing(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [lid])

  return ( 
    <h1> </h1>
  )
}