let tbody = document.querySelector('tbody');
let template = tbody.firstElementChild;

document.addEventListener("DOMContentLoaded", () => {
    hydrateBasket();
    calculTotalPrice();
});

function hydrateBasket() {
    let basket = getBasket();
    basket.products.map((product, index) => insertRow(product, index));
}

function insertRow(product, index) {
    let row = template.cloneNode(true);

    row.setAttribute('data-index', index);
    row.querySelector('[data-product_name]').textContent = product.name;
    row.querySelector('[data-product_color]').textContent = product.color;
    row.querySelector('input[name=product_numb]').value = product.nb_product;

    let tr_price = row.querySelector('[data-product_price]');
    tr_price.innerHTML = formatPrice(product.price * product.nb_product);
    tr_price.setAttribute('data-product_price', product.price);

    row.querySelectorAll('[data-product_nb_update]').forEach(function (btn) {
        btn.addEventListener('click', function() { changeNumberItems(this); });
    });

    row.querySelectorAll('input[name=product_numb]').forEach(function (input) {
        input.addEventListener('change', function() { updateBasket(this); });
    });

    row.querySelectorAll('[data-product_delete]').forEach(function (btn) {
        btn.addEventListener('click', function() { deleteBasketRow(this); });
    });

    tbody.appendChild(row);
}

function updateBasket(btn) {
    let row = btn.closest('tr');
    let product = defineProduct(row);
    let nb_product = basketAddOrUpdateProduct(product);

    row.querySelector('[data-product_price]').textContent = product.total_price;
    document.getElementById('nb_article').textContent = nb_product;
    calculTotalPrice();
}

function calculTotalPrice() {
    let total_price = 0;

    document.querySelectorAll('[data-product_price]').forEach(function(td) {
        let price = parseInt(td.textContent.slice(0, -2));

        if( Number.isInteger(price) ) {
            total_price += price;
        }
    });

    document.querySelector('[data-total_price]').textContent = formatPrice(total_price * 100);
}