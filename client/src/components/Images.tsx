import { Box, CardMedia } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";

interface IProps {
  lid: number;
}

interface IImage {
  url: string;
}

const settings = {
  dots: true, // Enable navigation dots
  infinite: false, // Prevent looping (users can scroll only within available images)
  speed: 500, // Animation speed
  slidesToShow: 1, // Show one slide at a time
  slidesToScroll: 1, // Scroll one slide at a time
  autoplay: false, // Disable auto-sliding
  draggable: true, // Allow dragging slides
  swipe: true, // Enable swipe gestures on touch devices
};

export const Images = ({ lid }: IProps) => {
  const [images, setImages] = useState<IImage[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/images/" + lid)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setImages(data);
        } else if (Array.isArray(data[0])) {
          setImages(data[0]);
        } else {
          console.error("Unexpected API response format:", data);
          setImages([]);
        }
      })
      .catch((error) => console.error("Error fetching image URLs:", error));
  }, [lid]);

  if (!Array.isArray(images) || images.length === 0) {
    return <h1>Unable to display images</h1>;
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", mt: 4 }}>
      <Slider {...settings}>
        {images.map((img, i) => (
          <CardMedia
            key={i}
            component="img"
            height="800"
            image={img.url}
            alt={`Slide ${i + 1}`}
          />
        ))}
      </Slider>
    </Box>
  );
};