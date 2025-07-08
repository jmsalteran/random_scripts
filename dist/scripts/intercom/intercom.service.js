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
exports.IntercomService = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
class IntercomService {
    constructor() {
        this.apiClient = axios_1.default.create({
            baseURL: "https://api.intercom.io",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "Intercom-Version": "2.13",
                authorization: `Bearer ${process.env.INTERCOM_API_KEY}`,
            },
        });
    }
    // ADMIN LABEL
    // si conversation State close, y admin label es resolve entonces no hago nada
    // si conversation State close, y admin label no es resolve entonces entonces cambio a admin label a resolve
    searchConversations(cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                query: {
                    operator: "AND",
                    value: [
                        {
                            field: "state",
                            operator: "=",
                            value: "closed",
                        },
                    ],
                },
                pagination: Object.assign({ per_page: 1 }, (cursor && { starting_after: cursor })),
            };
            const response = yield this.apiClient.post("/conversations/search", body);
            return response.data;
        });
    }
    getTickets(cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                query: {
                    operator: "AND",
                    value: [
                        {
                            field: "open",
                            operator: "=",
                            value: "false",
                        },
                        {
                            field: "state",
                            operator: "!=",
                            value: "resolved",
                        }
                    ],
                },
                pagination: Object.assign({ per_page: 15 }, (cursor && { starting_after: cursor })),
                sort_by: {
                    field: "created_at",
                    order: "desc"
                }
            };
            const response = yield this.apiClient.post("/tickets/search", body);
            return response.data;
        });
    }
    updateTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                ticket_state_id: "4",
            };
            const response = yield this.apiClient.put(`/tickets/${ticketId}`, body);
            return response.data;
        });
    }
}
exports.IntercomService = IntercomService;
