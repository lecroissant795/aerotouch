Task: Map `@secondaryproductpage.ts` to Shopify product tags and make the logic detect the main product vs secondary product automatically.

Goal:
I need you to update the logic so `@secondaryproductpage.ts` is applied only to the secondary product, not the main product.

Requirements:
1. Read Shopify product tags for the products being rendered.
2. Determine which product is the **main product** (should be the one with the massage insoles) and which is the **secondary product**.
3. Apply the logic inside `@secondaryproductpage.ts` only to the secondary product.
4. Do not apply the secondary-product TypeScript logic to the main product.
5. Make the implementation clean, reusable, and easy to extend.

What I want you to do:
- Inspect how products are currently loaded/rendered.
- Identify where Shopify product tags are available in the data object.
- Create a mapping rule based on tags, for example:
  - main product → tag like `main-product`
  - secondary product → tag like `secondary-product`
- If different tag names already exist in the store, use the existing tags instead of inventing new ones.
- Add a clear helper function such as:
  - `isMainProduct(product)`
  - `isSecondaryProduct(product)`
- Ensure `@secondaryproductpage.ts` runs only when `isSecondaryProduct(product)` returns true.

Logic expectation:
- If a product has the secondary-product tag, apply `@secondaryproductpage.ts`.
- If a product has the main-product tag, do not apply `@secondaryproductpage.ts`.
- If both products are present on the page, correctly distinguish them.
- If tags are missing, fail safely and avoid applying the secondary logic to the wrong product.

Implementation details:
- Keep the logic typed properly in TypeScript.
- Avoid hardcoding fragile assumptions unless necessary.
- Centralize the product-tag detection logic in one place.
- Add comments explaining how the main vs secondary product detection works.

Output I want from you:
1. Explain how the current flow works.
2. Show exactly where to map Shopify tags.
3. Update the code so the TS file is bound only to the secondary product.
4. Return the final edited code.
5. Briefly mention any assumptions made about Shopify tag names or product data structure.