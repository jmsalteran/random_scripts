import { OpenAIService } from "./openai.service";

async function testOpenAIService() {
  try {
    // Test sending a message to an assistant
    console.log("Testing OpenAI service...");
   
    // Test getting customer name type
    const customerName = "John Doe";
    const nameType = await OpenAIService.getCustomerNameType(customerName);
    console.log("Customer name type:", nameType);
    
  } catch (error) {
    console.error("Error testing OpenAI service:", error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testOpenAIService();
} 