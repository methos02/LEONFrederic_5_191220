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

    row.querySelector('[data-basket_name]').textContent = product.name;
    row.querySelector('[data-basket_color]').textContent = product.color;

    let input = row.querySelector('input[name=basket_numb]');
    input.value = product.nb_product;
    input.setAttribute('data-index', index);

    let tr_price = row.querySelector('[data-basket_price]');
    tr_price.innerHTML = formatPrice(product.price * product.nb_product);
    tr_price.setAttribute('data-basket_price', product.price);

    row.querySelectorAll('[data-update_basket]').forEach(function (btn) {
        btn.addEventListener('click', function() { updateBasket(this); });
    });

    tbody.appendChild(row);
}

function calculTotalPrice() {
    let total_price = 0;
    document.querySelectorAll('[data-basket_price]').forEach(function(td) {
        let price = parseInt(td.textContent.slice(0, -2));

        if( Number.isInteger(price) ) {
            total_price += price;
        }
    });

   document.querySelector('[data-total_price]').textContent = formatPrice(total_price * 100);
}

function updateBasket(btn) {
    let input = btn.parentElement.querySelector('input');
    let current_nb_items = parseInt(input.value);
    let diff = parseInt(btn.getAttribute('data-update_basket'))
    let nb_items = current_nb_items + diff;

    if(nb_items < 1) {return;}

    let row = input.closest('tr');
    let td_price = row.querySelector('[data-basket_price]');
    let basket = getBasket();

    input.value = nb_items;
    td_price.textContent = formatPrice(nb_items * parseInt(td_price.getAttribute('data-basket_price')));

    basket.products[input.getAttribute('data-index')].nb_product = nb_items;
    basket.nb_products += diff;
    localStorage.setItem('basket', JSON.stringify(basket));

    document.getElementById('nb_article').textContent = basket.nb_products;
    calculTotalPrice();
}