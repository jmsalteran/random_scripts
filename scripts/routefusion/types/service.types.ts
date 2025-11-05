/**
 * Routefusion Service Types
 * Types used by the RoutefusionService class
 */

import { Entity, EntityState } from "./entity.types";

// ============================================================================
// GRAPHQL RESPONSE TYPES
// ============================================================================

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: any;
  }>;
}

// ============================================================================
// WALLET TYPES
// ============================================================================

export interface CreateWalletInput {
  entity_id: string;
  currency: string;
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

