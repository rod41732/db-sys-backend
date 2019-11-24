class Product {
    constructor(prodID,
        prodName,
        amountInStock,
        defaultPrice,
        prodType,
        image)
        {
            this.prodID = prodID;
            this.prodName = prodName;
            this.amountInStock = amountInStock;
            this.defaultPrice = defaultPrice;
            this.prodType = prodType;
            this.image = image;
        }
}

Product.TABLE_NAME = `Product`;

module.exports = Product;