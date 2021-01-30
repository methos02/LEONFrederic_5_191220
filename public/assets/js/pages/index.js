const div_products = document.getElementById('div-products');

document.addEventListener("DOMContentLoaded", () => {
    getProducts().catch((error) => insertDivError(error));
    loadPage('div-products');

    if( localStorage.getItem('order') !== null ) { showSuccessModal();}
});

/**
 * Get products from API
 * @returns {Promise<void>}
 */
async function getProducts() {
    const productsJson =  await fetch('http://localhost:3000/api/teddies');
    const products = await productsJson.json();

    await Promise.all( products.map(async function(product) { insertProducts(product) }) );
}

/**
 * Insert product in the div_products
 * @param product
 */
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

/**
 * Show Modal when success order
 */
function showSuccessModal() {
    const myModal = new bootstrap.Modal(document.getElementById('modal-success'));
    document.getElementById('order_name').innerText = localStorage.getItem('name');
    document.getElementById('order_number').innerText = localStorage.getItem('order');

    setTimeout(() => myModal.show(), 3000);

    localStorage.removeItem('name');
    localStorage.removeItem('order');
}