const product_id = getIdProduct();
let product_api;
document.addEventListener("DOMContentLoaded", () => {
    product = getProduct(product_id).then(product => {
        insertProduct(product);
        updateWithBasket(product);
        product_api = product;
    });

    document.getElementById('add-basket').addEventListener('click', () => clickAddProduct(document.getElementById('div-product')));
    document.getElementById('nb_product').addEventListener('change', () => updatePrice());
    document.querySelector('[name=colors]').addEventListener('change', function() {initNbProduct(this)});
});

function insertProduct(product) {
    document.querySelector('[data-product_name]').textContent = product.name;
    document.querySelector('[data-product_image]').setAttribute('src', product.imageUrl);
    document.querySelector('[data-product_description]').textContent = product.description;
    document.querySelector('[data-product_colors]').innerHTML = generateColorOptions(product.colors);
    document.querySelector('[data-product_price]').textContent = formatPrice(product.price);

    document.querySelectorAll('[data-product_nb_update]').forEach(function (btn) {
        btn.addEventListener('click', function() { changeNumberItems(this); });
    });

    const div_product = document.getElementById('div-product');
    div_product.classList.add('visible');
}

function initNbProduct(input_color) {
    let basket = getBasket();
    let product = getProductInBasket(basket, getIdProduct());
    let infos = productGetInfos(product, input_color.value);
    let nb = returnOrInitInfos(infos, input_color.value).nb;

    document.querySelector('[name=product_numb]').value = nb;
    document.querySelector('[data-product_price]').textContent = formatPrice(product_api.price * nb);
    updateBtnAdd(infos !== undefined ? 'update' : 'add');
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
    const product = await getProduct(product_id);
    const infos = {
        name: document.getElementById('colors').value,
        nb: parseInt(document.getElementById('nb_product').value),
    }

    document.getElementById('nb_article').textContent = basketAddOrUpdateProduct(product, infos);
    updateBtnAdd()
}

function updatePrice() {
    let nb_product = document.getElementById('nb_product').value;
    document.querySelector('[data-product_price]').textContent = formatPrice(product_api.price * nb_product);
}

function updateBtnAdd(etat) {
    document.getElementById('add-basket').textContent = etat === 'update' ? 'Modifier le panier' : 'Ajouter au panier';
}