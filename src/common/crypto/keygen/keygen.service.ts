import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class KeygenService {
    async generateTenantEncryptionKey(): Promise<string> {
        // Implement your key generation logic here
        // For example, you can use the crypto module to generate a random key

        return crypto.randomBytes(32).toString('base64'); // Generate a 256-bit key
    }

    async generateNonce(): Promise<string> {
        // Generate a random nonce value
        return crypto.randomBytes(16).toString('base64'); // Generate a 128-bit nonce
    }
}
