import { Global, Module } from '@nestjs/common';
import { ClientSecretCipher } from './client-secret-cipher.service';

/**
 * Provides {@link ClientSecretCipher} globally so both the store layer
 * (sealing/verifying on write) and the OIDC client authenticator (reading the
 * raw secret for HMAC client assertions) share one instance and key.
 */
@Global()
@Module({
  providers: [ClientSecretCipher],
  exports: [ClientSecretCipher],
})
export class SecretCipherModule {}
