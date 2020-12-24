let tbody = document.querySelector('tbody');
const products = {};

document.addEventListener("DOMContentLoaded", () => {
    insertProducts();
});

function insertProducts() {
    let basket = getBasket();

    basket.products.map(async (product) => {
        products[product.id] = await getProduct(product.id);
        insertRow(products[product.id], product.colors);
    });
}

function insertRow(product, colors) {
    colors.map((color) => {
        let row = generateRow(product, color);

        row.querySelectorAll('[data-product_nb_update]').forEach(function (btn) {
            btn.addEventListener('click', function() { changeNumberItems(this); });
        });

        row.querySelectorAll('input[name=product_numb]').forEach(function (input) {
            input.addEventListener('change', function() { updateBasket(this); });
        });

        row.querySelectorAll('[data-product_delete]').forEach(function (btn) {
            btn.addEventListener('click', function() { removeRowFromBasket(this); });
        });

        tbody.appendChild(row);
        calculTotalPrice();
    });
}

function generateRow(product, color) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-product_id', product._id);

    tr.innerHTML += '<td class="product-row__delete" data-product_delete><img src="/assets/images/trash.svg" alt="icone de poubelle"></td>';
    tr.innerHTML += '<td>' + product.name + '</td>';
    tr.innerHTML += '<td data-product_color>' + color.name + '</td>';
    tr.appendChild(generateBtnNumber(color.nb));
    tr.innerHTML += '<td data-product_price>' + formatPrice(color.nb * product.price) + '</td>';

    return tr;
}

function generateBtnNumber(nb) {
    const td = document.createElement('td');
    td.innerHTML += '<span class="product-row__number"></span>';

    const btn = td.querySelector('.product-row__number');
    btn.innerHTML += '<button data-product_nb_update="-1"> - </button>';
    btn.innerHTML += '<input name="product_numb" title="Nombre de produit" value="' + nb + '">';
    btn.innerHTML += '<button data-product_nb_update="+1"> + </button>';

    return td;
}

function updateBasket(btn) {
    let row = btn.closest('tr');
    let product_id = row.getAttribute('data-product_id');

    if(products[product_id] === undefined) {
        return addErrorToast('Le produit est introuvable');
    }

    let nb_product = basketAddOrUpdateProduct(products[product_id], {
        name: row.querySelector('[data-product_color]').textContent,
        nb: row.querySelector('[name=product_numb]').value
    });

    row.querySelector('[data-product_price]').textContent = formatPrice(nb_product * products[product_id].price);
    document.getElementById('nb_article').textContent = nb_product;
    calculTotalPrice();
}

function removeRowFromBasket(btn) {
    let row = btn.closest('tr');
    let color = row.querySelector('[data-color]').textContent;

    document.getElementById('nb_article').textContent = localBasketRemoveProduct(product_id, color);
    addSuccessToast('Ce nounours a bien été supprimé :\'(');
    calculTotalPrice();
}

function calculTotalPrice() {
    let total_price = 0;

    document.querySelectorAll('[data-product_price]').forEach(function(td) {
        total_price += parseInt(td.textContent.slice(0, -2));
    });

    document.querySelector('[data-total_price]').textContent = formatPrice(total_price * 100);
}