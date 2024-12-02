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

export const getOffers = async (req: Request, res: Response): Promise<void> => {
  const lid = req.params.lid;

  try {
    const query = `
      SELECT 
        oid, amount, dateOffered
      FROM offer
      WHERE lid = ${lid}
      ORDER BY amount DESC
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
}

export const getAmenities = async (req: Request, res: Response): Promise<void> => {
  const lid = req.params.lid;

  try {
    const query = `
      SELECT 
        description
      FROM amenities
      WHERE lid = ${lid}
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    res.status(500).json({ error: "Failed to fetch amenities" });
  }
}

export const createListing = async (req: Request, res: Response): Promise<void> => {
  const {
    streetNumber,
    streetName,
    city,
    zipCode,
    state,
    appraisedValue,
    uid,
    dateListed,
    price,
    bedCount,
    bathCount,
    squareFootage,
    listingType,
  } = req.body;

  // Validate input
  if (
    !streetNumber ||
    !streetName ||
    !city ||
    !zipCode ||
    !state ||
    !appraisedValue ||
    !uid ||
    !dateListed ||
    !price ||
    !bedCount ||
    !bathCount ||
    !squareFootage ||
    !listingType
  ) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const connection = await db.getConnection(); // Use connection for transaction handling

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert into building table
    const buildingQuery = `
      INSERT INTO building (streetNumber, streetName, city, zipCode, state, appraisedValue)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [buildingResult] = await connection.query(buildingQuery, [
      streetNumber,
      streetName,
      city,
      zipCode,
      state,
      appraisedValue,
    ]);

    const bid = (buildingResult as any).insertId; // Get the inserted building ID

    // Insert into listing table
    const listingQuery = `
      INSERT INTO listing (bid, uid, dateListed, price, bedCount, bathCount, squareFootage, listingType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [listingResult] = await connection.query(listingQuery, [
      bid,
      uid,
      dateListed,
      price,
      bedCount,
      bathCount,
      squareFootage,
      listingType,
    ]);

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: "Listing and building created successfully.",
      listingId: (listingResult as any).insertId,
    });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("Error creating a new listing and building:", error);
    res.status(500).json({ error: "Failed to create listing and building." });
  } finally {
    // Release the connection
    connection.release();
  }
};

app.get("/api/listings", getListings);
app.get("/api/listing/:lid", getListing);
app.get("/api/images/:lid", getImages);
app.get("/api/offers/:lid", getOffers);
app.get("/api/amenities/:lid", getAmenities);
app.post("/api/listing", createListing);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
