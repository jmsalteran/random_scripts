import { RoutefusionService } from "./routefusion.service";
import { CreateBusinessEntityInput } from "./types/entity.types";

async function testCreateBusinessEntity() {
  try {
    console.log("Testing Routefusion Service - Create Business Entity");
    console.log("-----------------------------------------------------");

    const routefusionService = new RoutefusionService();
    
    const entityData: CreateBusinessEntityInput = {
      email: "test@example.com",
      contact_first_name: "John",
      contact_last_name: "Doe",
      business_name: "Test Business Entity",
      business_address1: "123 Main St",
      business_city: "New York",
      business_state_province_region: "NY",
      business_postal_code: "10001",
      business_country: "US",
      accept_terms_and_conditions: true,
    };

    console.log("Creating business entity with data:");
    console.log(JSON.stringify(entityData, null, 2));
    console.log("\n");

    // Create entity and get the ID
    const entityId = await routefusionService.createBusinessEntity(entityData);

    console.log("\n✅ Successfully created business entity!");
    console.log("Entity ID:", entityId);

    // Fetch the full entity details
    console.log("\nFetching full entity details...");
    const businessEntity = await routefusionService.getEntity(entityId);

    console.log("\nFull Entity Details:");
    console.log(JSON.stringify(businessEntity, null, 2));
    console.log("\nBusiness Entity ID:", businessEntity.id);
    console.log("Business Entity Name:", businessEntity.business_name || businessEntity.entity_name);
    console.log("Business Entity Country:", businessEntity.country);
    if (businessEntity.state) {
      console.log("Business Entity State:", businessEntity.state);
    }

    return businessEntity;
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
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});