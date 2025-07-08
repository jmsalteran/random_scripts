import { KulipaService } from "./kulipa.service";
import "dotenv/config";

async function testCreateUser() {
  const kulipaService = new KulipaService();

  const userData = {
    wallet: {
      blockchain: "polygon-amoy",
      address:
        "0xed2456914e48c1e17b7bd922177291ef8b7f553edf1b1f66b6fc1a076524b22f",
    },
    address: {
      address1: "20 W 34th St.",
      postalCode: "10001",
      city: "New York",
      country: "US",
    },
    lastName: "Doe",
    firstName: "Johnny",
    email: "user@kulipa.xyz",
    dateOfBirth: "2000-12-31",
    countryOfResidence: "FR",
    countryOfBirth: "FR",
  };

  try {
    const result = await kulipaService.createUser(userData);
    console.log("User created successfully:", JSON.stringify(result, null, 2));
  } catch (error) {
    //console.error("Error creating user:", error);
  }
}

// Run the test
testCreateUser();
