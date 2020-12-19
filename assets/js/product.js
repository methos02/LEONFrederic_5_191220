document.addEventListener("DOMContentLoaded", () => {
    getProduct();
});

function getProduct() {
    fetch('http://localhost:3000/api/teddies/' + getIdProduct())
        .then(function(response) {
            return response.json();
        })
        .then(function (product) {
            insertProduct(product)
        });
}

function insertProduct(product) {
    document.querySelector('[data-product_name]').textContent = product.name;
    document.querySelector('[data-product_image]').setAttribute('src', product.imageUrl);
    document.querySelector('[data-product_description]').textContent = product.description;
    document.querySelector('[data-product_price]').textContent = formatPrice(product.price);
    document.querySelector('[data-product_colors]').innerHTML = generateOption(product.colors);

    document.getElementById('div-product').classList.add('visible')
}

function getIdProduct() {
    let url = new URL(location.href)
    let params = new URLSearchParams(url.search);

    return params.get('id');
}