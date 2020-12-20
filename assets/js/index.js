let template = document.getElementById('layout-card-product').firstElementChild;
let div_products = document.getElementById('products');

document.addEventListener("DOMContentLoaded", () => {
    getProducts().then();
});

async function getProducts() {
    let productsJson =  await fetch('http://localhost:3000/api/teddies');
    let products = await productsJson.json();

    products.map(function(product) { insertProducts(product) })
}

function insertProducts(product) {
    let card = template.cloneNode(true);

    card.setAttribute('href', '/product.html?id=' + product._id);
    card.querySelector('img').setAttribute('src', product.imageUrl);
    card.querySelector('[data-product_name]').textContent = product.name;
    card.querySelector('[data-product_description]').textContent = product.description;
    card.querySelector('[data-product_price]').textContent = formatPrice(product.price);

    div_products.appendChild(card);
}