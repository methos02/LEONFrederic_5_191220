function formatPrice(price_cent) {
    let price = price_cent / 100;
    return price.toLocaleString("fr-FR", {style: "currency", currency: "EUR"})
}

function generateOption(options) {
    return options.map((option, index) => '<option value="' + index + '" >' + option + '</option>').join();
}