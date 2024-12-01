import express, { Application, Request, Response } from "express";
import { db } from "./db";

const app: Application = express();
const PORT = process.env.PORT || 5555;

app.use(express.json());

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

app.get("/api/listings", getListings);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});