const div_products = document.getElementById('div-products');

document.addEventListener("DOMContentLoaded", () => {
    getProducts().catch((error) => insertDivError(error));
    loadPage('div-products');

    if( localStorage.getItem('order') !== null && localStorage.getItem('name') !== null) showSuccessModal();
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
    generateSuccessModal();

    const myModal = new bootstrap.Modal(document.getElementById('modal-success'));
    setTimeout(() => myModal.show(), 3000);

    localStorage.removeItem('name');
    localStorage.removeItem('order');
}

/**
 * Generate Modal when success order
 */
function generateSuccessModal() {
    const section_modal = document.createElement('section');
    section_modal.classList.add('modal','fade','modal-success');
    section_modal.setAttribute('id', 'modal-success');
    section_modal.setAttribute('tabIndex', '-1');
    section_modal.innerHTML = '<div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"></div></div>';

    const modal_body = document.createElement('div');
    modal_body.classList.add('modal-body');

    modal_body.innerHTML = '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
    modal_body.innerHTML += '<img src="assets/images/ours_happy.png" alt="icone de success">';
    modal_body.innerHTML += '<h2 class="title"> Merci ' + localStorage.getItem('name') + '!</h2>';
    modal_body.innerHTML += '<h3 class="order-success__span-number">Votre numéro de commande </h3>';
    modal_body.innerHTML += '<p>' +  localStorage.getItem('order') + '</p>';

    section_modal.querySelector('.modal-content').appendChild(modal_body);
    document.querySelector('.container-custom').appendChild(section_modal);
}