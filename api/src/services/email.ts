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

    private getTemplate(title: string, bodyContent: string): string {
        const logoUrl = "https://openavismeratestorage.blob.core.windows.net/public-assets/Logo_AVIS.png";
        const year = new Date().getFullYear();

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #e9ecef;">
                    <img src="${logoUrl}" alt="AVIS Merate Logo" style="max-width: 150px; height: auto;">
                </div>

                <!-- Body -->
                <div style="padding: 30px 20px;">
                    <h2 style="color: #d9534f; margin-top: 0;">${title}</h2>
                    ${bodyContent}
                </div>

                <!-- Footer -->
                <div style="background-color: #f1f1f1; padding: 20px; font-size: 12px; color: #666666; text-align: center; border-top: 1px solid #e9ecef;">
                    <div style="margin-bottom: 15px;">
                        <img src="${logoUrl}" alt="AVIS Merate" style="max-width: 80px; opacity: 0.8;">
                    </div>
                    
                    <p style="margin: 5px 0;"><strong>AVIS Comunale di Merate ODV</strong></p>
                    <p style="margin: 5px 0;">Piazza Don Giovanni Minzoni, 5, 23807 Merate (LC)</p>
                    <p style="margin: 5px 0;">C.F. 94003940130</p>
                    
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd;">
                        <p style="margin: 5px 0;">
                            Tel: <a href="tel:+390399902303" style="color: #d9534f; text-decoration: none;">039 9902303</a> | 
                            Email: <a href="mailto:info@avismerate.it" style="color: #d9534f; text-decoration: none;">info@avismerate.it</a>
                        </p>
                        <p style="margin: 5px 0;">
                            PEC: <a href="mailto:merate.comunale@pec.avis.it" style="color: #d9534f; text-decoration: none;">merate.comunale@pec.avis.it</a>
                        </p>
                    </div>

                    <div style="margin-top: 15px; font-size: 11px;">
                        <a href="https://avismerate.it/privacy-policy" style="color: #666666; text-decoration: underline;">Privacy & Cookie Policy</a> | 
                        <a href="https://avisprovincialelecco.it" style="color: #666666; text-decoration: underline;">AVIS Provinciale Lecco</a> | 
                        <a href="https://avislombardia.it/" style="color: #666666; text-decoration: underline;">AVIS Regionale Lombardia</a> | 
                        <a href="https://avis.it" style="color: #666666; text-decoration: underline;">AVIS Nazionale</a>
                    </div>

                    <p style="margin-top: 20px; font-size: 10px; color: #999999;">
                        &copy; ${year} AVIS Merate. Tutti i diritti riservati.<br>
                        Ricevi questa email perché hai richiesto un servizio sul nostro sito.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    async sendOtp(toEmail: string, otpCode: string) {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta';

        if (!isProduction) {
            console.log(`[DEV MODE] OTP Simulation -> To: ${toEmail}, Code: ${otpCode}`);
            return;
        }

        if (!this.client.beginSend) throw new Error("Email Client not initialized (Missing ACS_CONNECTION_STRING)");

        const htmlContent = `
            <p>Ciao,</p>
            <p>Il tuo codice verifica per completare la registrazione è:</p>
            <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d9534f;">${otpCode}</span>
            </div>
            <p>Il codice è valido per 5 minuti.</p>
            <p>Se non hai richiesto tu questo codice, ignora questa email.</p>
        `;

        const emailMessage = {
            senderAddress: this.senderAddress,
            content: {
                subject: "Codice OTP per candidatura AVIS",
                plainText: `Il tuo codice OTP è: ${otpCode}`,
                html: this.getTemplate("Conferma la tua Email", htmlContent)
            },
            recipients: {
                to: [{ address: toEmail }]
            }
        };

        const poller = await this.client.beginSend(emailMessage);
        return await poller.pollUntilDone();
    }

    async sendConfirmation(toEmail: string, firstName: string = "Candidato") {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta';

        if (!isProduction) {
            console.log(`[DEV MODE] Confirmation Email Simulation -> To: ${toEmail}`);
            return;
        }

        if (!this.client.beginSend) throw new Error("Email Client not initialized (Missing ACS_CONNECTION_STRING)");

        const htmlContent = `
            <p>Gentile ${firstName},</p>
            <p>Grazie per esserti candidato come donatore AVIS. Abbiamo ricevuto correttamente la tua richiesta.</p>
            <div style="background-color: #e8f4fe; border-left: 4px solid #0275d8; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #025aa5;"><strong>Prossimi passi:</strong></p>
                <p style="margin: 5px 0 0;">Un nostro responsabile ti contatterà per fissare un primo colloquio conoscitivo.</p>
            </div>
            <p>Nel frattempo, puoi visitare il nostro sito per ulteriori informazioni sulla donazione.</p>
            <br/>
            <p>A presto,<br/>Lo staff di AVIS Merate</p>
        `;

        const emailMessage = {
            senderAddress: this.senderAddress,
            content: {
                subject: "Candidatura Ricevuta - AVIS Merate",
                plainText: "Grazie! Abbiamo ricevuto la tua candidatura. Verrai contattato a breve.",
                html: this.getTemplate("Candidatura Ricevuta", htmlContent)
            },
            recipients: {
                to: [{ address: toEmail }]
            }
        };

        const poller = await this.client.beginSend(emailMessage);
        return await poller.pollUntilDone();
    }
}
