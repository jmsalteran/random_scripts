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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIntercomService = void 0;
const intercom_service_1 = require("./intercom.service");
function testIntercomService() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Starting Intercom service test...");
            const intercomService = new intercom_service_1.IntercomService();
            // Test 1: Search for conversations with state "close"
            console.log("\n1. Searching for closed conversations...");
            const closedConversations = yield intercomService.getClosedConversations(10);
            console.log(`Found ${closedConversations.length} closed conversations`);
            if (closedConversations.length > 0) {
                console.log("Sample closed conversation:");
                console.log(JSON.stringify(closedConversations[0], null, 2));
            }
            // Test 2: Search with custom parameters
            console.log("\n2. Testing custom search parameters...");
            const searchResponse = yield intercomService.searchConversations({
                state: "close",
                limit: 5
            });
            console.log(`Search returned ${searchResponse.conversations.length} conversations`);
            // Test 3: Get a specific conversation if we have one
            if (closedConversations.length > 0) {
                console.log("\n3. Getting specific conversation details...");
                const conversationId = closedConversations[0].id;
                const conversation = yield intercomService.getConversation(conversationId);
                console.log(`Retrieved conversation ${conversationId}:`);
                console.log(`- State: ${conversation.state}`);
                console.log(`- Created: ${new Date(conversation.created_at * 1000).toISOString()}`);
                console.log(`- Updated: ${new Date(conversation.updated_at * 1000).toISOString()}`);
            }
            return {
                success: true,
                data: {
                    totalClosedConversations: closedConversations.length,
                    sampleConversation: closedConversations[0] || null
                }
            };
        }
        catch (error) {
            console.error("Intercom service test failed:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    });
}
exports.testIntercomService = testIntercomService;
// Run the test if this file is executed directly
if (require.main === module) {
    testIntercomService()
        .then((result) => {
        console.log("\nTest completed:", result);
        process.exit(result.success ? 0 : 1);
    })
        .catch((error) => {
        console.error("Test failed:", error);
        process.exit(1);
    });
}
