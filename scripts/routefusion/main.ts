import { RoutefusionService } from "./routefusion.service";
import { CreateBusinessEntityInput, BusinessType, CreateUserInput, UUID, EntityType } from "./types/entity.types";
import { FileEnum } from "./types/entity.types";
import { CreateRepresentativeInput, RepresentativeResponsibility, UpdateRepresentativeInput } from "./types/service.types";
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

async function testCreateRepresentative(entityId: string) {
  try {
    console.log("Testing Routefusion Service - Create Representative");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();

    const representativeData: CreateRepresentativeInput = {
      entity_id: entityId as UUID,
      representative: {
        // Personal Information
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        phone: "573563525448",
        date_of_birth: "1985-05-15T00:00:00Z",
        citizenship: "CO",

        // Address Information
        residential_address: "456 Oak Avenue",
        residential_address2: "Apt 5B",
        residential_city: "Bogota",
        residential_state_province_region: "Cundinamarca",
        residential_postal_code: "510004",
        residential_country: "CO",

        // Role and Responsibilities
        responsibility: RepresentativeResponsibility.DIRECTOR,
        is_signer: true,
        job_title: "Chief Executive Officer",
        ownership_percentage: 50.5,

        // Document Information
        document_number: "DL123456789",
        document_issue_date: "2020-01-15T00:00:00Z",
        document_expiration_date: "2033-01-15T00:00:00Z",
        passport_number: "P123456789",

        // Tax Information
        tax_number: "1234567890",
      },
    };

    const representativeId = await routefusionService.createRepresentative(representativeData);
    console.log("\n✅ Successfully created representative!");
    console.log("Representative ID:", representativeId);
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

async function testUpdateRepresentative(representativeId: string) {
  try {
    console.log("Testing Routefusion Service - Update Representative");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();

    const updateData: UpdateRepresentativeInput = {
      updateRepresentativeId: representativeId as UUID,
      representative: {
        // Personal Information
        //first_name: "Jane",
        //last_name: "Smith-Updated",
        //email: "jane.smith.updated@example.com",
        //phone: "+1234567891",
        //date_of_birth: "1985-05-15T00:00:00Z",
        //citizenship: "US",

        // Address Information
        //residential_address: "789 Pine Street",
        //residential_address2: "Suite 200",
        //residential_city: "San Francisco",
        //residential_state_province_region: "CA",
        //residential_postal_code: "94102",
        //residential_country: "US",

        // Role and Responsibilities
        //responsibility: RepresentativeResponsibility.DIRECTOR, // Can be: "ultimate_beneficial_owner", "authorized rep", "director"
        //is_signer: true,
        //job_title: "Chief Technology Officer",
        //ownership_percentage: 30.0,

        // Document Information (using document_* fields for update)
        //document_number: "DL987654321",
        //document_issue_date: "2021-03-20T00:00:00Z",
        document_expiration_date: "2026-03-20T00:00:00Z",
        //passport_number: "P987654321",

        // Tax Information
        //tax_number: "987-65-4321",
      },
    };

    const result = await routefusionService.updateRepresentative(updateData);
    console.log("\n✅ Successfully updated representative!");
    console.log("Update Result:", result);
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

async function testDeleteRepresentative(representativeId: string) {
  try {
    console.log("Testing Routefusion Service - Delete Representative");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();
    const result = await routefusionService.deleteRepresentative(representativeId);
    console.log("\n✅ Successfully deleted representative!");
    console.log("Representative ID:", representativeId);
    console.log("Delete Result:", result);
    console.log("\nNote: Representatives can only be deleted before finalizing the entity.");
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

async function testUploadRepresentativeDocument(representativeId: string) {
  try {
    console.log("Testing Routefusion Service - Upload Representative Document");
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

    const document = await routefusionService.uploadRepresentativeDocument({
      representativeId: representativeId as UUID,
      file: file,
      file_enum: FileEnum.PASSPORT,
    });
    console.log("\n✅ Successfully uploaded representative document!");
    console.log("Representative ID:", representativeId);
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

async function testGetEntityRequiredFields() {
  try {
    console.log("Testing Routefusion Service - Get Entity Required Fields");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();
    const requiredFields = await routefusionService.getEntityRequiredFields({
      country: "CO",
      entity_type: EntityType.BUSINESS,
      business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
    });
    console.log("\n✅ Successfully got entity required fields!");
    console.log("Required Fields:", JSON.stringify(requiredFields, null, 2));
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

async function testGetRepresentativeRequiredFields() {
  try {
    console.log("Testing Routefusion Service - Get Representative Required Fields");
    console.log("-----------------------------------------------------");
    const routefusionService = new RoutefusionService();
    const requiredFields = await routefusionService.getRepresentativeRequiredFields({
      country: "US",
    });
    console.log("\n✅ Successfully got representative required fields!");
    console.log("Required Fields:", JSON.stringify(requiredFields, null, 2));
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

/**
 * Test the complete onboarding flow:
 * 1. query entityRequiredFields
 * 2. mutation createBusinessEntity
 * 3. add Business document
 * 4. query representativeRequiredFields
 * 5. mutation createRepresentative
 * 6. add representative document
 * 7. mutation finalizeEntity
 */
async function testCompleteOnboardingFlow() {
  try {
    console.log("Testing Complete Onboarding Flow");
    console.log("==================================");
    const routefusionService = new RoutefusionService();

    // Step 1: Query entity required fields
    console.log("\n📋 Step 1: Getting entity required fields...");
    const entityRequiredFields = await routefusionService.getEntityRequiredFields({
      country: "CO",
      entity_type: EntityType.BUSINESS,
      business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
    });
    console.log("✅ Entity required fields retrieved");
    console.log("   Requires representatives:", entityRequiredFields.requires_representatives);
    console.log("   Required documents:", JSON.stringify(entityRequiredFields.documents, null, 2));
    console.log("   Required fields:", entityRequiredFields.fields.map(f => f.variable).join(", "));

    // Step 2: Create business entity
    console.log("\n🏢 Step 2: Creating business entity...");
    const entityData: CreateBusinessEntityInput = {
      email: `test${Date.now()}@example.com`,
      phone: "3563525448",
      tax_number: "1234567890",
      contact_first_name: "John",
      contact_last_name: "Doe",
      business_name: "Test Business LLC",
      business_address1: "123 Main St",
      business_country: "CO",
      business_city: "Bogota",
      business_state_province_region: "Cundinamarca",
      business_postal_code: "510004",
      business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
      accept_terms_and_conditions: true,
      naics_code: "111111",
      business_description: "Test business description",
      trading_symbol: "TEST",
      owned_by: "John Doe",
      incorporation_date: new Date().toISOString(),
      website_url: "https://www.example.com",
    };
    const entityId = await routefusionService.createBusinessEntity(entityData);
    console.log("✅ Business entity created with ID:", entityId);

    // Step 3: Upload business document
    console.log("\n📄 Step 3: Uploading business document...");
    const projectRoot = path.resolve(__dirname, "../..");
    const filePath = path.join(projectRoot, "test-document.txt");

    if (!fs.existsSync(filePath)) {
      console.log("⚠️  Test file not found, skipping document upload");
    } else {
      const fileBuffer = fs.readFileSync(filePath);
      const file = new Blob([fileBuffer], { type: "text/plain" });
      const document = await routefusionService.uploadEntityDocument({
        entityId: entityId as UUID,
        file: file,
        file_enum: FileEnum.PROOF_OF_REGISTRATION,
      });
      console.log("✅ Business document uploaded:", document.filename);
    }

    // Step 4: Query representative required fields (if representatives are required)
    if (entityRequiredFields.requires_representatives) {
      console.log("\n👤 Step 4: Getting representative required fields...");
      const repRequiredFields = await routefusionService.getRepresentativeRequiredFields({
        country: "CO",
      });
      console.log("✅ Representative required fields retrieved");
      console.log("   Required documents:", JSON.stringify(repRequiredFields.documents, null, 2));
      console.log("   Required fields:", repRequiredFields.fields.map(f => f.variable).join(", "));

      // Step 5: Create representative
      console.log("\n👤 Step 5: Creating representative...");
      const representativeData: CreateRepresentativeInput = {
        entity_id: entityId as UUID,
        representative: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "3563525448",
          date_of_birth: "1985-05-15T00:00:00Z",
          citizenship: "CO",
          residential_address: "456 Oak Avenue",
          residential_address2: "Apt 5B",
          residential_city: "Bogota",
          residential_state_province_region: "Cundinamarca",
          residential_postal_code: "510004",
          residential_country: "CO",
          responsibility: RepresentativeResponsibility.DIRECTOR,
          is_signer: true,
          job_title: "Chief Executive Officer",
          ownership_percentage: 50.5,
          document_number: "DL123456789",
          document_issue_date: "2020-01-15T00:00:00Z",
          document_expiration_date: "2033-01-15T00:00:00Z",
          passport_number: "P123456789",
          tax_number: "1234567890",
        },
      };
      const representativeId = await routefusionService.createRepresentative(representativeData);
      console.log("✅ Representative created with ID:", representativeId);

      // Step 6: Upload representative document
      console.log("\n📄 Step 6: Uploading representative document...");
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const file = new Blob([fileBuffer], { type: "text/plain" });
        const repDocument = await routefusionService.uploadRepresentativeDocument({
          representativeId: representativeId as UUID,
          file: file,
          file_enum: FileEnum.PASSPORT,
        });
        console.log("✅ Representative document uploaded:", repDocument.filename);
      } else {
        console.log("⚠️  Test file not found, skipping representative document upload");
      }
    } else {
      console.log("\n⚠️  Step 4-6: Skipped (representatives not required for this entity type)");
    }

    // Step 7: Finalize entity
    console.log("\n✅ Step 7: Finalizing entity...");
    const finalizedEntityId = await routefusionService.finalizeEntity(entityId);
    console.log("✅ Entity finalized successfully!");
    console.log("   Finalized Entity ID:", finalizedEntityId);
    console.log("\n🎉 Complete onboarding flow finished successfully!");
    console.log("   Note: The entity will now move to a pending state for compliance review.");

    return {
      entityId,
      finalized: true,
    };
  } catch (error) {
    console.error("\n❌ Error occurred during onboarding flow:");
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
  const representativeId = 'c479de98-7420-4a64-b7d3-45889e66d955';
  const businessId = '34354c4e-d88f-458a-b9ce-45772447730d';


  //await testCreateBusinessEntity(); //4354c4e-d88f-458a-b9ce-45772447730d
  // await testCreateUser();
  // await testGetUser();
  // await testGetBusinessEntity();
  // await testCreateWallet("34354c4e-d88f-458a-b9ce-45772447730d");
  // await testUploadEntityDocument("34354c4e-d88f-458a-b9ce-45772447730d");
  //await testFinalizeEntity("34354c4e-d88f-458a-b9ce-45772447730d");
  //await testCreateRepresentative("c50e4a28-d19d-4b09-a09d-6f59977c1bc7" || businessId);
  //await testUpdateRepresentative(representativeId);
  //await testDeleteRepresentative(representativeId);
  //await testUploadRepresentativeDocument(representativeId);
  await testGetEntityRequiredFields();
  //await testGetRepresentativeRequiredFields();

  // Complete onboarding flow test
  //await testCompleteOnboardingFlow();

}

main()
// .catch((error) => {
//   console.error("Fatal error:", error);
//   process.exit(1);
// });