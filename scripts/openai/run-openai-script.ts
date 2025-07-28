import { OpenAIService } from "./openai.service";

interface RainCustomerCode {
  code: string;
  name: string;
}
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

async function testRainOccupationCodeAI() {
  const userOccupation = "Ranger and hunter";
  const rainOccupationCode = await OpenAIService.getRainOccupationCodeAI(userOccupation);

  if (rainOccupationCode == null) {
    return "null";
  }

  const cleaned = rainOccupationCode.replace(/^"+|"+$/g, "").replace(/'/g, '"');
  console.log(rainOccupationCode);

  try {
    const parsedResponse = JSON.parse(cleaned);
    
    if (
      parsedResponse && 
      typeof parsedResponse === 'object' &&
      typeof parsedResponse.code === 'string' &&
      typeof parsedResponse.name === 'string' &&
      parsedResponse.code.trim() !== '' &&
      parsedResponse.name.trim() !== ''
    ) {
      console.log(parsedResponse);
      return parsedResponse as RainCustomerCode;
    } else {
      console.log("AI response does not have proper RainCustomerCode shape");
      return "null";
    }
  } catch (parseError) {
    return "null";
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  // testOpenAIService();
  testRainOccupationCodeAI();
} 