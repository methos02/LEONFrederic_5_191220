document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nb_article').textContent = basketNbProduct();
});

function formatPrice(price_cent) {
    let price = price_cent / 100;
    return price.toLocaleString("fr-FR", {style: "currency", currency: "EUR"})
}

async function getProduct(product_id) {
    const productJson = await fetch('http://localhost:3000/api/teddies/' + product_id);
    return await productJson.json();
}

function defineProduct(product, infos) {
     return {
        id : product._id,
        colors: [infos]
    }
}

function changeNumberItems(btn) {
    let input = btn.parentElement.querySelector('input');
    let current_nb_items = parseInt(input.value);
    let diff = parseInt(btn.getAttribute('data-product_nb_update'))
    let nb_items = current_nb_items + diff;

    if(nb_items > 0) {
        input.value = nb_items;
        input.dispatchEvent(new Event('change'));
    }
}