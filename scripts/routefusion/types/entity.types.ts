/**
 * Routefusion Entity Schema Types
 * Based on: https://docs.routefusion.com/reference/entity-schema
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum EntityType {
  PERSONAL = "personal",
  BUSINESS = "business",
}

export enum BusinessType {
  B_CORPORATION = "b_corporation",
  C_CORPORATION = "c_corporation",
  CLOSE_CORPORATION = "close_corporation",
  COOPERATIVE = "cooperative",
  GENERAL_PARTNERSHIP = "general_partnership",
  LIMITED_LIABILITY_COMPANY = "limited_liability_company",
  LIMITED_PARTNERSHIP = "limited_partnership",
  NONPROFIT_CORPORATION = "nonprofit_corporation",
  S_CORPORATION = "s_corporation",
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  NON_US = "non_us",
}

export enum DocumentType {
  IDENTITY_VERIFICATION = "identity_verification",
  PROOF_OF_ADDRESS = "proof_of_address",
  LIVENESS_CHECK = "liveness_check",
  PROOF_OF_OWNERSHIP = "proof_of_ownership",
  PROOF_OF_REGISTRATION = "proof_of_registration",
  BANK_STATEMENT = "bank_statement",
}

export enum FileEnum {
  /** Document proving vehicle registration */
  PROOF_OF_REGISTRATION = "proof_of_registration",
  /** Document proving ownership of the asset */
  PROOF_OF_OWNERSHIP = "proof_of_ownership",
  /** Statement from a bank account */
  BANK_STATEMENT = "bank_statement",
  /** International travel document */
  PASSPORT = "passport",
  /** Front side of the driver's license */
  FRONT_DRIVERS_LICENSE = "front_drivers_license",
  /** Back side of the driver's license */
  BACK_DRIVERS_LICENSE = "back_drivers_license",
  /** Front side of the permanent residence card */
  FRONT_PERMANENT_RESIDENCE_CARD = "front_permanent_residence_card",
  /** Back side of the permanent residence card */
  BACK_PERMANENT_RESIDENCE_CARD = "back_permanent_residence_card",
  /** Front side of the national/state ID */
  FRONT_NATIONAL_STATE_ID = "front_national_state_id",
  /** Back side of the national/state ID */
  BACK_NATIONAL_STATE_ID = "back_national_state_id",
  /** Front side of the exit/entry permit */
  FRONT_EXIT_ENTRY_PERMIT = "front_exit_entry_permit",
  /** Back side of the exit/entry permit */
  BACK_EXIT_ENTRY_PERMIT = "back_exit_entry_permit",
  /** Document proving residential address */
  PROOF_OF_ADDRESS = "proof_of_address",
  /** Real-time verification requiring actions like head movements, blinking, or following instructions. A picture works. */
  LIVENESS_CHECK = "liveness_check",
}

export enum EntityState {
  ACCEPTED = "accepted",
  FINALIZED = "finalized",
  PENDING = "pending",
  VERIFIED = "verified",
  FAILED = "failed",
  REJECTED = "rejected",
  BLOCKED = "blocked",
  CANCELLED = "cancelled",
}

// ============================================================================
// SCALAR TYPES (TypeScript equivalents)
// ============================================================================

export type UUID = string;
export type Email = string;
export type PostalCode = string;
export type ISO3166_1 = string; // Country code (e.g., "US", "GB")
export type TaxNumber = string;
export type TradeName = string;
export type NAICS = string; // NAICS code
export type DateTime = string; // ISO 8601 date string
export type BusinessIndustry = string;

// ============================================================================
// USER & DOCUMENT TYPES
// ============================================================================

export interface UserAccount {
  id?: UUID;
  email?: Email;
  [key: string]: any; // Additional user fields
}

export interface DocumentMetaInfo {
  enum: string;
  type: DocumentType;
}

export interface EntityDocument {
  id?: UUID;
  type?: DocumentType;
  url?: string;
  [key: string]: any; // Additional document fields
}

// ============================================================================
// REPRESENTATIVE TYPES
// ============================================================================

export interface Representative {
  first_name?: string;
  last_name?: string;
  date_of_birth?: DateTime;
  is_signer?: boolean;
  residential_address?: string;
  residential_address2?: string;
  residential_city?: string;
  residential_state_province_region?: string;
  residential_postal_code?: PostalCode;
  residential_country?: ISO3166_1;
  citizenship?: ISO3166_1;
  responsibility?: string;
  ownership_percentage?: number;
  email?: Email;
  phone?: string;
  job_title?: string;
  passport_number?: string;
}

export interface RepresentativeRequiredFieldsItem {
  variable: string;
  regex?: string;
  example?: string;
  enum?: string[];
}

export interface RepresentativeRequiredFields {
  fields: RepresentativeRequiredFieldsItem[];
  documents: DocumentMetaInfo[][];
}

// ============================================================================
// REPRESENTATIVE INPUT TYPES
// ============================================================================

export interface RepresentativeInput {
  first_name?: string;
  last_name?: string;
  is_signer?: boolean;
  date_of_birth?: DateTime;
  residential_address?: string;
  residential_address2?: string;
  residential_city?: string;
  residential_state_province_region?: string;
  residential_postal_code?: PostalCode;
  residential_country?: ISO3166_1;
  citizenship?: ISO3166_1;
  responsibility?: string;
  document_number?: string;
  document_issue_date?: DateTime;
  document_expiration_date?: DateTime;
  ownership_percentage?: number;
  ssn?: string;
  passport_number?: string;
}

export interface UpdateRepresentativeInput {
  first_name?: string;
  last_name?: string;
  is_signer?: boolean;
  date_of_birth?: DateTime;
  residential_address?: string;
  residential_address2?: string;
  residential_city?: string;
  residential_state_province_region?: string;
  residential_postal_code?: PostalCode;
  residential_country?: ISO3166_1;
  citizenship?: ISO3166_1;
  responsibility?: string;
  ownership_percentage?: number;
  tax_number?: TaxNumber;
  email?: Email;
  phone?: string;
  job_title?: string;
  passport_number?: string;
}

// ============================================================================
// ENTITY TYPES
// ============================================================================

export interface Entity {
  id?: UUID;
  type?: EntityType;
  entity_name?: string;
  business_name?: string;
  first_name?: string;
  last_name?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  state?: EntityState;
  email?: Email;
  phone?: string;
  phone_country?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state_province_region?: string;
  postal_code?: PostalCode;
  country?: ISO3166_1;
  creator?: UserAccount;
  users?: UserAccount[];
  created_date?: DateTime;
  tax_number?: TaxNumber;
  trade_name?: TradeName;
  naics_code?: NAICS;
  currency_needed?: string[];
  destination_countries?: string[];
  business_type?: BusinessType;
  business_industry?: BusinessIndustry;
  business_description?: string;
  trading_symbol?: string;
  owned_by?: string;
  owned_by_other_entity?: boolean;
  owned_by_public_company?: boolean;
  owned_by_public_company_symbol?: string;
  incorporation_date?: DateTime;
  document_expiration_date?: DateTime;
  representatives?: Representative[];
  documents?: EntityDocument[];
  website_url?: string;
}

export interface EntityRequiredFieldsItem {
  variable: string;
  regex?: string;
  example?: string;
  enum?: string[];
}

export interface EntityRequiredFields {
  requires_representatives: boolean;
  fields: EntityRequiredFieldsItem[];
  documents: DocumentMetaInfo[][];
}

// ============================================================================
// ENTITY INPUT TYPES
// ============================================================================

export interface EntityUpdateInput {
  email?: Email;
  phone?: string;
  phone_country?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  business_name?: string;
  business_address1?: string;
  business_address2?: string;
  business_city?: string;
  business_state_province_region?: string;
  business_postal_code?: PostalCode;
  business_country?: ISO3166_1;
  tax_number?: TaxNumber;
  trade_name?: TradeName;
  naics_code?: NAICS;
  currency_needed?: string[];
  destination_countries?: string[];
  business_type?: BusinessType;
  business_industry?: BusinessIndustry;
  business_description?: string;
  trading_symbol?: string;
  owned_by?: string;
  owned_by_other_entity?: boolean;
  owned_by_public_company?: boolean;
  owned_by_public_company_symbol?: string;
  incorporation_date?: DateTime;
  document_expiration_date?: DateTime;
  average_monthly_transaction_count?: string;
  average_monthly_volume?: string;
  website_url?: string;
}

export interface CreatePersonalEntityInput {
  user_id: UUID;
  email: Email;
  phone?: string;
  phone_country?: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city?: string;
  state_province_region?: string;
  postal_code?: PostalCode;
  country: ISO3166_1;
  birth_data: DateTime;
  tax_number?: TaxNumber;
  accept_terms_and_conditions: boolean;
}
export interface RoutefusionUser {
  id: UUID;
  identifier: string;
  email: Email;
  first_name?: string;
  last_name?: string;
  admin?: boolean;
  organization?: RoutefusionOrganization;
}

export interface RoutefusionBusiness {
  id: UUID;
  type: EntityType;
  business_name: string;
  first_name: string;
  last_name: string;
  state: EntityState;
  email: Email;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state_province_region: string;
  postal_code: PostalCode;
  country: ISO3166_1;
  representatives: Representative[];
  creator: RoutefusionUser;
  users: RoutefusionUser[];
}

export interface RoutefusionOrganization {
  id: UUID;
  identifier: string;
  admin?: boolean;
  restricted?: boolean;
  enabled?: boolean;
}

export interface CreateUserInput {
  email: Email;
  first_name?: string;
  last_name?: string;
  admin?: boolean;
  send_invite_email?: boolean;
}

export interface CreateBusinessEntityInput {
  user_id?: UUID;
  email: Email;
  phone?: string;
  phone_country?: string;
  contact_first_name: string;
  business_type?: BusinessType;
  business_name: string;
  business_address1: string;
  contact_last_name: string;
  business_address2?: string;
  business_city?: string;
  business_state_province_region?: string;
  business_postal_code?: PostalCode;
  business_country: ISO3166_1;
  tax_number?: TaxNumber;
  accept_terms_and_conditions: boolean;
  naics_code?: NAICS;
  business_description?: string;
  trading_symbol?: string;
  owned_by?: string;
  incorporation_date?: DateTime;
  average_monthly_transaction_count?: string;
  average_monthly_volume?: string;
  website_url?: string;
}

export interface UpdateBusinessEntityInput {
  email?: Email;
  phone?: string;
  phone_country?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  business_name?: string;
  business_address1?: string;
  business_address2?: string;
  business_city?: string;
  business_state_province_region?: string;
  business_postal_code?: PostalCode;
  business_country?: ISO3166_1;
  tax_number?: TaxNumber;
  trade_name?: TradeName;
  naics_code?: NAICS;
  business_type?: BusinessType;
  business_industry?: BusinessIndustry;
  business_description?: string;
  trading_symbol?: string;
  owned_by?: string;
  owned_by_other_entity?: boolean;
  owned_by_public_company?: boolean;
  owned_by_public_company_symbol?: string;
  incorporation_date?: DateTime;
  document_expiration_date?: DateTime;
  average_monthly_transaction_count?: string;
  average_monthly_volume?: string;
  website_url?: string;
}

// ============================================================================
// QUERY INPUT TYPES
// ============================================================================

export interface ListFilter {
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface EntityRequiredFieldsQueryInput {
  country?: ISO3166_1;
  entity_type?: EntityType;
  business_type?: BusinessType;
}

export interface UserEntitiesQueryInput {
  user_id: UUID;
  search_terms?: string;
  listFilter?: ListFilter;
}

export interface OrganizationEntitiesQueryInput {
  search_terms?: string;
  listFilter?: ListFilter;
}

export interface EntityQueryInput {
  entity_id: UUID;
}

// ============================================================================
// MUTATION RESULT TYPES
// ============================================================================

export interface CreatePersonalEntityResult {
  id: UUID;
}

export interface CreateBusinessEntityResult {
  id: UUID;
}

