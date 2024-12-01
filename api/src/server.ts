import express, { Application, Request, Response } from "express";
import cors from "cors";
import { db } from "./db";

const app: Application = express();
const PORT = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT 
        l.lid, 
        l.bid, 
        l.uid, 
        l.dateListed, 
        l.price, 
        l.bedCount, 
        l.bathCount, 
        l.squareFootage, 
        l.listingType, 
        b.streetNumber, 
        b.streetName, 
        b.city, 
        b.state, 
        b.zipCode 
      FROM listing l
      JOIN building b ON l.bid = b.bid
    `;

    const [rows] = await db.query(query);
    res.json(rows); // Send the combined results as JSON
  } catch (error) {
    console.error("Error fetching listings with addresses:", error);
    res.status(500).json({ error: "Failed to fetch listings with addresses" });
  }
};

export const getListing = async (req: Request, res: Response): Promise<void> => {
  const lid = req.params.lid;

  try {
    const query = `
      SELECT 
        l.lid, 
        l.bid, 
        l.uid, 
        l.dateListed, 
        l.price, 
        l.bedCount, 
        l.bathCount, 
        l.squareFootage, 
        l.listingType, 
        b.streetNumber, 
        b.streetName, 
        b.city, 
        b.state, 
        b.zipCode 
      FROM listing l
      JOIN building b ON l.bid = b.bid
      WHERE l.lid = ${lid}
    `;

    const [rows] = await db.query(query);
    res.json(rows); // Send the combined results as JSON
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

export const getImages = async (req: Request, res: Response): Promise<void> => {
  const lid = req.params.lid;

  try {
    const query = `
      SELECT 
        url
      FROM image
      WHERE lid = ${lid}
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    res.status(500).json({ error: "Failed to fetch image URLs" });
  }
}

app.get("/api/listings", getListings);
app.get("/api/listing/:lid", getListing);
app.get("/api/images/:lid", getImages);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
