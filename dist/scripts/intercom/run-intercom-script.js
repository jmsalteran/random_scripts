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
const intercom_service_1 = require("./intercom.service");
// Simple progress bar implementation
function createProgressBar(current, total, width = 50) {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    const filledWidth = Math.round((width * current) / total);
    const emptyWidth = width - filledWidth;
    const filled = '█'.repeat(filledWidth);
    const empty = '░'.repeat(emptyWidth);
    return `[${filled}${empty}] ${percentage.toFixed(1)}% (${current}/${total})`;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 Iniciando script de Intercom...");
        try {
            const intercomService = new intercom_service_1.IntercomService();
            let totalTickets = 0;
            let updatedTickets = 0;
            let failedTickets = 0;
            let currentPage = 0;
            let currentTicket = 0;
            // First, get the initial response to understand the total structure
            let response = yield intercomService.getTickets();
            totalTickets = response.total_count;
            currentPage++;
            // Process tickets from the first page
            for (const ticket of response.tickets) {
                currentTicket++;
                try {
                    yield intercomService.updateTicket(ticket.id);
                    updatedTickets++;
                }
                catch (error) {
                    failedTickets++;
                }
                // Show progress for current page
                const progress = createProgressBar(currentTicket, totalTickets);
                process.stdout.write(`\r${progress}`);
            }
            // Continue with pagination
            while (response.pages && response.pages.next) {
                currentPage++;
                response = yield intercomService.getTickets(response.pages.next.starting_after);
                for (const ticket of response.tickets) {
                    currentTicket++;
                    try {
                        yield intercomService.updateTicket(ticket.id);
                        updatedTickets++;
                    }
                    catch (error) {
                        failedTickets++;
                    }
                    // Show overall progress
                    const progress = createProgressBar(currentTicket, totalTickets);
                    process.stdout.write(`\r${progress}`);
                }
            }
            // Final statistics
            console.log("\n\n" + "=".repeat(60));
            console.log("📊 ESTADÍSTICAS FINALES");
            console.log("=".repeat(60));
            console.log(`📄 Total de páginas procesadas: ${currentPage}`);
            console.log(`🎫 Total de tickets encontrados: ${totalTickets}`);
            console.log(`✅ Tickets actualizados exitosamente: ${updatedTickets}`);
            console.log(`❌ Tickets con errores: ${failedTickets}`);
            console.log(`📈 Tasa de éxito: ${totalTickets > 0 ? ((updatedTickets / totalTickets) * 100).toFixed(2) : 0}%`);
            console.log("=".repeat(60));
            if (failedTickets > 0) {
                console.log(`⚠️  ${failedTickets} tickets no pudieron ser actualizados.`);
            }
            console.log("🎉 Proceso completado!");
        }
        catch (error) {
            console.error("❌ Error general:", error);
            process.exit(1);
        }
    });
}
// Ejecutar el script
main();
