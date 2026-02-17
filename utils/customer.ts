import { shopify } from './shopify';

// Helper to execute raw GraphQL queries via shopify-buy client (if supported) or fetch
const executeQuery = async (query: string, variables: any) => {
  // shopify-buy v3 doesn't expose a generic 'request' method easily in TypeScript types sometimes,
  // but the underlying client usually has it. 
  // If not, we fall back to a direct fetch using the config from the client.

  // @ts-ignore - accessing internal or un-typed property if necessary, or strictly using fetch
  if (shopify && typeof shopify.fetch === 'function') {
    // @ts-ignore
    return shopify.fetch(query, variables);
  }

  // Fallback to fetch
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) {
    throw new Error('Shopify configuration missing');
  }

  const url = `https://${domain}/api/2024-01/graphql.json`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
};

export const customer = {
  login: async (email: string, password: string) => {
    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password
      }
    };

    try {
      const result = await executeQuery(mutation, variables);
      const data = result.data?.customerAccessTokenCreate;

      if (data?.customerUserErrors?.length > 0) {
        throw new Error(data.customerUserErrors[0].message);
      }

      return data?.customerAccessToken;
    } catch (e) {
      console.error("Login failed", e);
      throw e;
    }
  },

  register: async (email: string, password: string) => {
    const mutation = `
        mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
                customer {
                    id
                    email
                }
                customerUserErrors {
                    code
                    field
                    message
                }
            }
        }
    `;

    const variables = {
      input: {
        email,
        password
      }
    };

    try {
      const result = await executeQuery(mutation, variables);
      const data = result.data?.customerCreate;

      if (data?.customerUserErrors?.length > 0) {
        throw new Error(data.customerUserErrors[0].message);
      }

      return data?.customer;
    } catch (e) {
      console.error("Registration failed", e);
      throw e;
    }
  }
};
