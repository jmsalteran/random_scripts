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
exports.KulipaService = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
class KulipaService {
    constructor() {
        this.apiClient = axios_1.default.create({
            baseURL: "https://api.testing.kulipa.dev/v1",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "x-api-key": process.env.KULIPA_API_KEY,
            },
        });
    }
    createUser(userData) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiClient.post("/users", userData);
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.log("Failed to create user:", (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.details) === null || _c === void 0 ? void 0 : _c.issues);
                }
                throw error;
            }
        });
    }
}
exports.KulipaService = KulipaService;
