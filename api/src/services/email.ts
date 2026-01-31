import { EmailClient } from "@azure/communication-email";

export class EmailService {
    private client: EmailClient;
    private senderAddress: string;

    constructor() {
        const connectionString = process.env.ACS_CONNECTION_STRING;
        this.senderAddress = process.env.EMAIL_SENDER_ADDRESS || "DoNotReply@avismerate.it";

        if (!connectionString) {
            console.warn("ACS_CONNECTION_STRING is not defined. Email dispatch will fail.");
            this.client = {} as any;
        } else {
            this.client = new EmailClient(connectionString);
        }
    }

    async sendOtp(toEmail: string, otpCode: string) {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta';

        if (!isProduction) {
            console.log(`[DEV MODE] OTP Simulation -> To: ${toEmail}, Code: ${otpCode}`);
            return;
        }

        if (!this.client.beginSend) throw new Error("Email Client not initialized (Missing ACS_CONNECTION_STRING)");

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

        const poller = await this.client.beginSend(emailMessage);
        return await poller.pollUntilDone();
    }

    async sendConfirmation(toEmail: string) {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta';

        if (!isProduction) {
            console.log(`[DEV MODE] Confirmation Email Simulation -> To: ${toEmail}`);
            return;
        }

        if (!this.client.beginSend) throw new Error("Email Client not initialized (Missing ACS_CONNECTION_STRING)");

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

        const poller = await this.client.beginSend(emailMessage);
        return await poller.pollUntilDone();
    }
}
