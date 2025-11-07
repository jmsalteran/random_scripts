import { RoutefusionService } from "./routefusion.service";
import { CreateBusinessEntityInput, BusinessType, CreateUserInput } from "./types/entity.types";

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
      business_type: BusinessType.LIMITED_LIABILITY_COMPANY, // Optional: Legal business structure
      tax_number: "12-3456789", // Optional: Tax identification number (EIN, VAT, etc.)

      // Mandatory fields
      email: "test@example.com", // Required: Contact email address
      contact_first_name: "John", // Required: First name of contact person
      contact_last_name: "Doe", // Required: Last name of contact person
      business_name: "Acme Corporation", // Required: Legal business name
      business_address1: "123 Main St", // Required: Primary business address
      business_country: "US", // Required: ISO 3166-1 country code
      accept_terms_and_conditions: true, // Required: Must be true to create entity
      naics_code: "111111", // Required: NAICS code
      business_description: "Business description", // Required: Business description
      trading_symbol: "ACME", // Required: Trading symbol
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
    console.log("\nFetching full entity details...");
    // const businessEntity = await routefusionService.getEntity(entityId);

    // console.log("\nFull Entity Details:");
    // console.log(JSON.stringify(businessEntity, null, 2));
    // console.log("\nBusiness Entity ID:", businessEntity.id);
    // console.log("Business Entity Name:", businessEntity.business_name || businessEntity.entity_name);
    // console.log("Business Entity Country:", businessEntity.country);
    // if (businessEntity.state) {
    //   console.log("Business Entity State:", businessEntity.state);
    // }

    // return businessEntity;
  } catch (error) {
    // console.error("\n❌ Error occurred during test:");
    // if (error instanceof Error) {
    //   console.error("Error message:", error.message);
    //   console.error("Error stack:", error.stack);
    // } else {
    //   console.error("Unknown error:", error);
    // }
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

async function main() {
  await testCreateBusinessEntity();
  // await testCreateUser();
  // await testGetUser();
}

main()
// .catch((error) => {
//   console.error("Fatal error:", error);
//   process.exit(1);
// });