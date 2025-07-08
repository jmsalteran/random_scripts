import axios, { AxiosInstance } from "axios";
import GuenoService from "./gueno";
import { testUser, simulatedTransaction, simulatedIBANTransaction } from "./simulated-data.test";


/**
 * Test function to create a consumer user using the Simple Gueno service
 */
async function testSimpleCreateConsumerUser() {
  try {
    console.log("Creating consumer user...");    

    // Call the service method
    const result = await GuenoService.createConsumer(testUser);

    console.log("Result:", JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("✅ Test successful!");
    } else {
      console.log("❌ Test failed!");
    }
  } catch (error) {
    console.error("Error during test:", error);
  }
}

async function testRetrieveConsumerUser() {
  try {
    console.log("Testing Gueno Service - Retrieve User");
    console.log("-----------------------------------");

    const userId = "test-user-1750082498330";
    console.log(`Attempting to retrieve user with ID: ${userId}`);

    const response = await GuenoService.retrieveConsumer(userId);

    console.log("\nResponse:");
    console.log(JSON.stringify(response, null, 2));

    if (response) {
      console.log("\n✅ Successfully retrieved user data");
    } else {
      console.log("\n❌ Failed to retrieve user data");
      console.log(`Error: ${response}`);
    }
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    console.error(error);
  }
}

async function testUpdateConsumerUser() {
  try {
    console.log("Testing Gueno Service - Update User");
    console.log("-----------------------------------");

    const serchingUserId = "test-user-1750082498330";
    const event = {
      timestamp: Math.floor(Date.now()),
      userId: serchingUserId,
      eventId: `test-event-${Math.random() * 20000}`,
      reason: "The user name was updated by the test script",
      eventDescription: "test-event-description",
      updatedConsumerUserAttributes: {
        userDetails: {
          name: {
            firstName: `John${Math.random() * 10000}`,
            lastName: `Testor -`,
          },
        },
      },
    };

    const response = await GuenoService.updateConsumer(event);
    console.log(response);
    
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    console.error(error);
  }
}

async function testVerifyTransaction() {
  try {
    console.log("Testing Gueno Service - Verify Transaction");
    console.log("-----------------------------------");

    const response = await GuenoService.verifyTransaction(simulatedIBANTransaction);
    console.log(response);
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    console.error(error);
  }
}

async function testGetTransaction() {
  try {
    console.log("Testing Gueno Service - Get Transaction");
    console.log("-----------------------------------");
    const transactionId = "jm-test-transaction-1750457865828";
    const response = await GuenoService.getTransaction(transactionId);
    console.log(response);
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    console.error(error);
  }
}

async function testUpdateTransaction() {
  try {
    console.log("Testing Gueno Service - Update Transaction");
    console.log("-----------------------------------");
    const transactionId = "jm-test-transaction-1750457865828";

    const simulatedChange = {
      transactionState: "SUCCESSFUL",
      timestamp: Math.floor(Date.now()),
      transactionId: transactionId,
      eventId: `test-event-${Math.random() * 20000}`,
      reason: "The transaction was updated by the test script",
      eventDescription: "test-event-description",
      updatedTransactionAttributes: {
        tags: [
          {
            key: "test",
            value: "true"
          },
          {
            key: "source",
            value: "automated_test"
          }
        ]
      }
    }
    const response = await GuenoService.updateTransaction(transactionId, simulatedChange);
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    console.error(error);
  }
}

// testRetrieveConsumerUser();
// testSimpleCreateConsumerUser();
// testUpdateConsumerUser();
testVerifyTransaction();
//  testGetTransaction();
// testUpdateTransaction();