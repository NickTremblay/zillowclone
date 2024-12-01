import axios from "axios";
import React, { useEffect, useState } from "react";

export interface Amenity { 
  description: string;
}

interface IProps { 
  lid: number 
}

export const Amenities = ({lid}:IProps) => { 
  const [amenities, setAmenities] = useState([] as Amenity[])

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/amenities/" + lid)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setAmenities(data);
        } else if (Array.isArray(data[0])) {
          setAmenities(data[0]);
        } else {
          console.error("Unexpected API response format:", data);
          setAmenities([]);
        }
      })
      .catch((error) => console.error("Error fetching amenities:", error));
  }, [lid]);

  if(amenities.length === 0) return <h1>Unable to get amenities</h1>

  return ( 
    <>
    <h3>Amenities: </h3>
    <ul>
      {
        amenities.map((amenity) => { 
          return <li>{amenity.description}</li>
        })
      }
    </ul>
  </>
  )
}