/**
 * OTP Document structure for Cosmos DB
 * Includes TTL for automatic cleanup after 5 minutes
 */
export interface OtpDocument {
    id: string;          // email del donatore (usato come document ID)
    email: string;       // partition key (stesso dell'id per semplicità)
    code: string;        // il codice OTP a 6 cifre
    ttl: number;         // TTL in secondi (300 = 5 minuti) - auto-cleanup
    createdAt: string;   // ISO timestamp della creazione
}
