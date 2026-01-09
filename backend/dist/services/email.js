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
exports.EmailService = void 0;
const communication_email_1 = require("@azure/communication-email");
class EmailService {
    constructor() {
        const connectionString = process.env.ACS_CONNECTION_STRING;
        this.senderAddress = process.env.EMAIL_SENDER_ADDRESS || "DoNotReply@avismerate.it";
        if (!connectionString) {
            console.warn("ACS_CONNECTION_STRING is not defined. Email dispatch will fail.");
            // We initialize with a potentially invalid state but methods should check or fail gracefully?
            // Actually, EmailClient throws if connection string is empty.
            // We'll simulate a dummy client or handle it.
            // For now, assume it's set in Prod/Beta, warn in local.
            this.client = {};
        }
        else {
            this.client = new communication_email_1.EmailClient(connectionString);
        }
    }
    sendOtp(toEmail, otpCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta';
            if (!isProduction) {
                console.log(`[DEV MODE] OTP Simulation -> To: ${toEmail}, Code: ${otpCode}`);
                return;
            }
            if (!this.client.beginSend)
                throw new Error("Email Client not initialized (Missing ACS_CONNECTION_STRING)");
            const emailMessage = {
                senderAddress: this.senderAddress,
                content: {
                    subject: "Codice OTP per candidatura AVIS",
                    plainText: `Il tuo codice OTP valido per la candidatura è: ${otpCode}`,
                    html: `
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h1 style="color: #d9534f;">Conferma Candidatura</h1>
                        <p>Il tuo codice OTP per completare la registrazione è:</p>
                        <h2 style="background-color: #f4f4f4; padding: 10px; display: inline-block;">${otpCode}</h2>
                        <p>Se non hai richiesto tu questo codice, ignora questa email.</p>
                    </body>
                </html>`
                },
                recipients: {
                    to: [{ address: toEmail }]
                }
            };
            const poller = yield this.client.beginSend(emailMessage);
            return yield poller.pollUntilDone();
        });
    }
    sendConfirmation(toEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta';
            if (!isProduction) {
                console.log(`[DEV MODE] Confirmation Email Simulation -> To: ${toEmail}`);
                return;
            }
            if (!this.client.beginSend)
                throw new Error("Email Client not initialized (Missing ACS_CONNECTION_STRING)");
            const emailMessage = {
                senderAddress: this.senderAddress,
                content: {
                    subject: "Candidatura Ricevuta - AVIS Merate",
                    plainText: "Grazie! Abbiamo ricevuto la tua candidatura. Verrai contattato a breve da un nostro responsabile.",
                    html: `
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h1 style="color: #0275d8;">Candidatura Ricevuta</h1>
                        <p>Grazie per esserti candidato come donatore AVIS.</p>
                        <p>La tua richiesta è stata presa in carico. Un nostro medico o responsabile ti contatterà al numero fornito per fissare un primo colloquio.</p>
                        <br/>
                        <p>A presto,<br/>Lo staff di AVIS Merate</p>
                    </body>
                </html>`
                },
                recipients: {
                    to: [{ address: toEmail }]
                }
            };
            const poller = yield this.client.beginSend(emailMessage);
            return yield poller.pollUntilDone();
        });
    }
}
exports.EmailService = EmailService;
