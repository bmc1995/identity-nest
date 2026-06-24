import {
  defaultResponseMode,
  isResponseModeAllowed,
  parseResponseType,
} from './response-type';

describe('parseResponseType', () => {
  it('parses the authorization code flow', () => {
    expect(parseResponseType('code')).toMatchObject({
      hasCode: true,
      hasIdToken: false,
      hasToken: false,
      isNone: false,
    });
  });

  it('parses implicit and hybrid combinations regardless of token order', () => {
    expect(parseResponseType('id_token token')).toMatchObject({
      hasCode: false,
      hasIdToken: true,
      hasToken: true,
    });
    expect(parseResponseType('token id_token code')).toMatchObject({
      hasCode: true,
      hasIdToken: true,
      hasToken: true,
    });
  });

  it('parses none', () => {
    expect(parseResponseType('none')).toMatchObject({ isNone: true });
  });

  it('rejects empty and unsupported values', () => {
    expect(parseResponseType('')).toBeNull();
    expect(parseResponseType('  ')).toBeNull();
    expect(parseResponseType('token')).toBeNull(); // bare OAuth2 token: not OIDC
    expect(parseResponseType('code none')).toBeNull();
    expect(parseResponseType('garbage')).toBeNull();
  });
});

describe('defaultResponseMode', () => {
  it('defaults token-bearing responses to fragment', () => {
    expect(defaultResponseMode(parseResponseType('id_token')!)).toBe('fragment');
    expect(defaultResponseMode(parseResponseType('code token')!)).toBe('fragment');
  });

  it('defaults code and none to query', () => {
    expect(defaultResponseMode(parseResponseType('code')!)).toBe('query');
    expect(defaultResponseMode(parseResponseType('none')!)).toBe('query');
  });
});

describe('isResponseModeAllowed', () => {
  it('refuses query for token-bearing responses', () => {
    expect(isResponseModeAllowed(parseResponseType('id_token')!, 'query')).toBe(
      false,
    );
    expect(
      isResponseModeAllowed(parseResponseType('code id_token')!, 'query'),
    ).toBe(false);
  });

  it('allows fragment everywhere and query for code/none', () => {
    expect(isResponseModeAllowed(parseResponseType('code')!, 'query')).toBe(true);
    expect(isResponseModeAllowed(parseResponseType('code')!, 'fragment')).toBe(
      true,
    );
    expect(isResponseModeAllowed(parseResponseType('id_token')!, 'fragment')).toBe(
      true,
    );
  });
});
