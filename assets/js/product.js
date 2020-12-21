document.addEventListener("DOMContentLoaded", () => {
    getProduct().then(product => updateWithBasket(product));

    document.getElementById('add-basket').addEventListener('click', () => clickAddProduct(document.getElementById('div-product')));
    document.getElementById('nb_product').addEventListener('change', () => updatePrice());
});

async function getProduct() {
    let productJson = await fetch('http://localhost:3000/api/teddies/' + getIdProduct());
    let product = await productJson.json();
    return insertProduct(product);
}

function insertProduct(product) {
    document.querySelector('[data-product_name]').textContent = product.name;
    document.querySelector('[data-product_image]').setAttribute('src', product.imageUrl);
    document.querySelector('[data-product_description]').textContent = product.description;
    document.querySelector('[data-product_colors]').innerHTML = generateColorOptions(product.colors);

    let div_price = document.querySelector('[data-product_price]');
    div_price.setAttribute('data-product_price', product.price);
    div_price.textContent = formatPrice(product.price);

    document.querySelectorAll('[data-product_nb_update]').forEach(function (btn) {
        btn.addEventListener('click', function() { changeNumberItems(this); });
    });

    let div_product = document.getElementById('div-product');
    div_product.classList.add('visible');
    return defineProduct(div_product);
}

function updateWithBasket(product) {
    let basket = getBasket();
    let product_index = getIndexProductInBasket(basket, product);

    if(product_index !== -1) {
        document.querySelector('input[name=product_numb]').value = product_index !== -1 ? basket.products[product_index].nb_product : 1;
        updateBtnAdd()
    }
}

function generateColorOptions(options) {
    return options.map((option) => '<option value="' + option + '" >' + option + '</option>').join();
}

function getIdProduct() {
    let url = new URL(location.href)
    let params = new URLSearchParams(url.search);

    return params.get('id');
}

function clickAddProduct(container) {
    let product = defineProduct(container);
    document.getElementById('nb_article').textContent = basketAddOrUpdateProduct(product);
    updateBtnAdd()
}

function updatePrice() {
    let nb_product = document.getElementById('nb_product').value;
    let price = document.querySelector('[data-product_price]').getAttribute('data-product_price');

    document.querySelector('[data-product_price]').textContent = formatPrice(price * nb_product);
}

function updateBtnAdd() {
    document.getElementById('add-basket').textContent = 'Modifier le panier';
}