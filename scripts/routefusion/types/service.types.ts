/**
 * Routefusion Service Types
 * Types used by the RoutefusionService class
 */
import * as cc from 'currency-codes-ts';
import { Entity, EntityState, FileEnum, UUID, DateTime, ISO3166_1, Email, PostalCode, TaxNumber } from "./entity.types";

// ============================================================================
// GRAPHQL RESPONSE TYPES
// ============================================================================

export type ISO4217 = ReturnType<typeof cc.codes>[number];

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: any;
  }>;
}

export interface GraphQLErrorDetail {
  message: string;
  path?: string[];
  extensions?: any;
  field?: string;
}

/**
 * Custom error class for Routefusion GraphQL errors
 * Provides structured error information for frontend consumption
 */
export class RoutefusionGraphQLError extends Error {
  public readonly errors: GraphQLErrorDetail[];
  public readonly fieldErrors: Record<string, string[]>;
  public readonly extensions?: any[];

  constructor(errors: Array<{ message: string; path?: string[]; extensions?: any }>) {
    const errorMessages = errors.map((e) => e.message).join("; ");
    super(`Routefusion API GraphQL error: ${errorMessages}`);

    this.name = "RoutefusionGraphQLError";
    this.errors = errors.map((error) => {
      // Extract field name from path or message
      let field: string | undefined;

      // Try to extract from path (e.g., ["createBusinessEntity", "phone"] -> "phone")
      if (error.path && error.path.length > 0) {
        // Get the last non-numeric element (skip array indices)
        const pathElements = error.path.filter((p) => typeof p === "string");
        if (pathElements.length > 0) {
          const lastPath = pathElements[pathElements.length - 1];
          // Skip mutation/query names, use actual field names
          if (lastPath && !lastPath.startsWith("create") && !lastPath.startsWith("update")) {
            field = lastPath;
          }
        }
      }

      // If no field from path, try to extract from error message
      // Common patterns: "phone is invalid", "phone: invalid format", etc.
      if (!field && error.message) {
        const messageLower = error.message.toLowerCase();
        // Common field names to look for
        const commonFields = [
          "phone",
          "email",
          "business_name",
          "contact_first_name",
          "contact_last_name",
          "business_address1",
          "business_city",
          "business_state_province_region",
          "business_postal_code",
          "business_country",
          "tax_number",
          "postal_code",
          "address1",
          "address2",
          "city",
          "state_province_region",
          "country",
        ];

        for (const fieldName of commonFields) {
          if (messageLower.includes(fieldName)) {
            field = fieldName;
            break;
          }
        }
      }

      // Also check extensions for field information
      if (!field && error.extensions) {
        if (error.extensions.field) {
          field = error.extensions.field;
        } else if (error.extensions.argument) {
          field = error.extensions.argument;
        }
      }

      return {
        message: error.message,
        path: error.path,
        extensions: error.extensions,
        field,
      };
    });

    // Group errors by field for easy frontend access
    this.fieldErrors = {};
    this.errors.forEach((error) => {
      if (error.field) {
        if (!this.fieldErrors[error.field]) {
          this.fieldErrors[error.field] = [];
        }
        this.fieldErrors[error.field].push(error.message);
      }
    });

    // Collect all extensions
    this.extensions = errors
      .map((e) => e.extensions)
      .filter((ext) => ext !== undefined && ext !== null);

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoutefusionGraphQLError);
    }
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(fieldName: string): string | undefined {
    const errors = this.fieldErrors[fieldName];
    return errors && errors.length > 0 ? errors[0] : undefined;
  }

  /**
   * Get all error messages for a specific field
   */
  getFieldErrors(fieldName: string): string[] {
    return this.fieldErrors[fieldName] || [];
  }

  /**
   * Check if a specific field has errors
   */
  hasFieldError(fieldName: string): boolean {
    return fieldName in this.fieldErrors && this.fieldErrors[fieldName].length > 0;
  }

  /**
   * Convert to JSON for API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors,
      fieldErrors: this.fieldErrors,
      extensions: this.extensions,
    };
  }
}

// ============================================================================
// WALLET TYPES
// ============================================================================

export interface CreateWalletInput {
  entityId: UUID;
  currency: ISO4217;
}

export interface Wallet {
  id: string;
  entity_id: string;
  currency: string;
  balance?: number;
}

// ============================================================================
// VIRTUAL ACCOUNT TYPES
// ============================================================================

export interface CreateVirtualAccountInput {
  wallet_id: string;
  name: string;
}

export interface VirtualAccount {
  id: string;
  wallet_id: string;
  name: string;
  account_number?: string;
  routing_number?: string;
  currency?: string;
}

// ============================================================================
// SIMPLIFIED ENTITY RESPONSE (for service methods)
// ============================================================================

export interface BusinessEntity {
  id: string;
  name?: string;
  business_name?: string;
  country: string;
  status?: EntityState | string;
}

// ============================================================================
// DOCUMENT UPLOAD TYPES
// ============================================================================

export interface UploadBusinessEntityDocumentInput {
  entityId: UUID;
  file: any; // Upload type (File, Blob, or stream)
  file_enum: FileEnum | string; // File enum type (use FileEnum for type safety)
}

export interface UploadRepresentativeDocumentInput {
  representativeId: UUID;
  file: any; // Upload type (File, Blob, or stream)
  file_enum: FileEnum | string; // File enum type (use FileEnum for type safety)
}

export interface UploadDocumentResponse {
  filename: string;
}

export enum RepresentativeResponsibility {
  ULTIMATE_BENEFICIAL_OWNER = "ultimate_beneficial_owner",
  AUTHORIZED_REP = "authorized rep",
  DIRECTOR = "director",
}

// ============================================================================
// REPRESENTATIVE TYPES
// ============================================================================

export interface CreateRepresentativeInput {
  entity_id: UUID;
  representative: {
    document_expiration_date?: DateTime;
    document_issue_date?: DateTime;
    document_number?: string;
    citizenship?: ISO3166_1;
    date_of_birth?: DateTime;
    email?: Email;
    first_name?: string;
    is_signer?: boolean;
    last_name?: string;
    job_title?: string;
    ownership_percentage?: number; // Will be converted to Int in GraphQL
    passport_number?: string;
    phone?: string;
    residential_address?: string;
    residential_address2?: string;
    residential_city?: string;
    residential_country?: ISO3166_1;
    residential_postal_code?: PostalCode;
    residential_state_province_region?: string;
    responsibility?: RepresentativeResponsibility; // See enum below
    tax_number?: TaxNumber;
  };
}

export interface UpdateRepresentativeInput {
  updateRepresentativeId: UUID;
  representative: {
    document_expiration_date?: DateTime;
    document_issue_date?: DateTime;
    document_number?: string;
    citizenship?: ISO3166_1;
    date_of_birth?: DateTime;
    email?: Email;
    first_name?: string;
    is_signer?: boolean;
    last_name?: string;
    job_title?: string;
    ownership_percentage?: number; // Int in GraphQL
    passport_number?: string;
    phone?: string;
    residential_address?: string;
    residential_address2?: string;
    residential_city?: string;
    residential_country?: ISO3166_1;
    residential_postal_code?: PostalCode;
    residential_state_province_region?: string;
    responsibility?: string; // Can be: "ultimate_beneficial_owner", "authorized rep", "director"
    tax_number?: TaxNumber;
  };
}

