import axios, { AxiosInstance } from "axios";
import GuenoService from "./gueno";
import { testUser, simulatedTransaction, simulatedIBANTransaction, simulatedCRYPTOTransaction } from "./simulated-data.test";
import { ConsumerEvent, Tag } from "./gueno.type";


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

    const response = await GuenoService.verifyTransaction(simulatedCRYPTOTransaction);
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

async function testGetConsumerList() {
  try {
    console.log("Testing Gueno Service - Get Consumer List");
    console.log("----------------------------------------");

    // Test parameters: 2 per page, get 4 total (2 pages)
    const testParams = {
      viewMode: "true",
      limit: 2,
      offset: 1
    };

    console.log("Requesting consumer list with parameters:", JSON.stringify(testParams, null, 2));

    const response = await GuenoService.getConsumerList(testParams);
    
    console.log("\nResponse:");
    console.log(JSON.stringify(response, null, 2));

    if (response.success) {
      console.log("\n✅ Successfully retrieved consumer list");
      console.log(`📊 Pagination Info:`);
      console.log(`   - Total Elements: ${response.pagination.totalElements}`);
      console.log(`   - Elements Per Page: ${response.pagination.elementsPerPage}`);
      console.log(`   - Current Page: ${response.pagination.currentPage}`);
      console.log(`   - Consumers Retrieved: ${response.data.length}`);
    } else {
      console.log("\n❌ Failed to retrieve consumer list");
      console.log(`Error: ${response.message}`);
    }
  } catch (error) {
    console.error("\n❌ Error occurred during test:");
    console.error(error);
  }
}

async function updateAllUsersWithStandardTags() {
  try {
    console.log("Testing Gueno Service - Update All Users with Standard Tags");
    console.log("----------------------------------------------------------");

    let allUsers: any[] = [];
    let currentPage = 1;
    const limit = 50; // Process 50 users at a time
    let hasMoreUsers = true;

    // Fetch all users using pagination
    while (hasMoreUsers) {
      console.log(`\n📄 Fetching page ${currentPage}...`);
      
      const testParams = {
        viewMode: "true",
        limit: limit,
        offset: (currentPage - 1) * limit
      };

      const response = await GuenoService.getConsumerList(testParams);
      
      if (response.success && response.data && response.data.length > 0) {
        allUsers = allUsers.concat(response.data);
        console.log(`✅ Retrieved ${response.data.length} users from page ${currentPage}`);
        
        // Check if there are more pages
        const totalElements = response.pagination.totalElements;
        const currentOffset = (currentPage - 1) * limit;
        hasMoreUsers = currentOffset + response.data.length < totalElements;
        currentPage++;
      } else {
        console.log("❌ Failed to retrieve users or no more users found");
        hasMoreUsers = false;
      }
    }

    console.log(`\n📊 Total users retrieved: ${allUsers.length}`);

    if (allUsers.length === 0) {
      console.log("❌ No users found to update");
      return;
    }

    // Define the tags to add
    const newTags: Tag[] = [
      {
        key: "transactionSpeedType",
        value: "STANDARD"
      },
      {
        key: "transactionVolumeType", 
        value: "STANDARD"
      }
    ];

    console.log(`\n🔄 Starting to update ${allUsers.length} users with tags:`, JSON.stringify(newTags, null, 2));

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // Update each user with the new tags
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const userId = user.id;
      
      console.log(`\n[${i + 1}/${allUsers.length}] Updating user: ${userId}`);
      
      try {
        // Create the consumer event for updating tags
        const updateEvent: ConsumerEvent = {
          timestamp: Math.floor(Date.now()),
          userId: userId,
          eventId: `update-tags-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          reason: "Bulk update to add standard transaction tags",
          eventDescription: "Adding transactionSpeedType and transactionVolumeType tags with STANDARD values",
          updatedConsumerUserAttributes: {
            tags: newTags
          }
        };

        const response = await GuenoService.updateConsumer(updateEvent);
        
        if (response.success) {
          console.log(`✅ Successfully updated user ${userId}`);
          successCount++;
        } else {
          console.log(`❌ Failed to update user ${userId}: ${response.message}`);
          failureCount++;
          errors.push(`User ${userId}: ${response.message}`);
        }

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`❌ Error updating user ${userId}:`, error);
        failureCount++;
        errors.push(`User ${userId}: ${error}`);
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 UPDATE SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total users processed: ${allUsers.length}`);
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${failureCount}`);
    console.log(`📊 Success rate: ${((successCount / allUsers.length) * 100).toFixed(2)}%`);

    if (errors.length > 0) {
      console.log("\n❌ Errors encountered:");
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    console.log("\n🎯 Tags added to each user:");
    newTags.forEach(tag => {
      console.log(`   - ${tag.key}: ${tag.value}`);
    });

  } catch (error) {
    console.error("\n❌ Error occurred during bulk update:");
    console.error(error);
  }
}

// testRetrieveConsumerUser();
// testSimpleCreateConsumerUser();
// testUpdateConsumerUser();
//testVerifyTransaction();
//  testGetTransaction();
// testUpdateTransaction();
// testGetConsumerList();
updateAllUsersWithStandardTags();