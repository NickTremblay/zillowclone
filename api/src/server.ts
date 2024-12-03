import express, { Application, Request, Response } from "express";
import cors from "cors";
import { db } from "./db";
import { RowDataPacket } from "mysql2/promise";

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
    price,
    bedCount,
    bathCount,
    squareFootage,
    listingType,
    amenities, // Expect an array of amenities
  } = req.body;

  // Validate input
  if (
    !streetNumber ||
    !streetName ||
    !city ||
    !zipCode ||
    !state ||
    !appraisedValue ||
    !price ||
    !bedCount ||
    !bathCount ||
    !squareFootage ||
    !listingType ||
    !Array.isArray(amenities) // Ensure amenities is an array
  ) {
    res.status(400).json({ error: "All fields, including amenities, are required." });
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
      VALUES (?, 1, NOW(), ?, ?, ?, ?, ?)
    `;
    const [listingResult] = await connection.query(listingQuery, [
      bid,
      price,
      bedCount,
      bathCount,
      squareFootage,
      listingType,
    ]);

    const lid = (listingResult as any).insertId; // Get the inserted listing ID

    // Insert into amenities table
    if (amenities.length > 0) {
      const amenitiesQuery = `
        INSERT INTO amenities (lid, description)
        VALUES (?, ?)
      `;

      for (const description of amenities) {
        await connection.query(amenitiesQuery, [lid, description]);
      }
    }

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: "Listing, building, and amenities created successfully.",
      listingId: lid,
    });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("Error creating a new listing, building, and amenities:", error);
    res.status(500).json({ error: "Failed to create listing, building, and amenities." });
  } finally {
    // Release the connection
    connection.release();
  }
};

export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  const lid = req.params.lid;

  try {
    // Fetch the building ID (`bid`) associated with the listing
    const fetchBuildingQuery = `
      SELECT bid
      FROM listing
      WHERE lid = ?
    `;

    const [buildingResult] = await db.query<RowDataPacket[]>(fetchBuildingQuery, [lid]);

    if (buildingResult.length === 0) {
      res.status(404).json({ error: "Listing not found." });
      return;
    }

    const bid = buildingResult[0].bid;

    // Delete the building (cascading deletes will handle associated listings)
    const deleteBuildingQuery = `
      DELETE FROM building
      WHERE bid = ?
    `;

    await db.query(deleteBuildingQuery, [bid]);

    res.status(200).json({ message: "Listing and associated building deleted successfully." });
  } catch (error) {
    console.error("Error deleting listing and associated building:", error);
    res.status(500).json({ error: "Failed to delete listing and associated building." });
  }
};

export const createOffer = async (req: Request, res: Response): Promise<void> => {
  const { lid, amount } = req.body;

  if (!lid || !amount) {
    res.status(400).json({ error: "Listing ID (lid) and amount are required." });
    return;
  }

  try {
    const query = `
      INSERT INTO offer (lid, amount, dateOffered)
      VALUES (?, ?, NOW())
    `;
    const [result] = await db.query(query, [lid, amount]);

    res.status(201).json({
      message: "Offer created successfully.",
      offerId: (result as any).insertId, // Include the new offer's ID in the response
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Failed to create offer." });
  }
};

export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  const oid = req.params.oid;

  if (!oid) {
    res.status(400).json({ error: "Offer ID (oid) is required." });
    return;
  }

  try {
    const query = `
      DELETE FROM offer
      WHERE oid = ?
    `;

    const [result] = await db.query(query, [oid]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Offer not found." });
      return;
    }

    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ error: "Failed to delete offer." });
  }
};

app.get("/api/listings", getListings);
app.get("/api/listing/:lid", getListing);
app.get("/api/images/:lid", getImages);
app.get("/api/offers/:lid", getOffers);
app.get("/api/amenities/:lid", getAmenities);
app.post("/api/listing", createListing);
app.post("/api/offer", createOffer);
app.delete("/api/listing/:lid", deleteListing);
app.delete("/api/offers/:oid", deleteOffer);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
