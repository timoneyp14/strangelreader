import React from 'react';
import './PrintShopPage.css'; // We will create this CSS file next.

// This is the main component for your new shop page.
function PrintShopPage({ setPage }) {
    // This is sample data. A human developer can later connect this to a real product database.
    const products = [
        { id: 1, name: 'Batman Says Hoof', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/75a4e9c6-ef2e-4df1-9d48-f79a40739b26/IMG_5263.jpeg?format=1000w', description: "A reminder that even our greatest heroes are grounded in a strange and simple humanity.", price: "25.00" },
        { id: 2, name: 'The Whispering Teapot', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/c9611c72-7e84-4dd2-96ce-749d1572ceb8/IMG_5257.jpeg?format=1000w', description: "For all the wonderful plans and dreams that are still waiting to be brewed.", price: "25.00" },
        { id: 3, name: 'The Last Act', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/987b2bd3-620c-46f5-949c-2ba1a4c903a6/IMG_5286.jpeg?format=1000w', description: "A powerful reminder that the final act of rebellion is always kindness.", price: "25.00" },
        { id: 4, name: 'The ReSorceress', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/c0044d8c-476e-45e3-87b0-114b1e88de88/IMG_5285.jpeg?format=1000w', description: "Celebrating the magic of resourcefulness and the power to free oneself from within.", price: "25.00" },
        { id: 5, name: 'The Hugged Hippo', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/c4af4978-1b13-432d-b7c0-1adf09e9cdb2/IMG_5251.jpeg?format=1000w', description: "On the importance of showing your interests and accepting affection, both spiritual and physical.", price: "25.00" },
        { id: 6, name: 'The Moment You Most Dread', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/cbd4dde7-eb6d-47b0-85a9-b3e81a8ccd1f/IMG_5249.jpeg?format=1000w', description: "A reminder that the moment you fear the most may yet be your greatest new beginning.", price: "25.00" },
        { id: 7, name: 'The Ghost Ship', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/510cc2bb-0b60-4ec2-bd83-52547fd06fac/IMG_5245.jpeg?format=1000w', description: "A strange and vital question for the soul: why honk not at the ghost ship?", price: "25.00" },
        { id: 8, name: 'The Bridge Between Ears', imageSrc: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/735dda44-ec76-48ef-b857-86d2ec0bc72f/IMG_5239.jpeg?format=1000w', description: "Bless all those that fall from the precarious bridge between one thought and another.", price: "25.00" }
    ];

    return (
        <div className="page-container">
            <header className="shop-header">
                <h1>The Strangel Print Shop</h1>
                <p className="shop-intro-text">
                    Welcome to the gallery. Each Strangel Card is a unique piece of art, a window into a strange and wonderful truth. Here you can acquire a high-quality print of the cards that resonate most with you.
                </p>
                
                <div className="monthly-collection-box">
                    <h2>The August Collection</h2>
                    <p>
                        Each month, Archangel Gerry carefully selects a special collection of eight cards whose wisdom is particularly resonant with the current cosmic tides. These prints are made available for a limited time only. Explore this month's curated gallery and acquire a piece of timely guidance before the collection vanishes back into the ether at the month's end.
                    </p>
                </div>

                <div className="security-note">
                    <p>
                        A Note on Earthly Transactions: To ensure your purchase is completely secure, all payments are handled by our trusted partners at Shopify. Archangel Gerry, while an expert in celestial matters, prefers to leave the complexities of earthly finances to the professionals. Your data is safe.
                    </p>
                </div>
            </header>

            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container">
                            <img src={product.imageSrc} alt={product.name} className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="product-description">"{product.description}"</p>
                            <p className="product-details">High-quality A4 print, personally signed by Archangel Gerry.</p>
                            <p className="product-price">€{product.price}</p>
                            <button className="add-to-cart-button">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PrintShopPage;
