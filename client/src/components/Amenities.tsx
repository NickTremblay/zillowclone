import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export interface Amenity {
  description: string;
}

interface IProps {
  lid: number;
}

export const Amenities = ({ lid }: IProps) => {
  const [amenities, setAmenities] = useState([] as Amenity[]);

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

  if (amenities.length === 0)
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Unable to get amenities</Typography>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader
        title="Amenities"
        sx={{
          paddingBottom: 0,
        }}
      />
      <CardContent sx={{ paddingTop: "0.5rem" }}>
        <List sx={{ padding: 0 }}>
          {amenities.map((amenity, index) => (
            <ListItem
              key={index}
              disableGutters
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "2px 0",
              }}
            >
              <Typography
                variant="body2"
                sx={{ marginRight: "0.5rem", fontWeight: "bold" }}
              >
                •
              </Typography>
              <ListItemText
                primaryTypographyProps={{ variant: "body2" }}
                sx={{ margin: 0 }}
              >
                {amenity.description}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
