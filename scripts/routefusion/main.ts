import { RoutefusionService } from "./routefusion.service";
import { CreateBusinessEntityInput, BusinessType, CreateUserInput, UUID } from "./types/entity.types";
import { FileEnum } from "./types/entity.types";
import * as fs from "fs";
import * as path from "path";

async function testCreateBusinessEntity() {
  try {
    console.log("Testing Routefusion Service - Create Business Entity");
    console.log("-----------------------------------------------------");

    const routefusionService = new RoutefusionService();

    const entityData: CreateBusinessEntityInput = {
      // Optional fields
      // user_id: "b5fa316d-7d79-442f-a139-faaa7cfa80de", // Optional: UUID of the user creating the entity
      phone: "3563525448", // Optional: Contact phone number
      phone_country: "CO", // Optional: Phone country code
      business_address2: "Suite 100", // Optional: Second address line
      business_city: "New York", // Optional: City
      business_state_province_region: "NY", // Optional: State/Province/Region
      business_postal_code: "10001", // Optional: Postal/ZIP code
      business_type: BusinessType.COOPERATIVE, // Optional: Legal business structure
      tax_number: "12-3456789", // Optional: Tax identification number (EIN, VAT, etc.)

      // Mandatory fields
      email: "test@example.com", // Required: Contact email address
      contact_first_name: "John", // Required: First name of contact person
      contact_last_name: "Doe", // Required: Last name of contact person
      business_name: "BeroNox Corporation", // Required: Legal business name
      business_address1: "123 Main St", // Required: Primary business address
      business_country: "US", // Required: ISO 3166-1 country code
      accept_terms_and_conditions: true, // Required: Must be true to create entity
      naics_code: "111111", // Required: NAICS code
      business_description: "Business description", // Required: Business description
      trading_symbol: "BERONOX", // Required: Trading symbol
      owned_by: "John Doe", // Required: Owner name
      incorporation_date: new Date().toISOString(), // Required: Incorporation date
      website_url: "https://www.example.com", // Required: Website URL
    };

    // console.log(JSON.stringify(entityData, null, 2));

    // Create entity and get the ID
    const entityId = await routefusionService.createBusinessEntity(entityData);

    console.log("\n✅ Successfully created business entity!");
    console.log("Entity ID:", entityId);

    // Fetch the full entity details
  } catch (error) {
    throw error;
  }
}

async function testGetBusinessEntity() {
  try {
    console.log("Testing Routefusion Service - Get Business Entity");
    console.log("-----------------------------------------------------");
    const businessId = "63cdba52-cc6d-450e-9a20-83c9b40a251e";
    const routefusionService = new RoutefusionService();
    const entity = await routefusionService.getBusinessEntity(businessId);
    console.log("\n✅ Successfully got business entity!");
    console.log("Entity:", JSON.stringify(entity, null, 2));
  } catch (error) {
    throw error;
  }
}

async function testCreateUser() {
  try {
    console.log("Testing Routefusion Service - Create User");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();
    const userData: CreateUserInput = {
      email: `test${Date.now()}@example.com`,
      first_name: "John",
      last_name: "Doe",
      admin: false,
      send_invite_email: false,
    };
    const userId = await routefusionService.createUser(userData);
    console.log("\n✅ Successfully created user!");
    console.log("User ID:", userId);
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
  }
}

async function testGetUser() {
  try {
    console.log("Testing Routefusion Service - Get User");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();
    const userId = "b5fa316d-7d79-442f-a139-faaa7cfa80de";
    const user = await routefusionService.getUser(userId);
    console.log("\n✅ Successfully got user!");
    console.log("User:", JSON.stringify(user, null, 2));
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function testCreateWallet(businessIdParam: string) {
  try {
    console.log("Testing Routefusion Service - Create Wallet");
    console.log("-----------------------------------------------------");
    const businessId = businessIdParam || '63cdba52-cc6d-450e-9a20-83c9b40a251e' as UUID;
    const routefusionService = new RoutefusionService();
    const wallet = await routefusionService.createWallet({
      entityId: businessId as UUID,
      currency: 'USD',
    });
    console.log("\n✅ Successfully created wallet!");
    console.log("Wallet:", JSON.stringify(wallet, null, 2));
  } catch (error) {
    throw error;
  }
}

async function testUploadEntityDocument(entityId: string) {
  try {
    console.log("Testing Routefusion Service - Upload Entity Document");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();

    // Read the test text file - resolve path from project root
    const projectRoot = path.resolve(__dirname, "../..");
    const filePath = path.join(projectRoot, "test-document.txt");
    console.log(`Reading file from: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Create a Blob from the buffer (Node.js 18+ has native Blob support)
    const file = new Blob([fileBuffer], { type: "text/plain" });

    console.log(`File size: ${fileBuffer.length} bytes`);
    console.log(`File type: text/plain`);

    const document = await routefusionService.uploadEntityDocument({
      entityId: entityId as UUID,
      file: file,
      file_enum: FileEnum.PASSPORT,
    });
    console.log("\n✅ Successfully uploaded entity document!");
    console.log("Document:", JSON.stringify(document, null, 2));
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function testFinalizeEntity(entityId: string) {
  try {
    console.log("Testing Routefusion Service - Finalize Entity");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();
    const finalizedEntityId = await routefusionService.finalizeEntity(entityId);
    console.log("\n✅ Successfully finalized entity!");
    console.log("Entity ID:", finalizedEntityId);
    console.log("\nNote: The entity will immediately move to a pending state after finalizing.");
    console.log("Routefusion will send the entity through compliance reviews.");
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function main() {
  //await testCreateBusinessEntity(); //4354c4e-d88f-458a-b9ce-45772447730d
  // await testCreateUser();
  // await testGetUser();
  // await testGetBusinessEntity();
  // await testCreateWallet("34354c4e-d88f-458a-b9ce-45772447730d");
  // await testUploadEntityDocument("34354c4e-d88f-458a-b9ce-45772447730d");
  await testFinalizeEntity("34354c4e-d88f-458a-b9ce-45772447730d");
}

main()
// .catch((error) => {
//   console.error("Fatal error:", error);
//   process.exit(1);
// });