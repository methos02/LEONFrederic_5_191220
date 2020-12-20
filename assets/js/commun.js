document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nb_article').textContent = basketNbProduct();
});

function formatPrice(price_cent) {
    let price = price_cent / 100;
    return price.toLocaleString("fr-FR", {style: "currency", currency: "EUR"})
}

function getBasket() {
    let basket = localStorage.getItem('basket');
    return basket !== null ? JSON.parse(basket) : {nb_products : 0, products: []};
}

function basketNbProduct() {
    return getBasket().nb_products;
}

function saveInBasket(product) {
    let basket = getBasket();

    basket.products.push(product);
    basket.nb_products += parseInt(product.nb_product);

    localStorage.setItem('basket', JSON.stringify(basket));
    return basket.nb_products;
}