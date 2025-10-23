export interface ClientStore {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  tokenEndpointAuthMethod:
    | 'client_secret_basic'
    | 'client_secret_post'
    | 'none';
  metadata?: {
    name: string;
    description?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}
