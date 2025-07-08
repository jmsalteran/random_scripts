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
const kulipa_service_1 = require("./kulipa.service");
require("dotenv/config");
function testCreateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const kulipaService = new kulipa_service_1.KulipaService();
        const userData = {
            wallet: {
                blockchain: "polygon-amoy",
                address: "0xed2456914e48c1e17b7bd922177291ef8b7f553edf1b1f66b6fc1a076524b22f",
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
            const result = yield kulipaService.createUser(userData);
            console.log("User created successfully:", JSON.stringify(result, null, 2));
        }
        catch (error) {
            //console.error("Error creating user:", error);
        }
    });
}
// Run the test
testCreateUser();
