let athmovil_public = "ath_movil_api_key";

let ath_distance_value = null;

let ATHM_Checkout = {
    env: 'production',
    publicToken: athmovil_public,
    timeout: 60,
    theme: 'btn',
    lang: 'es',
    total: 1.00,

    items: [
        {
            "name": "Order",
            "description": "Order desc",
            "quantity": "1",
            "price": "1.00",
            "tax": null,
            "metadata": null
        },
    ],
    
    onCancelledPayment: function (res)
    {
        document.getElementById('section5').scrollIntoView({behavior:'smooth'});
        alert("Oh! looks like the transaction had been cancelled, try it again");
    },
    
    onExpiredPayment: function (res)
    {
        document.getElementById('section5').scrollIntoView({behavior:'smooth'});
        alert("Oh! looks like the transaction has expired, try it again");
    },
    
    onCompletedPayment: function (res)
    {
        let reference_number = res.referenceNumber;
        let api_token = 'backend-api-token';
        let api_orders = "backend-route-athmovil";
        
        if (api_token) {
            let data = { 
                reference_number: reference_number,
                api_token: api_token ,
                search_address_id: selected_search.id,
                delivery_address_id: selected_delivery.id
            };

            request.post(api_orders, data, api_token)
                .then(response => {
                    if (response.success)
                        alert(response.message);
                });
        }
    },
}

/**
 * ATH total price calculation, implement your own, this is just an example
 */
const get_ath_total = (distance) => {
    var minimum_price = 'orders_minimum_price';
    var percentage_per_km = 'orders_percentage_per_km';
    var distance_value = (distance > 1000) ? distance : 0;
    var subtotal = minimum_price + (minimum_price * percentage_per_km * distance_value) / 1000;
    var total = subtotal;
    if ('freeorders_default_tax', 0) {
        var delivery_fee = 'orders_default_tax';
        total += total * delivery_fee / 100;
    }

    subtotal = Math.round(subtotal * 100) / 100;
    total = Math.round(total * 100) / 100;
    tax = Math.round((total - subtotal) * 100) / 100;

    return { subtotal, total, tax };
}

const get_ath_item = (ath_total) => {
    return [
        {
            "name": "Order",
            "description": $("#description").val(),
            "quantity": "1",
            "price": String(ath_total.total),
            "tax": String(ath_total.tax),
            "metadata": null
        }
    ];
}

const update_ath_checkout_values = (ath_total) => { 
    ATHM_Checkout['total'] = ath_total.total;
    ATHM_Checkout['subtotal'] = ath_total.subtotal;
    ATHM_Checkout['tax'] = ath_total.tax;
};

const update_ath_checkout_items = (items) => {
    ATHM_Checkout['items'] = items;
}

const ath_prepare_data = () => {
    var ath_total = get_ath_total((ath_distance_value) ? ath_distance_value : 0)
    update_ath_checkout_values(ath_total);
    update_ath_checkout_items(get_ath_item(ath_total));
}
