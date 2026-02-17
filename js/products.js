// ================================================
// Prime Wear Wholesale - Products Data
// ================================================

const productsData = [
    // Wholesale Products
    {
        id: 1,
        name: "Premium Cotton Blend T-Shirt",
        category: "Clothings",
        type: "wholesale",
        short_description: "High-quality cotton blend t-shirt perfect for bulk orders",
        long_description: "Our premium cotton blend t-shirts are designed for comfort and durability. Made from 60% cotton and 40% polyester, these shirts maintain their shape and color even after multiple washes. Ideal for wholesale buyers looking for quality at competitive prices.",
        price: 45.00,
        wholesale_price: 25.00,
        moq: 10,
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"
        ],
        stock: 500,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Gray"]
    },
    {
        id: 2,
        name: "Designer Denim Jacket",
        category: "Clothings",
        type: "wholesale",
        short_description: "Stylish denim jackets with modern design",
        long_description: "Elevate your inventory with our designer denim jackets. Featuring premium denim fabric, custom buttons, and tailored fit, these jackets are perfect for the fashion-forward customer.",
        price: 120.00,
        wholesale_price: 75.00,
        moq: 5,
        images: [
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
            "https://images.unsplash.com/photo-1523205565295-f8e91625443e?w=500"
        ],
        stock: 200,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Light Blue", "Dark Blue", "Black"]
    },
    {
        id: 3,
        name: "Luxury Silk Scarf",
        category: "Accessories",
        type: "wholesale",
        short_description: "100% pure silk scarves with elegant prints",
        long_description: "Add a touch of elegance to your offerings with our luxury silk scarves. Made from 100% mulberry silk, these scarves feature stunning prints and are perfect for both casual and formal occasions.",
        price: 85.00,
        wholesale_price: 45.00,
        moq: 5,
        images: [
            "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa33?w=500",
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500"
        ],
        stock: 300,
        sizes: ["One Size"],
        colors: ["Red", "Blue", "Green", "Gold", "Black"]
    },
    {
        id: 4,
        name: "Leather Belt Set",
        category: "Accessories",
        type: "wholesale",
        short_description: "Genuine leather belt set with multiple styles",
        long_description: "Upgrade your accessory collection with our premium leather belt set. Each belt is crafted from genuine leather with durable metal buckles. Set includes casual and formal options.",
        price: 95.00,
        wholesale_price: 55.00,
        moq: 5,
        images: [
            "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
        ],
        stock: 400,
        sizes: ["30", "32", "34", "36", "38", "40", "42"],
        colors: ["Brown", "Black", "Tan"]
    },
    {
        id: 5,
        name: "Classic Polo Shirt Pack",
        category: "Clothings",
        type: "wholesale",
        short_description: "Pack of 10 classic polo shirts",
        long_description: "Our classic polo shirts are a staple for any wholesale inventory. Made from breathable piqué fabric, these shirts offer comfort and style. Sold in packs of 10 for convenient bulk ordering.",
        price: 350.00,
        wholesale_price: 200.00,
        moq: 1,
        images: [
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500",
            "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500"
        ],
        stock: 150,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Red"]
    },
    {
        id: 6,
        name: "Minimalist Watch Collection",
        category: "Accessories",
        type: "wholesale",
        short_description: "Set of 5 minimalist design watches",
        long_description: "Timeless elegance meets modern design in our minimalist watch collection. Each watch features a stainless steel case, genuine leather strap, and Japanese quartz movement.",
        price: 450.00,
        wholesale_price: 280.00,
        moq: 3,
        images: [
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500"
        ],
        stock: 80,
        sizes: ["One Size"],
        colors: ["Silver", "Gold", "Rose Gold", "Black", "Brown"]
    },
    {
        id: 7,
        name: "Premium Cotton Hoodie",
        category: "Clothings",
        type: "wholesale",
        short_description: "Heavyweight cotton hoodies for wholesale",
        long_description: "Stay warm and stylish with our premium cotton hoodies. Made from 100% heavyweight cotton fleece, these hoodies feature a kangaroo pocket and adjustable drawstring.",
        price: 75.00,
        wholesale_price: 42.00,
        moq: 10,
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
        ],
        stock: 350,
        sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
        colors: ["Black", "Gray", "Navy", "Burgundy"]
    },
    {
        id: 8,
        name: "Designer Sunglasses Set",
        category: "Accessories",
        type: "wholesale",
        short_description: "UV protection sunglasses set",
        long_description: "Protect your customers' eyes in style with our designer sunglasses. Features 100% UV protection, polarized lenses, and lightweight frames. Set includes multiple trendy designs.",
        price: 180.00,
        wholesale_price: 95.00,
        moq: 5,
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
        ],
        stock: 200,
        sizes: ["One Size"],
        colors: ["Black", "Tortoise", "Gold", "Silver"]
    },
    {
        id: 9,
        name: "Formal Trouser Pack",
        category: "Clothings",
        type: "wholesale",
        short_description: "Pack of 10 formal trousers",
        long_description: "Upgrade your business offerings with our premium formal trousers. Made from high-quality polyester-wool blend, these trousers offer comfort and professionalism. Wrinkle-resistant and easy to care for.",
        price: 550.00,
        wholesale_price: 320.00,
        moq: 1,
        images: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500"
        ],
        stock: 120,
        sizes: ["28", "30", "32", "34", "36", "38", "40"],
        colors: ["Black", "Navy", "Charcoal", "Khaki"]
    },
    {
        id: 10,
        name: "Leather Handbag Collection",
        category: "Accessories",
        type: "wholesale",
        short_description: "Set of 4 designer leather handbags",
        long_description: "Elevate your accessory inventory with our leather handbag collection. Each bag is crafted from genuine leather with premium hardware. Includes tote, shoulder, crossbody, and clutch styles.",
        price: 680.00,
        wholesale_price: 420.00,
        moq: 2,
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
        ],
        stock: 60,
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Tan", "Burgundy"]
    },
    {
        id: 11,
        name: "Casual Summer Dress Set",
        category: "Clothings",
        type: "wholesale",
        short_description: "Set of 5 casual summer dresses",
        long_description: "Capture the summer vibe with our casual dress collection. Made from lightweight, breathable fabrics perfect for warm weather. Features trendy designs that customers will love.",
        price: 320.00,
        wholesale_price: 180.00,
        moq: 5,
        images: [
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
        ],
        stock: 180,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral", "Blue", "Yellow", "Pink", "White"]
    },
    {
        id: 12,
        name: "Premium Leather Wallet Set",
        category: "Accessories",
        type: "wholesale",
        short_description: "Set of 10 genuine leather wallets",
        long_description: "Stock your shelves with our premium leather wallet set. Each wallet is crafted from genuine leather with careful attention to detail. Includes bifold and cardholder styles.",
        price: 400.00,
        wholesale_price: 220.00,
        moq: 5,
        images: [
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
            "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=500"
        ],
        stock: 250,
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Tan", "Navy"]
    },
    
    // Retail Products
    {
        id: 101,
        name: "Elegant Evening Gown",
        category: "Clothings",
        type: "retail",
        short_description: "Stunning evening gown for special occasions",
        long_description: "Make a statement at your next event with our elegant evening gown. Featuring flowing fabric, delicate beading, and a flattering silhouette, this gown is perfect for proms, weddings, and galas.",
        price: 350.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
        ],
        stock: 25,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Red", "Navy", "Champagne"]
    },
    {
        id: 102,
        name: "Designer Diamond Earrings",
        category: "Accessories",
        type: "retail",
        short_description: "Sparkling diamond stud earrings",
        long_description: "Add brilliance to any outfit with our designer diamond earrings. Each earring features a carefully selected diamond set in 14K gold. Perfect for engagements, anniversaries, or everyday elegance.",
        price: 890.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
            "https://images.unsplash.com/photo-1602751584552-8ba420552259?w=500"
        ],
        stock: 15,
        sizes: ["One Size"],
        colors: ["Gold", "White Gold", "Rose Gold"]
    },
    {
        id: 103,
        name: "Premium Wool Suit",
        category: "Clothings",
        type: "retail",
        short_description: "Tailored wool suit for the modern professional",
        long_description: "Command attention in our premium wool suit. Made from 100% merino wool, this suit offers exceptional comfort and a sharp, tailored fit. Includes jacket and matching trousers.",
        price: 750.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
            "https://images.unsplash.com/photo-1593032465175-d8120f9a4738?w=500"
        ],
        stock: 40,
        sizes: ["38", "40", "42", "44", "46", "48"],
        colors: ["Charcoal", "Navy", "Black", "Light Gray"]
    },
    {
        id: 104,
        name: "Luxury Silk Tie Set",
        category: "Accessories",
        type: "retail",
        short_description: "Collection of 5 premium silk ties",
        long_description: "Complete your formal look with our luxury silk tie set. Each tie is made from 100% silk with a subtle sheen and perfect drape. Includes various patterns suitable for any occasion.",
        price: 180.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=500",
            "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500"
        ],
        stock: 60,
        sizes: ["One Size"],
        colors: ["Various Patterns"]
    },
    {
        id: 105,
        name: "Designer Crossbody Bag",
        category: "Accessories",
        type: "retail",
        short_description: "Stylish leather crossbody bag",
        long_description: "Combine fashion and function with our designer crossbody bag. Crafted from premium leather with adjustable strap and multiple compartments. Perfect for everyday use or evening outings.",
        price: 245.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500"
        ],
        stock: 35,
        sizes: ["One Size"],
        colors: ["Black", "Tan", "Burgundy", "Navy"]
    },
    {
        id: 106,
        name: "Cashmere Sweater",
        category: "Clothings",
        type: "retail",
        short_description: "Luxuriously soft cashmere sweater",
        long_description: "Wrap yourself in luxury with our cashmere sweater. Made from 100% Grade-A cashmere, this sweater offers unmatched softness and warmth. A timeless addition to any wardrobe.",
        price: 320.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
        ],
        stock: 45,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Camel", "Gray", "Navy", "Black", "Cream"]
    },
    {
        id: 107,
        name: "Minimalist Gold Necklace",
        category: "Accessories",
        type: "retail",
        short_description: "Delicate 14K gold chain",
        long_description: "Achieve understated elegance with our minimalist gold necklace. This delicate 14K gold chain is perfect for layering or wearing alone. Features a secure lobster clasp.",
        price: 195.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500"
        ],
        stock: 50,
        sizes: ["16\"", "18\"", "20\"", "24\""],
        colors: ["Gold", "Rose Gold", "White Gold"]
    },
    {
        id: 108,
        name: "Slim Fit Chinos",
        category: "Clothings",
        type: "retail",
        short_description: "Versatile slim fit chinos",
        long_description: "Upgrade your casual wardrobe with our slim fit chinos. Made from premium stretch cotton, these trousers offer comfort and a modern silhouette. Perfect for work or weekend activities.",
        price: 95.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500"
        ],
        stock: 80,
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Khaki", "Navy", "Olive", "Gray", "Black"]
    },
    {
        id: 109,
        name: "Leather Oxford Shoes",
        category: "Accessories",
        type: "retail",
        short_description: "Classic leather Oxford shoes",
        long_description: "Step into sophistication with our leather Oxford shoes. Handcrafted from premium leather with a Blake stitch construction, these shoes offer durability and timeless style.",
        price: 280.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500",
            "https://images.unsplash.com/photo-1610397648930-477b8c7f0943?w=500"
        ],
        stock: 30,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black", "Brown", "Tan"]
    },
    {
        id: 110,
        name: "Floral Midi Dress",
        category: "Clothings",
        type: "retail",
        short_description: "Beautiful floral print midi dress",
        long_description: "Embrace feminine style with our floral midi dress. Made from lightweight fabric with a flowing silhouette, this dress features a stunning floral print perfect for spring and summer occasions.",
        price: 125.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
            "https://images.unsplash.com/photo-1618932260643-2b67c55e3b43?w=500"
        ],
        stock: 55,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral Print 1", "Floral Print 2", "Floral Print 3"]
    },
    {
        id: 111,
        name: "Classic Aviator Sunglasses",
        category: "Accessories",
        type: "retail",
        short_description: "Timeless aviator sunglasses with UV protection",
        long_description: "Channel timeless cool with our classic aviator sunglasses. Featuring 100% UV protection lenses and a lightweight metal frame, these sunglasses are a must-have accessory.",
        price: 145.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
        ],
        stock: 70,
        sizes: ["One Size"],
        colors: ["Gold/Green", "Silver/Blue", "Black/Gray", "Gunmetal"]
    },
    {
        id: 112,
        name: "Tailored Blazer",
        category: "Clothings",
        type: "retail",
        short_description: "Versatile tailored blazer",
        long_description: "Elevate any outfit with our tailored blazer. Made from premium polyester-wool blend with a modern slim fit, this blazer is perfect for the office or evening events.",
        price: 195.00,
        wholesale_price: null,
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
            "https://images.unsplash.com/photo-1591369822096-ffd140ec968f?w=500"
        ],
        stock: 45,
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Navy", "Charcoal", "Black", "Burgundy"]
    }
];

// Helper functions
function getProductsByType(type) {
    return productsData.filter(product => product.type === type);
}

function getProductsByCategory(category) {
    return productsData.filter(product => product.category === category);
}

function getProductById(id) {
    return productsData.find(product => product.id === id);
}

function getAllProducts() {
    return productsData;
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.short_description.toLowerCase().includes(searchTerm)
    );
}

function sortProducts(products, sortBy) {
    switch(sortBy) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'name-asc':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...products].sort((a, b) => b.name.localeCompare(a.name));
        default:
            return products;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsData,
        getProductsByType,
        getProductsByCategory,
        getProductById,
        getAllProducts,
        searchProducts,
        sortProducts
    };
}
