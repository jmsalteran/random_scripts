"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gueno_1 = __importDefault(require("./gueno"));
const simulated_data_test_1 = require("./simulated-data.test");
/**
 * Test function to create a consumer user using the Simple Gueno service
 */
function testSimpleCreateConsumerUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Creating consumer user...");
            // Call the service method
            const result = yield gueno_1.default.createConsumer(simulated_data_test_1.testUser);
            console.log("Result:", JSON.stringify(result, null, 2));
            if (result.success) {
                console.log("✅ Test successful!");
            }
            else {
                console.log("❌ Test failed!");
            }
        }
        catch (error) {
            console.error("Error during test:", error);
        }
    });
}
function testRetrieveConsumerUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Testing Gueno Service - Retrieve User");
            console.log("-----------------------------------");
            const userId = "test-user-1750082498330";
            console.log(`Attempting to retrieve user with ID: ${userId}`);
            const response = yield gueno_1.default.retrieveConsumer(userId);
            console.log("\nResponse:");
            console.log(JSON.stringify(response, null, 2));
            if (response) {
                console.log("\n✅ Successfully retrieved user data");
            }
            else {
                console.log("\n❌ Failed to retrieve user data");
                console.log(`Error: ${response}`);
            }
        }
        catch (error) {
            console.error("\n❌ Error occurred during test:");
            console.error(error);
        }
    });
}
function testUpdateConsumerUser() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield gueno_1.default.updateConsumer(event);
            console.log(response);
        }
        catch (error) {
            console.error("\n❌ Error occurred during test:");
            console.error(error);
        }
    });
}
function testVerifyTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Testing Gueno Service - Verify Transaction");
            console.log("-----------------------------------");
            const response = yield gueno_1.default.verifyTransaction(simulated_data_test_1.simulatedIBANTransaction);
            console.log(response);
        }
        catch (error) {
            console.error("\n❌ Error occurred during test:");
            console.error(error);
        }
    });
}
function testGetTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Testing Gueno Service - Get Transaction");
            console.log("-----------------------------------");
            const transactionId = "jm-test-transaction-1750457865828";
            const response = yield gueno_1.default.getTransaction(transactionId);
            console.log(response);
        }
        catch (error) {
            console.error("\n❌ Error occurred during test:");
            console.error(error);
        }
    });
}
function testUpdateTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
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
            };
            const response = yield gueno_1.default.updateTransaction(transactionId, simulatedChange);
        }
        catch (error) {
            console.error("\n❌ Error occurred during test:");
            console.error(error);
        }
    });
}
// testRetrieveConsumerUser();
// testSimpleCreateConsumerUser();
// testUpdateConsumerUser();
testVerifyTransaction();
//  testGetTransaction();
// testUpdateTransaction();
