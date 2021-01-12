const product_id = getIdProduct();
const basket = getBasket();
let product_api;

document.addEventListener("DOMContentLoaded", () => {
    getProduct(product_id).then(product => {
        product_api = product;
        insertProduct(product);
        initNbProduct(document.querySelector('[name=colors]'));
    });

    document.getElementById('add-basket').addEventListener('click', () => clickAddProduct(document.getElementById('div-product')));
    document.getElementById('nb_product').addEventListener('change', () => updatePrice());
    document.querySelector('[name=colors]').addEventListener('change', function() {initNbProduct(this)});
});

function getIdProduct() {
    const url = new URL(location.href)
    const params = new URLSearchParams(url.search);

    return params.get('id');
}

function insertProduct(product) {
    document.querySelector('[data-product_name]').textContent = product.name;
    document.querySelector('[data-product_image]').setAttribute('src', product.imageUrl);
    document.querySelector('[data-product_description]').textContent = product.description;
    document.querySelector('[data-product_colors]').innerHTML = generateColorOptions(product.colors);
    document.querySelector('[data-product_price]').textContent = formatPrice(product.price);

    const div_product = document.getElementById('div-product');
    div_product.classList.add('visible');
}

function generateColorOptions(options) {
    return options.map((option) => '<option value="' + option + '" >' + option + '</option>').join();
}

function initNbProduct(input_color) {
    const infos = productGetInfos(product_id, input_color.value);
    const nb_product = infos !== undefined ? infos.nb : 1

    document.querySelector('[name=product_numb]').value = nb_product;
    document.querySelector('[data-product_price]').textContent = formatPrice(product_api.price * nb_product);
    updateBtnAdd(infos !== undefined ? 'update' : 'add');
}

function clickAddProduct() {
    const nb_product = parseInt(document.getElementById('nb_product').value);
    const infos = {
        name: document.getElementById('colors').value,
        nb: nb_product,
    }

    const nb_total_product = basketAddOrUpdateProduct(product_api, infos);

    animate_logo_basket(nb_total_product);
    updateBtnAdd('update');
}

function updatePrice() {
    const nb_product = document.getElementById('nb_product').value;
    document.querySelector('[data-product_price]').textContent = formatPrice(product_api.price * nb_product);
}

function updateBtnAdd(etat) {
    document.getElementById('add-basket').textContent = etat === 'update' ? 'Modifier le panier' : 'Ajouter au panier';
}