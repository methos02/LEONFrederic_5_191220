const product_id = getIdProduct();
document.addEventListener("DOMContentLoaded", () => {
    getProduct().then(product => {
        insertProduct(product);
        updateWithBasket(product);
    });

    document.getElementById('add-basket').addEventListener('click', () => clickAddProduct(document.getElementById('div-product')));
    document.getElementById('nb_product').addEventListener('change', () => updatePrice());
});

async function getProduct() {
    const productJson = await fetch('http://localhost:3000/api/teddies/' + product_id);
    return await productJson.json();
}

function insertProduct(product) {
    document.querySelector('[data-product_name]').textContent = product.name;
    document.querySelector('[data-product_image]').setAttribute('src', product.imageUrl);
    document.querySelector('[data-product_description]').textContent = product.description;
    document.querySelector('[data-product_colors]').innerHTML = generateColorOptions(product.colors);

    const div_price = document.querySelector('[data-product_price]');
    div_price.setAttribute('data-product_price', product.price);
    div_price.textContent = formatPrice(product.price);

    document.querySelectorAll('[data-product_nb_update]').forEach(function (btn) {
        btn.addEventListener('click', function() { changeNumberItems(this); });
    });

    const div_product = document.getElementById('div-product');
    div_product.classList.add('visible');
}

function updateWithBasket(product) {
    let basket = getBasket();
    let product_basket = getProductInBasket(basket, product._id);

    if(product_basket !== undefined) {
        let product_color = product_basket.colors.find(color => color.name === product.colors[0]);

        document.querySelector('input[name=product_numb]').value = product_color !== undefined ? product_color.nb : 1;
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

async function clickAddProduct() {
    const product = await getProduct();
    const infos = {
        name: document.getElementById('colors').value,
        nb: document.getElementById('nb_product').value,
    }

    document.getElementById('nb_article').textContent = basketAddOrUpdateProduct(product, infos);
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