// ShopifyBuyButton.js

import React, { useEffect } from 'react';

// This is our new, dedicated component for the Shopify button.
function ShopifyBuyButton({ productId }) {
    // This creates a unique ID for the div that Shopify will target for each button.
    // It extracts the raw number from the full 'gid://shopify/Product/...' string.
    const divId = `product-component-${productId.substring(productId.lastIndexOf('/') + 1)}`;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        script.async = true;

        script.onload = () => {
            const client = window.ShopifyBuy.buildClient({
                // --- These values are now correct for your store ---
                domain: 'n6x0en-hg.myshopify.com',
                storefrontAccessToken: '532a2bfe60f1438581fe75db8cdabfb1',
                // ----------------------------------------------------
            });

            window.ShopifyBuy.UI.onReady(client).then((ui) => {
                ui.createComponent('product', {
                    id: productId,
                    node: document.getElementById(divId),
                    moneyFormat: '%E2%82%AC%7B%7Bamount%7D%7D', // This format is for Euros (€).
                    options: {
                        "product": {
                            "styles": {
                                "product": { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0px" } },
                                "button": {
                                    // This makes the button match your purple design!
                                    "background-color": "#5a2d82", // Example purple - change to your exact color
                                    ":hover": { "background-color": "#4e2671" },
                                    "font-family": "Helvetica Neue, sans-serif",
                                    "font-size": "16px",
                                    "padding-top": "16px",
                                    "padding-bottom": "16px",
                                    "border-radius": "8px",
                                }
                            },
                            "layout": "vertical",
                            "contents": {
                                "img": false,
                                "imgWithCarousel": false,
                                "title": false,
                                "variantTitle": false,
                                "price": false,
                                "description": false,
                                "buttonWithQuantity": false,
                                "quantity": false
                            },
                            "text": { "button": "Add to Cart" }
                        },
                        "cart": {
                            "text": { "total": "Subtotal", "button": "Checkout" }
                        },
                    },
                });
            });
        };

        document.body.appendChild(script);

        return () => {
            // This cleans up the script when the component is removed.
            const allScripts = document.getElementsByTagName('script');
            for (let i = 0; i < allScripts.length; i++) {
                if (allScripts[i].src === 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js') {
                    allScripts[i].parentNode.removeChild(allScripts[i]);
                }
            }
        };
    }, [productId, divId]);

    // This is the placeholder div that the script will fill with a button.
    return <div id={divId}></div>;
}

export default ShopifyBuyButton;