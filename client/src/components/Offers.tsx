import axios from "axios";
import React, { useEffect, useState } from "react";

interface IProps { 
  lid: number;
}

export interface IOffer { 
  oid: number, 
  amount: number, 
  dateOffered: string, 
}

export const Offers = ({lid}:IProps) => { 
  const [offers, setOffers] = useState([] as IOffer[])

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/offers/" + lid)
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
  }, [lid]);

  if(offers.length === 0) return <h1>Unable to get offers</h1>

  return ( 
    <>
      <h3>Offers: </h3>
      <ul>
        {
          offers.map((offer) => { 
            return <li>${offer.amount.toLocaleString("en-US")} on { (new Date(offer.dateOffered)).toLocaleString("en-US", {
              weekday: "long",    // Optional: e.g., "Friday"
              year: "numeric",    // e.g., "2023"
              month: "long",      // e.g., "December"
              day: "numeric",     // e.g., "1"
              hour: "numeric",    // e.g., "2"
              minute: "numeric",  // e.g., "30"
              hour12: true,       // Use 12-hour clock
            })}</li>
          })
        }
      </ul>
    </>
  )

}