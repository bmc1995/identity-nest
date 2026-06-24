import { ClientSecretCipher } from './client-secret-cipher.service';

describe('ClientSecretCipher', () => {
  let cipher: ClientSecretCipher;

  beforeEach(() => {
    process.env.CLIENT_SECRET_ENC_KEY = 'unit-test-key';
    cipher = new ClientSecretCipher();
  });

  afterEach(() => {
    delete process.env.CLIENT_SECRET_ENC_KEY;
  });

  it('round-trips a secret through encrypt/decrypt', () => {
    const secret = 's3cret-value-äöü-🔐';
    const sealed = cipher.encrypt(secret);
    expect(sealed).toMatch(/^v1\./);
    expect(sealed).not.toContain(secret);
    expect(cipher.decrypt(sealed)).toBe(secret);
  });

  it('produces a fresh IV (distinct ciphertext) each call', () => {
    expect(cipher.encrypt('same')).not.toBe(cipher.encrypt('same'));
  });

  it('verifies the correct secret and rejects a wrong one', () => {
    const sealed = cipher.encrypt('correct-horse');
    expect(cipher.verify('correct-horse', sealed)).toBe(true);
    expect(cipher.verify('wrong-horse', sealed)).toBe(false);
  });

  it('fails verification on a tampered authentication tag rather than throwing', () => {
    const sealed = cipher.encrypt('tamper-target');
    const parts = sealed.split('.');
    // Flip the leading character of the GCM tag — any tag change fails auth.
    const tag = parts[2];
    parts[2] = (tag.startsWith('A') ? 'B' : 'A') + tag.slice(1);
    expect(cipher.verify('tamper-target', parts.join('.'))).toBe(false);
  });

  it('cannot decrypt a value sealed under a different key', () => {
    const sealed = cipher.encrypt('keyed');
    process.env.CLIENT_SECRET_ENC_KEY = 'a-different-key';
    const other = new ClientSecretCipher();
    expect(other.verify('keyed', sealed)).toBe(false);
  });
});
