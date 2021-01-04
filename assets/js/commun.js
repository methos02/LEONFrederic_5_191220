document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nb_article').textContent = getBasket().nb_products;
});

function formatPrice(price_cent) {
    const price = price_cent / 100;
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