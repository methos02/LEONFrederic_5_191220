const products = {};
const basket = getBasket();

document.addEventListener("DOMContentLoaded", () => {
    insertProducts().then(() => calculTotalPrice());

    setPatternError('zip', "Le code postale doit être composé de 5 chiffres.", "input");
    setPatternError('email', "L'adresse mail est invalide.", "focusout");

    document.getElementById('formOrder').addEventListener('submit', function(e) {sendForm(e);});
});

async function insertProducts() {
    if( basket.products.length > 0 ) {
        await Promise.all(
            basket.products.map(async (product) => {
                products[product.id] = await getProduct(product.id);
                insertRow(products[product.id], product.colors);
            })
        )

        return;
    }

    switchElementById('panier-empty', 'panier-table')
}

/**
 *
 * @param product
 * @param colors
 */
function insertRow(product, colors) {
    const tbody = document.querySelector('tbody');

    colors.map((color) => {
        const row = generateRow(product, color);

        row.querySelectorAll('input[name=product_numb]').forEach(function (input) {
            input.addEventListener('change', function() { updateBasket(this); });
            input.addEventListener('input', () => { if( !input.reportValidity()) input.value = 1 });
        });

        row.querySelectorAll('[data-product_delete]').forEach(function (btn) {
            btn.addEventListener('click', function() { removeRowFromBasket(this); });
        });

        tbody.appendChild(row);
    });
}

function generateRow(product, color) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-product_id', product._id);
    tr.classList.add('product-row');

    tr.innerHTML += '<td class="product-row__delete" data-product_delete><img src="/assets/images/trash.svg" alt="icone de poubelle"></td>';
    tr.innerHTML += '<td class="product-row__name">' + product.name + '</td>';
    tr.innerHTML += '<td class="product-row__color" data-product_color>' + color.name + '</td>';
    tr.innerHTML += '<td class="product-row__number"><input name="product_numb" type="number" pattern="\\d+" min="1" title="Nombre de produit" value="' + color.nb + '"></td>';
    tr.innerHTML += '<td class="product-row__price" data-product_price>' + formatPrice(color.nb * product.price) + '</td>';

    return tr;
}

function updateBasket(input) {
    const row = input.closest('tr');
    const product_id = row.getAttribute('data-product_id');
    const nb_product = row.querySelector('[name=product_numb]').value;

    if(products[product_id] === undefined) {
        return addErrorToast('Le produit est introuvable');
    }

    const total_product = basketAddOrUpdateProduct(products[product_id], {
        name: row.querySelector('[data-product_color]').textContent,
        nb: nb_product
    });

    row.querySelector('[data-product_price]').textContent = formatPrice(nb_product * products[product_id].price);
    animate_logo_basket(total_product);
    calculTotalPrice();
}

function removeRowFromBasket(btn) {
    const row = btn.closest('tr');
    const color = row.querySelector('[data-product_color]').textContent;
    const product_id = row.getAttribute('data-product_id');
    const nb_product = localBasketRemoveProduct(product_id, color);

    row.classList.add('remove-row');
    setTimeout(() => row.remove(), 150);

    addSuccessToast('Ce nounours a bien été supprimé <img src="/assets/images/ours_head_sade.png" alt="Tête de nounours triste">');
    animate_logo_basket(nb_product);
    calculTotalPrice();
}

function calculTotalPrice() {
    const total_price = basket.products.reduce((current_price, product_basket) => {
        const nb_product = product_basket.colors.reduce((current_nb, color) => parseInt(color.nb) + current_nb , 0);
        return nb_product * products[product_basket.id].price + current_price
    }, 0)

    document.querySelector('[data-total_price]').textContent = formatPrice(total_price);
}


function setPatternError(input_name, error, event) {
    const input = document.getElementById(input_name);
    input.addEventListener(event, () => input.setCustomValidity(input.validity.patternMismatch ? error : ""));
}

async function sendForm(e) {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/teddies/order', {
        headers: new Headers({"Content-Type" : "application/json"}),
        method: 'POST',
        body: JSON.stringify({ contact : getFormDatas(e.target), products : basket.products.map( product => product.id) })
    });

    const result = await response.json();

    localStorage.setItem('order', result.orderId);
    localStorage.setItem('name', result.contact.firstName);
    emptyBasket();
    window.location.replace("/index.html");
}

function getFormDatas(form) {
    const datas = {};

    form.querySelectorAll('input').forEach((input) => {
        datas[input.getAttribute('name')] = input.value;
    });

    return datas;
}
