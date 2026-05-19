import "dotenv/config";
import AirtmService from "./airtm.service";
import {
  CreateSenderRequest,
  CreateReceiverRequest,
  CreateQuoteRequest,
  CreateTransactionRequest,
} from "./airtm.types";

const airtm = new AirtmService();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(label: string, data: unknown) {
  console.log(`\n[Airtm] ${label}`);
  console.log(JSON.stringify(data, null, 2));
}

function uid() {
  return `test-${Date.now()}`;
}

// ─── Test data ───────────────────────────────────────────────────────────────

const SENDER_EXTERNAL_ID = `sender-${Date.now()}`;
const RECEIVER_EXTERNAL_ID = `receiver-${Date.now()}`;

const senderPayload: CreateSenderRequest = {
  externalSenderId: SENDER_EXTERNAL_ID,
  partyType: "individual",
  countryOfResidence: "VEN",
  enabledFundingRailIds: ["stellar.usdc"],
  individual: {
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-01",
    nationalIdNumber: "V12345678",
    nationality: "VEN",
  },
  contact: {
    email: `john.doe+${Date.now()}@example.com`,
    phoneNumber: "4141234567",
    phoneCountryCode: "58",
  },
  address: {
    line1: "Av. Principal 123",
    city: "Caracas",
    region: "Distrito Capital",
    postalCode: "1010",
    country: "VEN",
  },
  compliance: {
    kycReliance: {
      performedBy: "meru",
      kycReferenceId: `kyc-${Date.now()}`,
      status: "VERIFIED",
      performedAt: new Date().toISOString(),
      level: "FULL",
      documentType: "PASSPORT",
      provider: {
        name: "sumsub",
        applicantId: `applicant-${Date.now()}`,
        result: "GREEN",
      },
    },
    screening: {
      sanctionsHit: false,
      pepHit: false,
      adverseMediaHit: false,
      riskRating: "LOW",
      screenedAt: new Date().toISOString(),
    },
    sessionContext: {
      ipAddress: "127.0.0.1",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      deviceId: `device-${Date.now()}`,
    },
  },
};

const receiverPayload: CreateReceiverRequest = {
  externalReceiverId: RECEIVER_EXTERNAL_ID,
  partyType: "individual",
  country: "VEN",
  individual: {
    firstName: "Jane",
    lastName: "Smith",
    dob: "1992-03-10",
    nationalIdNumber: "V87654321",
  },
  contact: {
    email: `jane.smith+${Date.now()}@example.com`,
    phone: "+584141234567",
  },
  address: {
    line1: "Av. Francisco de Miranda",
    city: "Caracas",
    region: "Distrito Capital",
    postalCode: "1010",
    country: "VEN",
  },
  compliance: {
    kycReliance: {
      performedBy: "meru",
      kycReferenceId: `kyc-rcv-${Date.now()}`,
      status: "VERIFIED",
      performedAt: new Date().toISOString(),
      level: "FULL",
      documentType: "PASSPORT",
      provider: {
        name: "sumsub",
        applicantId: `applicant-rcv-${Date.now()}`,
        result: "GREEN",
      },
    },
  },
};

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  try {
    // 1. Catalog
    console.log("\n=== Catalog ===");
    const catalog = await airtm.listCatalog({ perPage: 10, country: "VEN" });
    log("listCatalog (VEN, 10 items)", {
      totalItems: catalog.items.length,
      firstRail: catalog.items[0],
    });

    const paymentRailId = catalog.items[0]?.id;
    if (!paymentRailId) throw new Error("No payment rails found for VEN");

    // 2. Webhook portal URL
    console.log("\n=== Webhooks ===");
    const portal = await airtm.getWebhookPortalUrl();
    log("getWebhookPortalUrl", portal);

    // 3. Create sender
    console.log("\n=== Senders ===");
    const sender = await airtm.createSender(senderPayload);
    log("createSender", sender);

    // 4. Get sender by id
    const senderById = await airtm.getSenderById(sender.id);
    log("getSenderById", senderById);

    // 5. Get sender by external id
    const senderByExtId = await airtm.getSenderByExternalId(SENDER_EXTERNAL_ID);
    log("getSenderByExternalId", senderByExtId);

    // 6. Create receiver (attach payout destination to sender)
    console.log("\n=== Receivers ===");
    const destinationFields: Record<string, string> = {};
    const railFields = catalog.items[0]?.destinationFields ?? {};
    for (const [field, descriptor] of Object.entries(railFields)) {
      destinationFields[field] = descriptor.options?.[0] ?? "test-value";
    }

    receiverPayload.payoutDestinations = [
      {
        paymentRailId,
        destination: destinationFields,
        senderId: sender.id,
      },
    ];

    const receiver = await airtm.createReceiver(receiverPayload);
    log("createReceiver", receiver);

    // 7. Get receiver by id
    const receiverById = await airtm.getReceiverById(receiver.id);
    log("getReceiverById", receiverById);

    // 8. Get receiver by external id
    const receiverByExtId = await airtm.getReceiverByExternalId(
      RECEIVER_EXTERNAL_ID
    );
    log("getReceiverByExternalId", receiverByExtId);

    // 9. Create quote
    console.log("\n=== Quotes ===");
    const quotePayload: CreateQuoteRequest = {
      senderId: sender.id,
      receiverId: receiver.id,
      fundingRailId: "stellar.usdc",
      paymentRailId,
      amountToSend: 10,
    };
    const quote = await airtm.createQuote(quotePayload);
    log("createQuote", quote);

    // 10. Create transaction
    console.log("\n=== Transactions ===");
    const txPayload: CreateTransactionRequest = {
      quoteId: quote.id,
      executionChannel: "P2P_NETWORK",
    };
    const tx = await airtm.createTransaction(txPayload, uid());
    log("createTransaction", tx);

    // 11. Get transaction by id
    const txById = await airtm.getTransactionById(tx.id);
    log("getTransactionById", txById);

    // 12. List transactions
    const txList = await airtm.listTransactions({
      senderId: sender.id,
      perPage: 10,
    });
    log("listTransactions", {
      total: txList.items.length,
      first: txList.items[0],
    });

    console.log("\n[Airtm] Full lifecycle completed successfully.");
  } catch (err) {
    console.error("\n[Airtm] Error:");
    console.error(err);
    process.exit(1);
  }
}

main();
