// PrintShopPage.js

import React from 'react';
import './PrintShopPage.css';
import ShopifyBuyButton from './ShopifyBuyButton'; // Make sure this component is in the same folder

function PrintShopPage({ setPage }) {
    // All product IDs are now in the correct numerical format.
    const products = [
        { shopifyId: '10191930229074', name: 'Batman Says Hoof', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/75a4e9c6-ef2e-4df1-9d48-f79a40739b26/IMG_5263.jpeg?format=1000w', description: "A reminder that even our greatest heroes are grounded in a strange and simple humanity.", price: "25.00" },
        { shopifyId: '10191937208658', name: 'The Whispering Teapot', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/c9611c72-7e84-4dd2-96ce-749d1572ceb8/IMG_5257.jpeg?format=1000w', description: "For all the wonderful plans and dreams that are still waiting to be brewed.", price: "25.00" },
        { shopifyId: '10191940223314', name: 'The Last Act', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/987b2bd3-620c-46f5-949c-2ba1a4c903a6/IMG_5286.jpeg?format=1000w', description: "A powerful reminder that the final act of rebellion is always kindness.", price: "25.00" },
        { shopifyId: '10191944319314', name: 'The ReSorceress', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/c0044d8c-476e-45e3-87b0-114b1e88de88/IMG_5285.jpeg?format=1000w', description: "Celebrating the magic of resourcefulness and the power to free oneself from within.", price: "25.00" },
        { shopifyId: '10191948742994', name: 'The Hugged Hippo', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/c4af4978-1b13-432d-b7c0-1adf09e9cdb2/IMG_5251.jpeg?format=1000w', description: "On the importance of showing your interests and accepting affection, both spiritual and physical.", price: "25.00" },
        { shopifyId: '10191955263826', name: 'The Moment You Most Dread', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/cbd4dde7-eb6d-47b0-85a9-b3e81a8ccd1f/IMG_5249.jpeg?format=1000w', description: "A reminder that the moment you fear the most may yet be your greatest new beginning.", price: "25.00" },
        { shopifyId: '10191957557586', name: 'The Ghost Ship', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/510cc2bb-0b60-4ec2-bd83-52547fd06fac/IMG_5245.jpeg?format=1000w', description: "A strange and vital question for the soul: why honk not at the ghost ship?", price: "25.00" },
        { shopifyId: '10191959818578', name: 'The Bridge Between Ears', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/735dda44-ec76-48ef-b857-86d2ec0bc72f/IMG_5239.jpeg?format=1000w', description: "Bless all those that fall from the precarious bridge between one thought and another.", price: "25.00" }
    ];

    const pageStyles = `
        .shop-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        .shop-intro-text {
            font-size: 1.2rem;
            line-height: 1.6;
        }
        .product-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
        }
        .product-description {
            font-size: 1rem;
            font-style: italic;
        }
        .product-details {
            font-size: 1rem;
        }
        .product-price {
            font-size: 1.15rem;
            font-weight: 700;
        }
        .shop-footer .security-note p {
            font-size: 0.9rem; 
        }
    `;

    return (
        <>
            <style>{pageStyles}</style>
            <div className="page-container">
                <header className="shop-header">
                    <h1>The August Collection</h1>
                    <p className="shop-intro-text">
                        Each month, Archangel Gerry carefully selects a special collection of eight cards whose wisdom is particularly resonant with the current cosmic tides. These prints are made available for a limited time only. Explore this month's curated gallery and acquire a piece of timely guidance before the collection vanishes back into the ether at the month's end.
                    </p>
                </header>

                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.shopifyId} className="product-card">
                            <div className="product-image-container">
                                <img src={product.imageSrc} alt={product.name} className="product-image" />
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="product-description">"{product.description}"</p>
                                <p className="product-details">High-quality A4 print, personally signed by Archangel Gerry.</p>
                                <p className="product-price">€{product.price}</p>
                                
                                <ShopifyBuyButton productId={product.shopifyId} />
                            </div>
                        </div>
                    ))}
                </div>
                
                <footer className="shop-footer">
                    <div className="security-note">
                        <p>
                            A Note on Earthly Transactions: To ensure your purchase is completely secure, all payments are handled by our trusted partners at Shopify. Archangel Gerry, while an expert in celestial matters, prefers to leave the complexities of earthly finances to the professionals. Your data is safe.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default PrintShopPage;