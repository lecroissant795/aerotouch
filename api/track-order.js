
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    const { orderNumber, email } = req.body;

    if (!orderNumber || !email) {
        return res.status(400).json({ error: 'Order number and email are required.' });
    }

    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopDomain || !adminAccessToken) {
        console.error('Missing Shopify configuration');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // Clean up order number (remove # if present)
        const cleanOrderNumber = orderNumber.replace('#', '').trim();

        // Shopify GraphQL query to find the order
        // We search by name (e.g. "#1001") and email
        const query = `
      query {
        orders(first: 1, query: "name:#${cleanOrderNumber} AND email:${email}") {
          edges {
            node {
              name
              email
              displayFulfillmentStatus
              createdAt
              currentTotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    originalUnitPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    variant {
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
              shippingAddress {
                name
                address1
                address2
                city
                province
                zip
                country
              }
              fulfillments(first: 1) {
                status
                trackingInfo(first: 1) {
                  number
                  url
                  company
                }
              }
            }
          }
        }
      }
    `;

        const response = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminAccessToken,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Shopify API Errors:', data.errors);
            return res.status(500).json({ error: 'Failed to fetch order.' });
        }

        const orders = data.data.orders.edges;

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found. Please check your details.' });
        }

        const order = orders[0].node;

        // Transform data for frontend
        // Map Shopify status to frontend status
        let status = 'Processing';
        let estimatedDelivery = 'Calculating...';

        // Basic status mapping logic
        if (order.displayFulfillmentStatus === 'FULFILLED') {
            status = 'Delivered';
        } else if (order.displayFulfillmentStatus === 'PARTIALLY_FULFILLED') {
            status = 'Shipped';
        } else if (order.displayFulfillmentStatus === 'IN_PROGRESS') {
            status = 'Processing';
        } else if (order.displayFulfillmentStatus === 'UNFULFILLED') {
            status = 'Processing';
        }

        // Calculate estimated delivery (simplified - 3-5 business days from now)
        if (status === 'Shipped' || status === 'Processing') {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 4); // Add 4 days as estimate
            estimatedDelivery = deliveryDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
            });
        } else if (status === 'Delivered') {
            estimatedDelivery = 'Delivered';
        }

        return res.status(200).json({
            orderNumber: order.name,
            email: order.email,
            status: status,
            estimatedDelivery: estimatedDelivery,
            // Add more transformed fields as needed
            rawData: order // For debugging/development - includes all order data
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
