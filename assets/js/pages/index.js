const div_products = document.getElementById('div-products');

document.addEventListener("DOMContentLoaded", () => {
    getProducts().then();
});

async function getProducts() {
    const productsJson =  await fetch('http://localhost:3000/api/teddies');
    const products = await productsJson.json();

    await Promise.all( products.map(async function(product) { insertProducts(product) }) );
}

function insertProducts(product) {
    const card = document.createElement('a');
    card.setAttribute('href', '/product.html?id=' + product._id);
    card.classList.add('card-product');
    card.innerHTML = '<img src="' + product.imageUrl + '" alt="emplacement des images de produit">';

    const infos = document.createElement('div');
    infos.classList.add('card-product-infos');

    infos.innerHTML += '<h2 class="card-product-infos__name">' + product.name + '</h2>';
    infos.innerHTML += '<div class="card-product-infos__description">' + product.description + '</div>';
    infos.innerHTML += '<div class="card-product-infos__price">' + formatPrice(product.price) + '</div>';

    card.appendChild(infos);
    div_products.appendChild(card);
}