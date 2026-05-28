import { testFirestoreConnection } from "./config/firebase";
import { ListingService } from "./services/listingService";

async function main() {
  console.log("Starting test-get-by-id diagnostic...");
  await testFirestoreConnection();
  
  const id = "81jk4vr16mplr4rah";
  console.log(`Querying ListingService.getById("${id}"):`);
  try {
    const listing = await ListingService.getById(id);
    if (listing) {
      console.log("SUCCESS! Listing found:", listing);
    } else {
      console.log("FAILED! Listing is null!");
    }
  } catch (err: any) {
    console.error("ERROR while querying:", err);
  }
}

main();
