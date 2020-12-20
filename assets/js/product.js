document.addEventListener("DOMContentLoaded", () => {
    getProduct().then();

    document.getElementById('add-basket').addEventListener('click', () => addBasket());
    document.getElementById('nb_product').addEventListener('change', () => updatePrice());
});

async function getProduct() {
    let productJson = await fetch('http://localhost:3000/api/teddies/' + getIdProduct());
    let product = await productJson.json()

    insertProduct(product);
}

function insertProduct(product) {
    document.querySelector('[data-product_name]').textContent = product.name;
    document.querySelector('[data-product_image]').setAttribute('src', product.imageUrl);
    document.querySelector('[data-product_description]').textContent = product.description;
    document.querySelector('[data-product_colors]').innerHTML = generateColorOptions(product.colors);

    let div_price = document.querySelector('[data-product_price]');
    div_price.setAttribute('data-product_price', product.price);
    div_price.textContent = formatPrice(product.price);

    document.getElementById('div-product').classList.add('visible')
}

function generateColorOptions(options) {
    return options.map((option) => '<option value="' + option + '" >' + option + '</option>').join();
}

function getIdProduct() {
    let url = new URL(location.href)
    let params = new URLSearchParams(url.search);

    return params.get('id');
}

function addBasket() {
    let product = {
        name : document.querySelector('[data-product_name]').textContent,
        color: document.querySelector('[data-product_colors]').value,
        nb_product : document.getElementById('nb_product').value,
        price : document.querySelector('[data-product_price]').getAttribute('data-product_price')
    }

    document.getElementById('nb_article').textContent = saveInBasket(product);
}

function updatePrice() {
    let nb_product = document.getElementById('nb_product').value;
    let price = document.querySelector('[data-product_price]').getAttribute('data-product_price');

    document.querySelector('[data-product_price]').textContent = formatPrice(price * nb_product);
}