import { RoutefusionService } from "./routefusion.service";
import { CreateBusinessEntityInput, BusinessType, CreateUserInput, UUID, EntityType, ISO3166_1, EntityRequiredFieldsQueryInput, RepresentativeRequiredFieldsQueryInput, BeneficiaryRequiredFieldsQueryInput } from "./types/entity.types";
import { FileEnum } from "./types/entity.types";
import { CreateRepresentativeInput, RepresentativeResponsibility, UpdateRepresentativeInput, CreatePersonalBeneficiaryInput, CreateBusinessBeneficiaryInput, CreateWalletInput, AddBalanceToWalletInput, CreateTransferInput, FinalizeTransferInput, UploadBusinessEntityDocumentInput, UploadRepresentativeDocumentInput } from "./types/service.types";
import * as fs from "fs";
import * as path from "path";
import { faker } from "@faker-js/faker";

// ============================================================================
// TEST INPUTS - CENTRALIZED INPUT DATA FOR ALL ROUTEFUSION SERVICE METHODS
// ============================================================================

/**
 * Centralized test inputs for all Routefusion service methods.
 * All test functions should reference this section for their input data.
 * Uses faker for generating realistic test data.
 */
export const TEST_INPUTS = {
  // User inputs
  createUser: {
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    admin: false,
    send_invite_email: false,
  } as CreateUserInput,

  // Business Entity inputs
  createBusinessEntity: {
    email: faker.internet.email(),
    phone: faker.phone.number("##########"), // US phone number without formatting
    phone_country: "US",
    contact_first_name: faker.person.firstName(),
    contact_last_name: faker.person.lastName(),
    business_name: faker.company.name(),
    business_address1: faker.location.streetAddress(),
    business_address2: faker.location.secondaryAddress(),
    business_city: faker.location.city(),
    business_state_province_region: faker.location.state({ abbreviated: true }),
    business_postal_code: faker.location.zipCode("#####"),
    business_country: "US" as ISO3166_1,
    business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
    tax_number: faker.string.numeric(9).replace(/(\d{2})(\d{7})/, "$1-$2"), // US EIN format: XX-XXXXXXX
    accept_terms_and_conditions: true,
    naics_code: faker.string.numeric(6),
    business_description: faker.company.catchPhrase(),
    trading_symbol: faker.string.alpha(4).toUpperCase(),
    owned_by: `${faker.person.firstName()} ${faker.person.lastName()}`,
    incorporation_date: new Date().toISOString(),
    website_url: faker.internet.url(),
  } as CreateBusinessEntityInput,

  // Representative inputs
  createRepresentative: {
    entity_id: "" as UUID, // Will be set dynamically
    representative: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number("##########"), // US phone number
      date_of_birth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString(),
      citizenship: "US" as ISO3166_1,
      residential_address: faker.location.streetAddress(),
      residential_address2: faker.location.secondaryAddress(),
      residential_city: faker.location.city(),
      residential_state_province_region: faker.location.state({ abbreviated: true }),
      residential_postal_code: faker.location.zipCode("#####"),
      residential_country: "US" as ISO3166_1,
      responsibility: RepresentativeResponsibility.DIRECTOR,
      is_signer: true,
      job_title: faker.person.jobTitle(),
      ownership_percentage: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
      document_number: faker.string.alphanumeric(9).toUpperCase(), // Driver's license format
      document_issue_date: faker.date.past({ years: 3 }).toISOString(),
      document_expiration_date: faker.date.future({ years: 10 }).toISOString(),
      passport_number: faker.string.alphanumeric(9).toUpperCase(),
      tax_number: faker.string.numeric(9).replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3"), // US SSN format: XXX-XX-XXXX
    },
  } as CreateRepresentativeInput,

  updateRepresentative: {
    updateRepresentativeId: "" as UUID, // Will be set dynamically
    representative: {
      document_expiration_date: "2026-03-20T00:00:00Z",
      // Other fields can be uncommented as needed:
      // first_name: "Jane",
      // last_name: "Smith-Updated",
      // email: "jane.smith.updated@example.com",
      // phone: "+1234567891",
      // date_of_birth: "1985-05-15T00:00:00Z",
      // citizenship: "US",
      // residential_address: "789 Pine Street",
      // residential_address2: "Suite 200",
      // residential_city: "San Francisco",
      // residential_state_province_region: "CA",
      // residential_postal_code: "94102",
      // residential_country: "US",
      // responsibility: RepresentativeResponsibility.DIRECTOR,
      // is_signer: true,
      // job_title: "Chief Technology Officer",
      // ownership_percentage: 30.0,
      // document_number: "DL987654321",
      // document_issue_date: "2021-03-20T00:00:00Z",
      // passport_number: "P987654321",
      // tax_number: "987-65-4321",
    },
  } as UpdateRepresentativeInput,

  // Personal Beneficiary inputs
  createPersonalBeneficiary: {
    user_id: "" as UUID, // Will be set dynamically
    entity_id: "" as UUID, // Will be set dynamically
    email: faker.internet.email(),
    phone: faker.phone.number("##########"), // US phone number
    phone_country: "US" as ISO3166_1,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state_province_region: faker.location.state({ abbreviated: true }),
    postal_code: faker.location.zipCode("#####"),
    country: "US" as ISO3166_1,
    tax_number: faker.string.numeric(9).replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3"), // US SSN format
    name_on_bank_account: `${faker.person.firstName()} ${faker.person.lastName()}`,
    swift_bic: faker.string.alpha(4).toUpperCase() + "US" + faker.string.alphanumeric(2).toUpperCase() + faker.string.alphanumeric(3).toUpperCase(), // SWIFT BIC format: 4 letters + US + 2 alphanumeric + 3 alphanumeric
    account_type: "checking" as const,
    account_number: faker.string.numeric(10),
    routing_code: faker.string.numeric(9), // US routing number
    currency: "USD" as any,
    bank_name: faker.company.name() + " Bank",
    branch_name: faker.location.city() + " Branch",
    bank_address1: faker.location.streetAddress(),
    bank_address2: faker.location.secondaryAddress(),
    bank_city: faker.location.city(),
    bank_state_province_region: faker.location.state({ abbreviated: true }),
    bank_postal_code: faker.location.zipCode("#####"),
    bank_country: "US" as ISO3166_1,
    tax_number_expiration: faker.date.future({ years: 5 }).toISOString(),
    date_of_birth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString(),
  } as CreatePersonalBeneficiaryInput,

  // Business Beneficiary inputs
  createBusinessBeneficiary: {
    user_id: "" as UUID, // Will be set dynamically
    entity_id: "" as UUID, // Will be set dynamically
    email: faker.internet.email(),
    phone: faker.phone.number("##########"), // US phone number
    phone_country: "US",
    business_name: faker.company.name(),
    business_address1: faker.location.streetAddress(),
    business_address2: faker.location.secondaryAddress(),
    business_city: faker.location.city(),
    business_state_province_region: faker.location.state({ abbreviated: true }),
    business_postal_code: faker.location.zipCode("#####"),
    business_country: "US" as ISO3166_1,
    tax_number: faker.string.numeric(9).replace(/(\d{2})(\d{7})/, "$1-$2"), // US EIN format
    name_on_bank_account: faker.company.name(),
    swift_bic: faker.string.alpha(4).toUpperCase() + "US" + faker.string.alphanumeric(2).toUpperCase() + faker.string.alphanumeric(3).toUpperCase(), // SWIFT BIC format: 4 letters + US + 2 alphanumeric + 3 alphanumeric
    account_type: "checking" as const,
    account_number: faker.string.numeric(10),
    routing_code: faker.string.numeric(9), // US routing number
    currency: "USD" as any,
    bank_name: faker.company.name() + " Bank",
    branch_name: faker.location.city() + " Branch",
    bank_address1: faker.location.streetAddress(),
    bank_address2: faker.location.secondaryAddress(),
    bank_city: faker.location.city(),
    bank_state_province_region: faker.location.state({ abbreviated: true }),
    bank_postal_code: faker.location.zipCode("#####"),
    bank_country: "US" as ISO3166_1,
  } as CreateBusinessBeneficiaryInput,

  // Wallet inputs
  createWallet: {
    entityId: "" as UUID, // Will be set dynamically
    currency: "USD" as any,
  } as CreateWalletInput,

  addBalanceToWallet: {
    wallet_id: "" as UUID, // Will be set dynamically
    amount: "100.00",
  } as AddBalanceToWalletInput,

  // Transfer inputs
  createTransfer: {
    user_id: "" as UUID, // Will be set dynamically
    entity_id: "" as UUID, // Will be set dynamically
    beneficiary_id: "" as UUID, // Will be set dynamically
    purpose_of_payment: "Payment for services",
    source_amount: "100.00",
    wallet_id: undefined as UUID | undefined, // Will be set dynamically
    reference: `Test transfer ${Date.now()}`,
  } as CreateTransferInput,

  finalizeTransfer: {
    transfer_id: "" as UUID, // Will be set dynamically
  } as FinalizeTransferInput,

  // Document upload inputs
  uploadEntityDocument: {
    entityId: "" as UUID, // Will be set dynamically
    file: null as any, // Will be set dynamically from file system
    file_enum: FileEnum.PASSPORT,
  } as UploadBusinessEntityDocumentInput,

  uploadRepresentativeDocument: {
    representativeId: "" as UUID, // Will be set dynamically
    file: null as any, // Will be set dynamically from file system
    file_enum: FileEnum.PASSPORT,
  } as UploadRepresentativeDocumentInput,

  // Query inputs
  getEntityRequiredFields: {
    country: "US" as ISO3166_1,
    entity_type: EntityType.BUSINESS,
    business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
  } as EntityRequiredFieldsQueryInput,

  getRepresentativeRequiredFields: {
    country: "US" as ISO3166_1,
  } as RepresentativeRequiredFieldsQueryInput,

  getBeneficiaryRequiredFields: {
    bank_country: "US" as ISO3166_1,
    currency: "USD",
    beneficiary_country: "US" as ISO3166_1,
  } as BeneficiaryRequiredFieldsQueryInput,

  // Test IDs (can be updated as needed)
  testIds: {
    userId: "b5fa316d-7d79-442f-a139-faaa7cfa80de" as UUID,
    businessId: "63cdba52-cc6d-450e-9a20-83c9b40a251e" as UUID,
    representativeId: "c479de98-7420-4a64-b7d3-45889e66d955" as UUID,
    walletId: "5b23b460-c0a7-49b4-9b95-649749ca3db5" as UUID,
    beneficiaryId: "your-beneficiary-id-here" as UUID,
  },
};

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

/**
 * User configuration for test flows
 */
const USER_CONFIG = {
  defaultUserId: TEST_INPUTS.testIds.userId,
  createNewUser: true,
  userData: {
    first_name: TEST_INPUTS.createUser.first_name,
    last_name: TEST_INPUTS.createUser.last_name,
    admin: TEST_INPUTS.createUser.admin,
    send_invite_email: TEST_INPUTS.createUser.send_invite_email,
  },
};

/**
 * Business entity configuration
 */
const BUSINESS_ENTITY_CONFIG = {
  country: "US",
  business_type: BusinessType.LIMITED_LIABILITY_COMPANY,
  entity_type: EntityType.BUSINESS,
  email: faker.internet.email(), // Base email, will have timestamp added
  address: {
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state_province_region: faker.location.state({ abbreviated: true }),
    postal_code: faker.location.zipCode("#####"),
    country: "US",
  },
  contact: {
    phone: faker.phone.number("##########"),
    phone_country: "US",
    contact_first_name: faker.person.firstName(),
    contact_last_name: faker.person.lastName(),
  },
  business: {
    tax_number: faker.string.numeric(9).replace(/(\d{2})(\d{7})/, "$1-$2"), // US EIN format
    naics_code: faker.string.numeric(6),
    business_description: faker.company.catchPhrase(),
    trading_symbol: faker.string.alpha(4).toUpperCase(),
    owned_by: `${faker.person.firstName()} ${faker.person.lastName()}`,
    website_url: faker.internet.url(),
  },
  useFakerForBusinessName: true,
};

/**
 * Representative configuration
 */
const REPRESENTATIVE_CONFIG = {
  personal: {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number("##########"),
    date_of_birth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString(),
    citizenship: "US",
  },
  address: {
    residential_address: faker.location.streetAddress(),
    residential_address2: faker.location.secondaryAddress(),
    residential_city: faker.location.city(),
    residential_state_province_region: faker.location.state({ abbreviated: true }),
    residential_postal_code: faker.location.zipCode("#####"),
    residential_country: "US",
  },
  role: {
    responsibility: RepresentativeResponsibility.DIRECTOR,
    is_signer: true,
    job_title: faker.person.jobTitle(),
    ownership_percentage: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
  },
  documents: {
    document_number: faker.string.alphanumeric(9).toUpperCase(),
    document_issue_date: faker.date.past({ years: 3 }).toISOString(),
    document_expiration_date: faker.date.future({ years: 10 }).toISOString(),
    passport_number: faker.string.alphanumeric(9).toUpperCase(),
    tax_number: faker.string.numeric(9).replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3"), // US SSN format
  },
};

/**
 * Personal beneficiary configuration
 */
const PERSONAL_BENEFICIARY_CONFIG = {
  corridor: {
    bank_country: "US",
    currency: "USD",
    beneficiary_country: "US",
  },
  personal: {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number("##########"),
    phone_country: "US",
    date_of_birth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString(),
  },
  address: {
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state_province_region: faker.location.state({ abbreviated: true }),
    postal_code: faker.location.zipCode("#####"),
    country: "US",
  },
  bank: {
    name_on_bank_account: `${faker.person.firstName()} ${faker.person.lastName()}`,
    swift_bic: faker.string.alpha(4).toUpperCase() + "US" + faker.string.alphanumeric(2).toUpperCase() + faker.string.alphanumeric(3).toUpperCase(), // SWIFT BIC format
    account_type: "checking" as const,
    account_number: faker.string.numeric(10),
    routing_code: faker.string.numeric(9), // US routing number
    bank_name: faker.company.name() + " Bank",
    branch_name: faker.location.city() + " Branch",
    bank_address1: faker.location.streetAddress(),
    bank_address2: faker.location.secondaryAddress(),
    bank_city: faker.location.city(),
    bank_state_province_region: faker.location.state({ abbreviated: true }),
    bank_postal_code: faker.location.zipCode("#####"),
    bank_country: "US",
  },
  tax: {
    tax_number: faker.string.numeric(9).replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3"), // US SSN format
    tax_number_expiration: faker.date.future({ years: 5 }).toISOString(),
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
    email: faker.internet.email(),
    phone: faker.phone.number("##########"),
    phone_country: "US",
    tax_number: faker.string.numeric(9).replace(/(\d{2})(\d{7})/, "$1-$2"), // US EIN format
  },
  address: {
    business_address1: faker.location.streetAddress(),
    business_address2: faker.location.secondaryAddress(),
    business_city: faker.location.city(),
    business_state_province_region: faker.location.state({ abbreviated: true }),
    business_postal_code: faker.location.zipCode("#####"),
    business_country: "US",
  },
  bank: {
    swift_bic: faker.string.alpha(4).toUpperCase() + "US" + faker.string.alphanumeric(2).toUpperCase() + faker.string.alphanumeric(3).toUpperCase(), // SWIFT BIC format
    account_type: "checking" as const,
    account_number: faker.string.numeric(10),
    routing_code: faker.string.numeric(9), // US routing number
    bank_name: faker.company.name() + " Bank",
    branch_name: faker.location.city() + " Branch",
    bank_address1: faker.location.streetAddress(),
    bank_address2: faker.location.secondaryAddress(),
    bank_city: faker.location.city(),
    bank_state_province_region: faker.location.state({ abbreviated: true }),
    bank_postal_code: faker.location.zipCode("#####"),
    bank_country: "US",
  },
  useFakerForBusinessName: true,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build business entity data from TEST_INPUTS
 * Always uses faker for business name to ensure unique test data
 */
function buildBusinessEntityData(): CreateBusinessEntityInput {
  const businessName = faker.company.name();
  const email = faker.internet.email();

  return {
    ...TEST_INPUTS.createBusinessEntity,
    email,
    business_name: businessName,
    incorporation_date: new Date().toISOString(),
  };
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testCreateBusinessEntity() {
  try {
    const routefusionService = new RoutefusionService();

    const entityData: CreateBusinessEntityInput = {
      ...TEST_INPUTS.createBusinessEntity,
      incorporation_date: new Date().toISOString(), // Update timestamp
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
    const businessId = TEST_INPUTS.testIds.businessId;
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
      ...TEST_INPUTS.createUser,
      email: `test${Date.now()}@example.com`, // Add timestamp for uniqueness
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
    const userId = TEST_INPUTS.testIds.userId;
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

async function testCreateWallet(businessIdParam?: string) {
  try {
    const businessId = (businessIdParam || TEST_INPUTS.testIds.businessId) as UUID;
    const routefusionService = new RoutefusionService();
    const wallet = await routefusionService.createWallet({
      ...TEST_INPUTS.createWallet,
      entityId: businessId,
    });
    console.log("Wallet created:", JSON.stringify(wallet, null, 2));
  } catch (error) {
    throw error;
  }
}

async function testAddBalanceToWallet(walletIdParam?: string, amount?: string) {
  try {
    const walletId = (walletIdParam || TEST_INPUTS.testIds.walletId) as UUID;
    const balanceAmount = amount || TEST_INPUTS.addBalanceToWallet.amount;
    const routefusionService = new RoutefusionService();
    const result = await routefusionService.addBalanceToWallet({
      ...TEST_INPUTS.addBalanceToWallet,
      wallet_id: walletId,
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
  userIdParam?: string,
  entityIdParam?: string,
  beneficiaryIdParam?: string,
  walletIdParam?: string
) {
  try {
    const userId = (userIdParam || TEST_INPUTS.testIds.userId) as UUID;
    const entityId = (entityIdParam || TEST_INPUTS.testIds.businessId) as UUID;
    const beneficiaryId = (beneficiaryIdParam || TEST_INPUTS.testIds.beneficiaryId) as UUID;
    const walletId = walletIdParam as UUID | undefined;

    const routefusionService = new RoutefusionService();
    const transferId = await routefusionService.createTransfer({
      ...TEST_INPUTS.createTransfer,
      user_id: userId,
      entity_id: entityId,
      beneficiary_id: beneficiaryId,
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

async function testUploadEntityDocument(entityId?: string) {
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
      ...TEST_INPUTS.uploadEntityDocument,
      entityId: (entityId || TEST_INPUTS.testIds.businessId) as UUID,
      file: file,
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

async function testFinalizeEntity(entityId?: string) {
  try {
    const routefusionService = new RoutefusionService();
    const id = entityId || TEST_INPUTS.testIds.businessId;
    const finalizedEntityId = await routefusionService.finalizeEntity(id);
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

async function testCreateRepresentative(entityId?: string) {
  try {
    const routefusionService = new RoutefusionService();

    const representativeData: CreateRepresentativeInput = {
      ...TEST_INPUTS.createRepresentative,
      entity_id: (entityId || TEST_INPUTS.testIds.businessId) as UUID,
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

async function testUpdateRepresentative(representativeId?: string) {
  try {
    const routefusionService = new RoutefusionService();

    const updateData: UpdateRepresentativeInput = {
      ...TEST_INPUTS.updateRepresentative,
      updateRepresentativeId: (representativeId || TEST_INPUTS.testIds.representativeId) as UUID,
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

async function testDeleteRepresentative(representativeId?: string) {
  try {
    const routefusionService = new RoutefusionService();
    const id = representativeId || TEST_INPUTS.testIds.representativeId;
    const result = await routefusionService.deleteRepresentative(id);
    console.log("Representative deleted. ID:", id, "Result:", result);
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

async function testUploadRepresentativeDocument(representativeId?: string) {
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
      ...TEST_INPUTS.uploadRepresentativeDocument,
      representativeId: (representativeId || TEST_INPUTS.testIds.representativeId) as UUID,
      file: file,
    });
    console.log("Representative document uploaded. ID:", representativeId || TEST_INPUTS.testIds.representativeId, "Document:", JSON.stringify(document, null, 2));
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
    const requiredFields = await routefusionService.getEntityRequiredFields(TEST_INPUTS.getEntityRequiredFields);
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
    const requiredFields = await routefusionService.getRepresentativeRequiredFields(TEST_INPUTS.getRepresentativeRequiredFields);
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
          ...TEST_INPUTS.createUser,
          email: `test${Date.now()}@example.com`,
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
      TEST_INPUTS.getEntityRequiredFields.country!,
      TEST_INPUTS.getEntityRequiredFields.entity_type!,
      TEST_INPUTS.getEntityRequiredFields.business_type!
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
      ...TEST_INPUTS.createRepresentative,
      entity_id: entityId as UUID,
    };
    const validationResultRepresentative = await routefusionService.validateRepresentativeDataToSubmit(
      representativeData.representative,
      TEST_INPUTS.getEntityRequiredFields.country!,
      TEST_INPUTS.getEntityRequiredFields.entity_type!,
      TEST_INPUTS.getEntityRequiredFields.business_type!
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
    const personalBeneficiaryRequiredFields = await routefusionService.getBeneficiaryRequiredFields(TEST_INPUTS.getBeneficiaryRequiredFields);
    console.log("Personal beneficiary required fields:", JSON.stringify(personalBeneficiaryRequiredFields.personal, null, 2));

    const personalBeneficiaryEmail = TEST_INPUTS.createPersonalBeneficiary.email.replace('@', `${Date.now()}@`);
    const personalBeneficiaryData: CreatePersonalBeneficiaryInput = {
      ...TEST_INPUTS.createPersonalBeneficiary,
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      email: personalBeneficiaryEmail,
    };

    // Validate personal beneficiary data
    const personalValidationResult = await routefusionService.validatePersonalBeneficiaryDataToSubmit(
      personalBeneficiaryData,
      TEST_INPUTS.getBeneficiaryRequiredFields.bank_country,
      TEST_INPUTS.getBeneficiaryRequiredFields.currency,
      TEST_INPUTS.getBeneficiaryRequiredFields.beneficiary_country
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
      bank_country: "US" as ISO3166_1, // Different from personal beneficiary
      currency: "USD",
      beneficiary_country: "US" as ISO3166_1,
    });
    console.log("Business beneficiary required fields:", JSON.stringify(businessBeneficiaryRequiredFields.business, null, 2));

    const beneficiaryBusinessName = faker.company.name();
    const businessBeneficiaryEmail = TEST_INPUTS.createBusinessBeneficiary.email.replace('@', `${Date.now()}@`);
    const businessBeneficiaryData: CreateBusinessBeneficiaryInput = {
      ...TEST_INPUTS.createBusinessBeneficiary,
      user_id: userId as UUID,
      entity_id: entityId as UUID,
      email: businessBeneficiaryEmail,
      business_name: beneficiaryBusinessName,
      name_on_bank_account: beneficiaryBusinessName,
    };

    // Validate business beneficiary data
    const businessValidationResult = await routefusionService.validateBusinessBeneficiaryDataToSubmit(
      businessBeneficiaryData,
      "US" as ISO3166_1,
      "USD",
      "US" as ISO3166_1
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
      ...TEST_INPUTS.createBusinessEntity,
      phone: "52536252", // Override for this test
      incorporation_date: new Date().toISOString(), // Update timestamp
    };
    const country = TEST_INPUTS.getEntityRequiredFields.country!;
    const entity_type = TEST_INPUTS.getEntityRequiredFields.entity_type!;
    const business_type = TEST_INPUTS.getEntityRequiredFields.business_type!;
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


async function testValidateRepresentativeDataToSubmit(entityId?: string) {
  try {
    const representativeData: CreateRepresentativeInput = {
      ...TEST_INPUTS.createRepresentative,
      entity_id: (entityId || TEST_INPUTS.testIds.businessId) as UUID,
    };

    const country = TEST_INPUTS.getEntityRequiredFields.country!;
    const entity_type = TEST_INPUTS.getEntityRequiredFields.entity_type!;
    const business_type = TEST_INPUTS.getEntityRequiredFields.business_type!;
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
    const userId = (userIdParam || TEST_INPUTS.testIds.userId) as UUID;
    const entityId = (entityIdParam || TEST_INPUTS.testIds.businessId) as UUID;
    const routefusionService = new RoutefusionService();

    const beneficiaryData: CreatePersonalBeneficiaryInput = {
      ...TEST_INPUTS.createPersonalBeneficiary,
      user_id: userId,
      entity_id: entityId,
      email: TEST_INPUTS.createPersonalBeneficiary.email.replace('@', `${Date.now()}@`), // Add timestamp for uniqueness
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
    const userId = (userIdParam || TEST_INPUTS.testIds.userId) as UUID;
    const entityId = (entityIdParam || TEST_INPUTS.testIds.businessId) as UUID;
    const routefusionService = new RoutefusionService();

    const beneficiaryData: CreateBusinessBeneficiaryInput = {
      ...TEST_INPUTS.createBusinessBeneficiary,
      user_id: userId,
      entity_id: entityId,
      email: TEST_INPUTS.createBusinessBeneficiary.email.replace('@', `${Date.now()}@`), // Add timestamp for uniqueness
      business_name: faker.company.name(), // Use faker for business name
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
  // Use TEST_INPUTS.testIds for all test IDs
  const representativeId = TEST_INPUTS.testIds.representativeId;
  const businessId = TEST_INPUTS.testIds.businessId;
  const walletId = TEST_INPUTS.testIds.walletId;
  const userId = TEST_INPUTS.testIds.userId;
  const beneficiaryId = TEST_INPUTS.testIds.beneficiaryId;


  //await testCreateBusinessEntity(); //4354c4e-d88f-458a-b9ce-45772447730d
  // await testCreateUser();
  // await testGetUser();
  // await testGetBusinessEntity();
  // await testCreateWallet(businessId);
  // await testAddBalanceToWallet(walletId, "100.00");
  // NOT WORKING await testCreateTransfer(userId, businessId, beneficiaryId, walletId);
  // await testUploadEntityDocument(businessId);
  //await testFinalizeEntity(businessId);
  //await testCreateRepresentative(businessId);
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