
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
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

    const { orderNumber, email, requestType, reason, items, comments, exchangeSize, exchangeColor } = req.body;

    // Validation
    if (!orderNumber || !email || !requestType || !reason || !items) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (!['return', 'exchange'].includes(requestType)) {
        return res.status(400).json({ error: 'Invalid request type.' });
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

        // First, verify the order exists and belongs to the email
        const verifyQuery = `
            query {
                orders(first: 1, query: "name:#${cleanOrderNumber} AND email:${email}") {
                    edges {
                        node {
                            id
                            name
                            email
                        }
                    }
                }
            }
        `;

        const verifyResponse = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminAccessToken,
            },
            body: JSON.stringify({ query: verifyQuery }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.errors) {
            console.error('Shopify API Errors:', verifyData.errors);
            return res.status(500).json({ error: 'Failed to verify order.' });
        }

        const orders = verifyData.data.orders.edges;

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found. Please check your order number and email.' });
        }

        // Order verified - Now create a note/tag on the order for internal tracking
        // In a real implementation, you might:
        // 1. Create a return label via shipping API
        // 2. Send confirmation email to customer
        // 3. Create an internal ticket in support system
        // 4. Update order tags/notes in Shopify

        // For now, we'll add a note to the order
        const orderId = orders[0].node.id;
        const timestamp = new Date().toISOString();
        
        const noteContent = `[${requestType.toUpperCase()} REQUEST - ${timestamp}]
Reason: ${reason}
Items: ${items}
${requestType === 'exchange' ? `Exchange Size: ${exchangeSize || 'Same'}, Color: ${exchangeColor || 'Same'}` : ''}
Comments: ${comments || 'None'}
Status: Pending`;

        // Add note to order using GraphQL mutation
        const updateMutation = `
            mutation {
                orderUpdate(input: {
                    id: "${orderId}",
                    note: "${noteContent.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
                }) {
                    order {
                        id
                        note
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const updateResponse = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminAccessToken,
            },
            body: JSON.stringify({ query: updateMutation }),
        });

        const updateData = await updateResponse.json();

        if (updateData.errors || updateData.data?.orderUpdate?.userErrors?.length > 0) {
            console.error('Failed to update order:', updateData.errors || updateData.data.orderUpdate.userErrors);
            // Don't fail the request if note update fails - just log it
        }

        // TODO: In production, you would:
        // - Send confirmation email to customer
        // - Generate return shipping label
        // - Create ticket in support system
        // - Notify warehouse/fulfillment team

        return res.status(200).json({
            success: true,
            message: 'Return request submitted successfully',
            requestType: requestType,
            orderNumber: cleanOrderNumber,
            // In production, you might return:
            // - Return tracking number
            // - Return label URL
            // - Expected refund/exchange timeline
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
