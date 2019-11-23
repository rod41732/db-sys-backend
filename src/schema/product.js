class Product {
    constructor(productID,
        name,
        amountInStock,
        defaultPrice,
        type,
        image)
        {
            this.productID = productID;
            this.name = name;
            this.amountInStock = amountInStock;
            this.defaultPrice = defaultPrice;
            this.type = type;
            this.image = image;
        }
}

Product.TABLE_NAME = `Product`;

module.exports = Product;