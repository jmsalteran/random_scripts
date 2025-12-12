import { RoutefusionService } from "./routefusion.service";
import { CreateBusinessEntityInput, BusinessType, CreateUserInput, UUID, EntityType } from "./types/entity.types";
import { FileEnum } from "./types/entity.types";
import { CreateRepresentativeInput, RepresentativeResponsibility, UpdateRepresentativeInput, CreatePersonalBeneficiaryInput, CreateBusinessBeneficiaryInput } from "./types/service.types";
import * as fs from "fs";
import * as path from "path";
import { faker } from "@faker-js/faker";

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

/**
 * User configuration for test flows
 */
const USER_CONFIG = {
  defaultUserId: "b5fa316d-7d79-442f-a139-faaa7cfa80de",
  createNewUser: true,
  userData: {
    first_name: "Test",
    last_name: "User",
    admin: false,
    send_invite_email: false,
  },
};

/**
 * Business entity configuration
 */
const BUSINESS_ENTITY_CONFIG = {
  country: "CO",
  business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
  entity_type: EntityType.BUSINESS,
  email: "test@example.com", // Base email, will have timestamp added
  address: {
    address1: "123 Main St",
    address2: "Suite 100",
    city: "Bogota",
    state_province_region: "Cundinamarca",
    postal_code: "510004",
    country: "CO",
  },
  contact: {
    phone: "+573563525448",
    phone_country: "CO",
    contact_first_name: "John",
    contact_last_name: "Doe",
  },
  business: {
    tax_number: "1234567890",
    naics_code: "111111",
    business_description: "Test business description",
    trading_symbol: "TEST",
    owned_by: "John Doe",
    website_url: "https://www.example.com",
  },
  useFakerForBusinessName: true,
};

/**
 * Representative configuration
 */
const REPRESENTATIVE_CONFIG = {
  personal: {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+573563525448",
    date_of_birth: "1985-05-15T00:00:00Z",
    citizenship: "CO",
  },
  address: {
    residential_address: "456 Oak Avenue",
    residential_address2: "Apt 5B",
    residential_city: "Bogota",
    residential_state_province_region: "Cundinamarca",
    residential_postal_code: "510004",
    residential_country: "CO",
  },
  role: {
    responsibility: RepresentativeResponsibility.DIRECTOR,
    is_signer: true,
    job_title: "Chief Executive Officer",
    ownership_percentage: 50.5,
  },
  documents: {
    document_number: "DL123456789",
    document_issue_date: "2020-01-15T00:00:00Z",
    document_expiration_date: "2033-01-15T00:00:00Z",
    passport_number: "P123456789",
    tax_number: "1234567890",
  },
};

/**
 * Personal beneficiary configuration
 */
const PERSONAL_BENEFICIARY_CONFIG = {
  corridor: {
    bank_country: "CO",
    currency: "USD",
    beneficiary_country: "CO",
  },
  personal: {
    first_name: "Jane",
    last_name: "Smith",
    email: "beneficiary.personal@example.com",
    phone: "+573563525448",
    phone_country: "CO",
    date_of_birth: "1990-06-15T00:00:00Z",
  },
  address: {
    address1: "789 Personal Street",
    address2: "Apt 3C",
    city: "Bogota",
    state_province_region: "Cundinamarca",
    postal_code: "510004",
    country: "CO",
  },
  bank: {
    name_on_bank_account: "Jane Smith",
    swift_bic: "COLOCO33",
    account_type: "checking" as const,
    account_number: "1234567890",
    routing_code: "123456789",
    bank_name: "Test Bank",
    branch_name: "Main Branch",
    bank_address1: "456 Bank Street",
    bank_address2: "Suite 200",
    bank_city: "Bogota",
    bank_state_province_region: "Cundinamarca",
    bank_postal_code: "510004",
    bank_country: "CO",
  },
  tax: {
    tax_number: "9876543210",
    tax_number_expiration: "2030-12-31T00:00:00Z",
  },
};

/**
 * Business beneficiary configuration
 */
const BUSINESS_BENEFICIARY_CONFIG = {
  corridor: {
    bank_country: "US",
    currency: "USD",
    beneficiary_country: "US",
  },
  business: {
    email: "beneficiary.business@example.com",
    phone: "+15551234567",
    phone_country: "US",
    tax_number: "12-3456789",
  },
  address: {
    business_address1: "789 Business Avenue",
    business_address2: "Suite 500",
    business_city: "New York",
    business_state_province_region: "NY",
    business_postal_code: "10001",
    business_country: "US",
  },
  bank: {
    swift_bic: "CHASUS33",
    account_type: "checking" as const,
    account_number: "9876543210",
    routing_code: "021000021",
    bank_name: "Test Bank",
    branch_name: "Business Branch",
    bank_address1: "456 Bank Street",
    bank_address2: "Suite 300",
    bank_city: "New York",
    bank_state_province_region: "NY",
    bank_postal_code: "10001",
    bank_country: "US",
  },
  useFakerForBusinessName: true,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build business entity data from configuration
 */
function buildBusinessEntityData(): CreateBusinessEntityInput {
  const businessName = BUSINESS_ENTITY_CONFIG.useFakerForBusinessName
    ? faker.company.name()
    : "Test Business LLC";
  const email = BUSINESS_ENTITY_CONFIG.email.replace('@', `${Date.now()}@`);

  return {
    email,
    phone: BUSINESS_ENTITY_CONFIG.contact.phone,
    phone_country: BUSINESS_ENTITY_CONFIG.contact.phone_country,
    tax_number: BUSINESS_ENTITY_CONFIG.business.tax_number,
    contact_first_name: BUSINESS_ENTITY_CONFIG.contact.contact_first_name,
    contact_last_name: BUSINESS_ENTITY_CONFIG.contact.contact_last_name,
    business_name: businessName,
    business_address1: BUSINESS_ENTITY_CONFIG.address.address1,
    business_address2: BUSINESS_ENTITY_CONFIG.address.address2,
    business_country: BUSINESS_ENTITY_CONFIG.address.country,
    business_city: BUSINESS_ENTITY_CONFIG.address.city,
    business_state_province_region: BUSINESS_ENTITY_CONFIG.address.state_province_region,
    business_postal_code: BUSINESS_ENTITY_CONFIG.address.postal_code,
    business_type: BUSINESS_ENTITY_CONFIG.business_type,
    accept_terms_and_conditions: true,
    naics_code: BUSINESS_ENTITY_CONFIG.business.naics_code,
    business_description: BUSINESS_ENTITY_CONFIG.business.business_description,
    trading_symbol: BUSINESS_ENTITY_CONFIG.business.trading_symbol,
    owned_by: BUSINESS_ENTITY_CONFIG.business.owned_by,
    incorporation_date: new Date().toISOString(),
    website_url: BUSINESS_ENTITY_CONFIG.business.website_url,
  };
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testCreateBusinessEntity() {
  try {
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

    console.log("Business entity created. Entity ID:", entityId);

    // Fetch the full entity details
  } catch (error) {
    throw error;
  }
}

async function testGetBusinessEntity() {
  try {
    const businessId = "63cdba52-cc6d-450e-9a20-83c9b40a251e";
    const routefusionService = new RoutefusionService();
    const entity = await routefusionService.getBusinessEntity(businessId);
    console.log("Business entity retrieved:", JSON.stringify(entity, null, 2));
  } catch (error) {
    throw error;
  }
}

async function testCreateUser() {
  try {
    const routefusionService = new RoutefusionService();
    const userData: CreateUserInput = {
      email: `test${Date.now()}@example.com`,
      first_name: "John",
      last_name: "Doe",
      admin: false,
      send_invite_email: false,
    };
    const userId = await routefusionService.createUser(userData);
    console.log("User created. User ID:", userId);
  } catch (error) {
    console.error("\nError occurred during test:");
  }
}

async function testGetUser() {
  try {
    const routefusionService = new RoutefusionService();
    const userId = "b5fa316d-7d79-442f-a139-faaa7cfa80de";
    const user = await routefusionService.getUser(userId);
    console.log("User retrieved:", JSON.stringify(user, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
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
    const businessId = businessIdParam || '63cdba52-cc6d-450e-9a20-83c9b40a251e' as UUID;
    const routefusionService = new RoutefusionService();
    const wallet = await routefusionService.createWallet({
      entityId: businessId as UUID,
      currency: 'USD',
    });
    console.log("Wallet created:", JSON.stringify(wallet, null, 2));
  } catch (error) {
    throw error;
  }
}

async function testAddBalanceToWallet(walletIdParam: string, amount?: string) {
  try {
    const walletId = walletIdParam || 'your-wallet-id-here' as UUID;
    const balanceAmount = amount || '100.00';
    const routefusionService = new RoutefusionService();
    const result = await routefusionService.addBalanceToWallet({
      wallet_id: walletId as UUID,
      amount: balanceAmount,
    });
    console.log(`Balance added to wallet ${walletId}:`, result);
    console.log(`Amount added: ${balanceAmount}`);
  } catch (error) {
    console.error("\nError occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function testCreateTransfer(
  userIdParam: string,
  entityIdParam: string,
  beneficiaryIdParam: string,
  walletIdParam?: string
) {
  try {
    const userId = userIdParam || 'your-user-id-here' as UUID;
    const entityId = entityIdParam || 'your-entity-id-here' as UUID;
    const beneficiaryId = beneficiaryIdParam || 'your-beneficiary-id-here' as UUID;
    const walletId = walletIdParam as UUID | undefined;

    const routefusionService = new RoutefusionService();
    const transferId = await routefusionService.createTransfer({
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      beneficiary_id: beneficiaryId as UUID,
      purpose_of_payment: "Payment for services",
      source_amount: "100.00",
      wallet_id: walletId,
      reference: `Test transfer ${Date.now()}`,
    });
    console.log("Transfer created. Transfer ID:", transferId);
    console.log("Note: Use finalizeTransfer to initiate the transfer.");
  } catch (error) {
    console.error("\nError occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function testUploadEntityDocument(entityId: string) {
  try {
    const routefusionService = new RoutefusionService();

    // Read the test text file - resolve path from project root
    const projectRoot = path.resolve(__dirname, "../..");
    const filePath = path.join(projectRoot, "test-document.txt");

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Create a Blob from the buffer (Node.js 18+ has native Blob support)
    const file = new Blob([fileBuffer], { type: "text/plain" });

    const document = await routefusionService.uploadEntityDocument({
      entityId: entityId as UUID,
      file: file,
      file_enum: FileEnum.PASSPORT,
    });
    console.log("Entity document uploaded:", JSON.stringify(document, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
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
    const routefusionService = new RoutefusionService();
    const finalizedEntityId = await routefusionService.finalizeEntity(entityId);
    console.log("Entity finalized. Entity ID:", finalizedEntityId);
    console.log("Note: The entity will immediately move to a pending state after finalizing.");
  } catch (error) {
    console.error("\nError occurred during test:");
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
    console.log("Representative created. Representative ID:", representativeId);
  } catch (error) {
    console.error("\nError occurred during test:");
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
    console.log("Representative updated:", result);
  } catch (error) {
    console.error("\nError occurred during test:");
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
    const routefusionService = new RoutefusionService();
    const result = await routefusionService.deleteRepresentative(representativeId);
    console.log("Representative deleted. ID:", representativeId, "Result:", result);
  } catch (error) {
    console.error("\nError occurred during test:");
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
    const routefusionService = new RoutefusionService();

    // Read the test text file - resolve path from project root
    const projectRoot = path.resolve(__dirname, "../..");
    const filePath = path.join(projectRoot, "test-document.txt");

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Create a Blob from the buffer (Node.js 18+ has native Blob support)
    const file = new Blob([fileBuffer], { type: "text/plain" });

    const document = await routefusionService.uploadRepresentativeDocument({
      representativeId: representativeId as UUID,
      file: file,
      file_enum: FileEnum.PASSPORT,
    });
    console.log("Representative document uploaded. ID:", representativeId, "Document:", JSON.stringify(document, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
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
    const routefusionService = new RoutefusionService();
    const requiredFields = await routefusionService.getEntityRequiredFields({
      country: "CO",
      entity_type: EntityType.BUSINESS,
      business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
    });
    console.log("Entity required fields:", JSON.stringify(requiredFields, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
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
    const routefusionService = new RoutefusionService();
    const requiredFields = await routefusionService.getRepresentativeRequiredFields({
      country: "US",
    });
    console.log("Representative required fields:", JSON.stringify(requiredFields, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
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
 * 8. Create personal beneficiary (with validation)
 * 9. Create business beneficiary (with validation)
 */
async function testCompleteOnboardingFlow() {
  try {
    console.log("Testing Complete Onboarding Flow");
    console.log("==================================");
    const routefusionService = new RoutefusionService();

    // Step 1: Create or get user
    console.log("\nStep 1: Creating user...");
    let userId: string;
    if (USER_CONFIG.createNewUser) {
      try {
        const userData: CreateUserInput = {
          email: `test${Date.now()}@example.com`,
          ...USER_CONFIG.userData,
        };
        const userResult = await routefusionService.createUser(userData);
        userId = userResult.routefusionUserID;
        console.log("User created with ID:", userId);
      } catch (error) {
        console.log("User creation failed, using default user ID");
        userId = USER_CONFIG.defaultUserId;
      }
    } else {
      userId = USER_CONFIG.defaultUserId;
      console.log("Using default user ID:", userId);
    }

    // Step 2: Create business entity
    console.log("\nStep 2: Creating business entity...");
    const entityData = buildBusinessEntityData();

    const validationResult = await routefusionService.validateBusinessEntityDataToSubmit(
      entityData,
      BUSINESS_ENTITY_CONFIG.country,
      BUSINESS_ENTITY_CONFIG.entity_type,
      BUSINESS_ENTITY_CONFIG.business_type
    );

    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.errors);
      return;
    }

    const entityId = await routefusionService.createBusinessEntity(entityData);
    console.log("Business entity created with ID:", entityId);

    // Step 3: Upload business document
    console.log("\nStep 3: Uploading business document...");
    const projectRoot = path.resolve(__dirname, "../..");
    const filePath = path.join(projectRoot, "test-document.txt");

    if (!fs.existsSync(filePath)) {
      console.log("Test file not found, skipping document upload");
    } else {
      const fileBuffer = fs.readFileSync(filePath);
      const file = new Blob([fileBuffer], { type: "text/plain" });
      const fileTypes = [FileEnum.PROOF_OF_REGISTRATION, FileEnum.PROOF_OF_OWNERSHIP, FileEnum.BANK_STATEMENT];
      for (const fileType of fileTypes) {
        const document = await routefusionService.uploadEntityDocument({
          entityId: entityId as UUID,
          file: file,
          file_enum: fileType,
        });
        console.log("Business document uploaded:", document.filename);
      }
    }

    // Step 5: Create representative
    console.log("\nStep 5: Creating representative...");
    const representativeData: CreateRepresentativeInput = {
      entity_id: entityId as UUID,
      representative: {
        ...REPRESENTATIVE_CONFIG.personal,
        ...REPRESENTATIVE_CONFIG.address,
        ...REPRESENTATIVE_CONFIG.role,
        ...REPRESENTATIVE_CONFIG.documents,
      },
    };
    const validationResultRepresentative = await routefusionService.validateRepresentativeDataToSubmit(
      representativeData.representative,
      BUSINESS_ENTITY_CONFIG.country,
      BUSINESS_ENTITY_CONFIG.entity_type,
      BUSINESS_ENTITY_CONFIG.business_type
    );
    if (!validationResultRepresentative.success) {
      console.log("Validation failed:", validationResultRepresentative.errors);
      return;
    }
    const representativeId = await routefusionService.createRepresentative(representativeData);
    console.log("Representative created with ID:", representativeId);

    // Step 6: Upload representative document
    console.log("\nStep 6: Uploading representative document...");
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const file = new Blob([fileBuffer], { type: "text/plain" });
      const fileTypes = [FileEnum.PASSPORT, FileEnum.PROOF_OF_ADDRESS, FileEnum.LIVENESS_CHECK];
      for (const fileType of fileTypes) {
        const repDocument = await routefusionService.uploadRepresentativeDocument({
          representativeId: representativeId as UUID,
          file: file,
          file_enum: fileType,
        });
        console.log("Representative document uploaded:", repDocument.filename);
      }
    } else {
      console.log("Test file not found, skipping representative document upload");
    }

    // Step 7: Finalize entity
    console.log("\nStep 7: Finalizing entity...");
    const finalizedEntityId = await routefusionService.finalizeEntity(entityId);
    console.log("Entity finalized. ID:", finalizedEntityId);

    // Step 8: Create personal beneficiary with validation
    console.log("\nStep 8: Creating personal beneficiary...");

    // Get required fields first to understand what's needed
    const personalBeneficiaryRequiredFields = await routefusionService.getBeneficiaryRequiredFields({
      bank_country: PERSONAL_BENEFICIARY_CONFIG.corridor.bank_country,
      currency: PERSONAL_BENEFICIARY_CONFIG.corridor.currency,
      beneficiary_country: PERSONAL_BENEFICIARY_CONFIG.corridor.beneficiary_country,
    });
    console.log("Personal beneficiary required fields:", JSON.stringify(personalBeneficiaryRequiredFields.personal, null, 2));

    const personalBeneficiaryEmail = PERSONAL_BENEFICIARY_CONFIG.personal.email.replace('@', `${Date.now()}@`);
    const personalBeneficiaryData: CreatePersonalBeneficiaryInput = {
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      email: personalBeneficiaryEmail,
      phone: PERSONAL_BENEFICIARY_CONFIG.personal.phone,
      phone_country: PERSONAL_BENEFICIARY_CONFIG.personal.phone_country,
      first_name: PERSONAL_BENEFICIARY_CONFIG.personal.first_name,
      last_name: PERSONAL_BENEFICIARY_CONFIG.personal.last_name,
      address1: PERSONAL_BENEFICIARY_CONFIG.address.address1,
      address2: PERSONAL_BENEFICIARY_CONFIG.address.address2,
      city: PERSONAL_BENEFICIARY_CONFIG.address.city,
      state_province_region: PERSONAL_BENEFICIARY_CONFIG.address.state_province_region,
      postal_code: PERSONAL_BENEFICIARY_CONFIG.address.postal_code,
      country: PERSONAL_BENEFICIARY_CONFIG.address.country as any,
      tax_number: PERSONAL_BENEFICIARY_CONFIG.tax.tax_number,
      name_on_bank_account: PERSONAL_BENEFICIARY_CONFIG.bank.name_on_bank_account,
      swift_bic: PERSONAL_BENEFICIARY_CONFIG.bank.swift_bic,
      account_type: PERSONAL_BENEFICIARY_CONFIG.bank.account_type,
      account_number: PERSONAL_BENEFICIARY_CONFIG.bank.account_number,
      routing_code: PERSONAL_BENEFICIARY_CONFIG.bank.routing_code,
      currency: PERSONAL_BENEFICIARY_CONFIG.corridor.currency as any,
      bank_name: PERSONAL_BENEFICIARY_CONFIG.bank.bank_name,
      branch_name: PERSONAL_BENEFICIARY_CONFIG.bank.branch_name,
      bank_address1: PERSONAL_BENEFICIARY_CONFIG.bank.bank_address1,
      bank_address2: PERSONAL_BENEFICIARY_CONFIG.bank.bank_address2,
      bank_city: PERSONAL_BENEFICIARY_CONFIG.bank.bank_city,
      bank_state_province_region: PERSONAL_BENEFICIARY_CONFIG.bank.bank_state_province_region,
      bank_postal_code: PERSONAL_BENEFICIARY_CONFIG.bank.bank_postal_code,
      bank_country: PERSONAL_BENEFICIARY_CONFIG.bank.bank_country as any,
      tax_number_expiration: PERSONAL_BENEFICIARY_CONFIG.tax.tax_number_expiration,
      date_of_birth: PERSONAL_BENEFICIARY_CONFIG.personal.date_of_birth,
    };

    // Validate personal beneficiary data
    const personalValidationResult = await routefusionService.validatePersonalBeneficiaryDataToSubmit(
      personalBeneficiaryData,
      PERSONAL_BENEFICIARY_CONFIG.corridor.bank_country,
      PERSONAL_BENEFICIARY_CONFIG.corridor.currency,
      PERSONAL_BENEFICIARY_CONFIG.corridor.beneficiary_country
    );

    if (!personalValidationResult.success) {
      console.log("Personal beneficiary validation failed:", personalValidationResult.errors);
      console.log("Attempting to create anyway...");
    } else {
      console.log("Personal beneficiary validation passed");
    }

    const personalBeneficiaryId = await routefusionService.createPersonalBeneficiary(personalBeneficiaryData);
    console.log("Personal beneficiary created with ID:", personalBeneficiaryId);

    // Step 9: Create business beneficiary with validation
    console.log("\nStep 9: Creating business beneficiary...");

    // Get required fields first to understand what's needed
    const businessBeneficiaryRequiredFields = await routefusionService.getBeneficiaryRequiredFields({
      bank_country: BUSINESS_BENEFICIARY_CONFIG.corridor.bank_country,
      currency: BUSINESS_BENEFICIARY_CONFIG.corridor.currency,
      beneficiary_country: BUSINESS_BENEFICIARY_CONFIG.corridor.beneficiary_country,
    });
    console.log("Business beneficiary required fields:", JSON.stringify(businessBeneficiaryRequiredFields.business, null, 2));

    const beneficiaryBusinessName = BUSINESS_BENEFICIARY_CONFIG.useFakerForBusinessName
      ? faker.company.name()
      : "Beneficiary Business Corp";
    const businessBeneficiaryEmail = BUSINESS_BENEFICIARY_CONFIG.business.email.replace('@', `${Date.now()}@`);
    const businessBeneficiaryData: CreateBusinessBeneficiaryInput = {
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      email: businessBeneficiaryEmail,
      phone: BUSINESS_BENEFICIARY_CONFIG.business.phone,
      phone_country: BUSINESS_BENEFICIARY_CONFIG.business.phone_country,
      business_name: beneficiaryBusinessName,
      business_address1: BUSINESS_BENEFICIARY_CONFIG.address.business_address1,
      business_address2: BUSINESS_BENEFICIARY_CONFIG.address.business_address2,
      business_city: BUSINESS_BENEFICIARY_CONFIG.address.business_city,
      business_state_province_region: BUSINESS_BENEFICIARY_CONFIG.address.business_state_province_region,
      business_postal_code: BUSINESS_BENEFICIARY_CONFIG.address.business_postal_code,
      business_country: BUSINESS_BENEFICIARY_CONFIG.address.business_country as any,
      tax_number: BUSINESS_BENEFICIARY_CONFIG.business.tax_number,
      name_on_bank_account: beneficiaryBusinessName,
      swift_bic: BUSINESS_BENEFICIARY_CONFIG.bank.swift_bic,
      account_type: BUSINESS_BENEFICIARY_CONFIG.bank.account_type,
      account_number: BUSINESS_BENEFICIARY_CONFIG.bank.account_number,
      routing_code: BUSINESS_BENEFICIARY_CONFIG.bank.routing_code,
      currency: BUSINESS_BENEFICIARY_CONFIG.corridor.currency as any,
      bank_name: BUSINESS_BENEFICIARY_CONFIG.bank.bank_name,
      branch_name: BUSINESS_BENEFICIARY_CONFIG.bank.branch_name,
      bank_address1: BUSINESS_BENEFICIARY_CONFIG.bank.bank_address1,
      bank_address2: BUSINESS_BENEFICIARY_CONFIG.bank.bank_address2,
      bank_city: BUSINESS_BENEFICIARY_CONFIG.bank.bank_city,
      bank_state_province_region: BUSINESS_BENEFICIARY_CONFIG.bank.bank_state_province_region,
      bank_postal_code: BUSINESS_BENEFICIARY_CONFIG.bank.bank_postal_code,
      bank_country: BUSINESS_BENEFICIARY_CONFIG.bank.bank_country as any,
    };

    // Validate business beneficiary data
    const businessValidationResult = await routefusionService.validateBusinessBeneficiaryDataToSubmit(
      businessBeneficiaryData,
      BUSINESS_BENEFICIARY_CONFIG.corridor.bank_country,
      BUSINESS_BENEFICIARY_CONFIG.corridor.currency,
      BUSINESS_BENEFICIARY_CONFIG.corridor.beneficiary_country
    );

    if (!businessValidationResult.success) {
      console.log("Business beneficiary validation failed:", businessValidationResult.errors);
      console.log("Attempting to create anyway...");
    } else {
      console.log("Business beneficiary validation passed");
    }

    const businessBeneficiaryId = await routefusionService.createBusinessBeneficiary(businessBeneficiaryData);
    console.log("Business beneficiary created with ID:", businessBeneficiaryId);

    console.log("\nComplete onboarding flow finished successfully!");
    console.log("================================================");

    return {
      entityId,
      userId,
      representativeId,
      personalBeneficiaryId,
      businessBeneficiaryId,
      finalized: true,
    };
  } catch (error) {
    console.error("\nError occurred during onboarding flow:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function testValidateBusinessEntityDataToSubmit() {
  try {
    const input: CreateBusinessEntityInput = {
      // Optional fields
      // user_id: "b5fa316d-7d79-442f-a139-faaa7cfa80de", // Optional: UUID of the user creating the entity
      phone: "52536252", // Optional: Contact phone number
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
    const country = "CO";
    const entity_type = EntityType.BUSINESS;
    const business_type = BusinessType.LIMITED_LIABILITY_COMPANY;
    const routefusionService = new RoutefusionService();
    const result = await routefusionService.validateBusinessEntityDataToSubmit(input, country, entity_type, business_type);
    console.log("Validation result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
  }
}


async function testValidateRepresentativeDataToSubmit(entityId: string) {
  try {
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

    const country = "CO";
    const entity_type = EntityType.BUSINESS;
    const business_type = BusinessType.LIMITED_LIABILITY_COMPANY;
    const routefusionService = new RoutefusionService();
    const result = await routefusionService.validateRepresentativeDataToSubmit(representativeData.representative, country, entity_type, business_type);
    console.log("Validation result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\nError occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
  }
}

async function testCreatePersonalBeneficiary(userIdParam?: string, entityIdParam?: string) {
  try {
    const userId = userIdParam || 'b5fa316d-7d79-442f-a139-faaa7cfa80de' as UUID;
    const entityId = entityIdParam || '34354c4e-d88f-458a-b9ce-45772447730d' as UUID;
    const routefusionService = new RoutefusionService();

    const beneficiaryData: CreatePersonalBeneficiaryInput = {
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      email: "beneficiary.personal@example.com",
      phone: "+573563525448",
      phone_country: "CO",
      first_name: "Jane",
      last_name: "Smith",
      address1: "789 Personal Street",
      address2: "Apt 3C",
      city: "Bogota",
      state_province_region: "Cundinamarca",
      postal_code: "510004",
      country: "CO" as any,
      tax_number: "9876543210",
      name_on_bank_account: "Jane Smith",
      swift_bic: "COLOCO33",
      account_type: "checking",
      account_number: "1234567890",
      routing_code: "123456789",
      currency: "USD" as any,
      bank_name: "Test Bank",
      branch_name: "Main Branch",
      bank_address1: "456 Bank Street",
      bank_address2: "Suite 200",
      bank_city: "Bogota",
      bank_state_province_region: "Cundinamarca",
      bank_postal_code: "510004",
      bank_country: "CO" as any,
      tax_number_expiration: "2030-12-31T00:00:00Z",
      date_of_birth: "1990-06-15T00:00:00Z",
    };

    const beneficiaryId = await routefusionService.createPersonalBeneficiary(beneficiaryData);
    console.log("Personal beneficiary created. Beneficiary ID:", beneficiaryId);
    return beneficiaryId;
  } catch (error) {
    console.error("\nError occurred during test:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

async function testCreateBusinessBeneficiary(userIdParam?: string, entityIdParam?: string) {
  try {
    const userId = userIdParam || 'b5fa316d-7d79-442f-a139-faaa7cfa80de' as UUID;
    const entityId = entityIdParam || '34354c4e-d88f-458a-b9ce-45772447730d' as UUID;
    const routefusionService = new RoutefusionService();

    const beneficiaryData: CreateBusinessBeneficiaryInput = {
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      email: "beneficiary.business@example.com",
      phone: "+573563525448",
      phone_country: "CO",
      business_name: "Beneficiary Business Corp",
      business_address1: "789 Business Avenue",
      business_address2: "Suite 500",
      business_city: "Bogota",
      business_state_province_region: "Cundinamarca",
      business_postal_code: "78702",
      business_country: "US" as any,
      tax_number: "123-45-6789",
      name_on_bank_account: "Beneficiary Business Corp",
      swift_bic: "COLOCO33",
      account_type: "checking",
      account_number: "9876543210",
      routing_code: "113193532",
      currency: "USD" as any,
      bank_name: "Test Bank",
      branch_name: "Business Branch",
      bank_address1: "456 Bank Street",
      bank_address2: "Suite 300",
      bank_city: "NY",
      bank_state_province_region: "NY",
      bank_postal_code: "78702",
      bank_country: "US" as any,
    };

    const beneficiaryId = await routefusionService.createBusinessBeneficiary(beneficiaryData);
    console.log("Business beneficiary created. Beneficiary ID:", beneficiaryId);
    return beneficiaryId;
  } catch (error) {
    console.error("\nError occurred during test:");
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
  const walletId = '5b23b460-c0a7-49b4-9b95-649749ca3db5';
  const userId = 'b5fa316d-7d79-442f-a139-faaa7cfa80de';
  const beneficiaryId = 'your-beneficiary-id-here';


  //await testCreateBusinessEntity(); //4354c4e-d88f-458a-b9ce-45772447730d
  // await testCreateUser();
  // await testGetUser();
  // await testGetBusinessEntity();
  // await testCreateWallet("34354c4e-d88f-458a-b9ce-45772447730d");
  // await testAddBalanceToWallet(walletId, "100.00");
  // NOT WORKING await testCreateTransfer(userId, businessId, beneficiaryId, walletId);
  // await testUploadEntityDocument("34354c4e-d88f-458a-b9ce-45772447730d");
  //await testFinalizeEntity("34354c4e-d88f-458a-b9ce-45772447730d");
  //await testCreateRepresentative("c50e4a28-d19d-4b09-a09d-6f59977c1bc7" || businessId);
  //await testUpdateRepresentative(representativeId);
  //await testDeleteRepresentative(representativeId);
  //await testUploadRepresentativeDocument(representativeId);
  //await testGetEntityRequiredFields();
  //await testGetRepresentativeRequiredFields();

  // Complete onboarding flow test
  await testCompleteOnboardingFlow();

  //await testValidateBusinessEntityDataToSubmit();
  //await testValidateRepresentativeDataToSubmit(businessId);

  // Beneficiary tests
  //await testCreatePersonalBeneficiary(userId, businessId);
  //await testCreateBusinessBeneficiary(userId, businessId);
}

main()
// .catch((error) => {
//   console.error("Fatal error:", error);
//   process.exit(1);
// });