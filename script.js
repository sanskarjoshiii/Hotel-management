let total = 0;
let customerName = "";

// Item prices mapping
const itemPrices = {
    "MUTTON SUKKA": 110,
    "MUTTON FRY": 120,
    "MUTTON MASALA": 110,
    "MUTTON BUTTER": 150,
    "MUTTON MOGHLAI": 140,
    "MUTTON KOLHAPURI": 140,
    "MUTTON KADAI": 180,
    "MUTTON HANDI": 180,
    "MUTTON LIVER SUKKHA": 110,
    "MUTTON LIVER MASALA": 110,
    "MUTTON LIVER FRY": 120,
    "VAJARI MASALA": 90,
    "VAJARI FRY": 100,
    "AALU MUTTER": 80,
    "AALU MUTTER FRY": 85,
    "CHANNA MAS. FRY": 85,
    "DAL FRY": 70,
    "PANEER BHURJI": 130,
    "PANEER MASALA": 130,
    "PANEER MAKHANWALA": 140,
    "VEG. KURMA": 90,
    "VEG. KOLHAPURI": 90,
    "MIX VEG": 90,
    "DAL TADKA": 90,
    "BAIGAN MASALA": 90,
    "BHENDI MASALA": 90,
    "AALU PALAK": 100,
    "PANEER PALAK": 130,
    "SIMLA MASALA": 100,
    "VEG. KADAI": 200,
    "CHAPATI": 10,
    "ROTI": 17,
    "BUTTER ROTI": 25,
    "PARATHA": 25,
    "BUTTER PARATHA": 30,
    "NAAN": 35,
    "BUTTER NAAN": 35,
    "GARLIK NAAN": 60,
    "BUTTER GARLIK NAAN": 65,
    "BHAKRI": 20
};

// Store the list of added items
let addedItems = [];

document.getElementById('new-bill-btn').addEventListener('click', () => {
    document.getElementById('bill-section').style.display = 'block';
});

document.getElementById('start-bill-btn').addEventListener('click', () => {
    customerName = document.getElementById('customer-name').value;
    if (customerName) {
        document.getElementById('customer-info').style.display = 'none';
        document.getElementById('item-selection').style.display = 'block';
        document.getElementById('finalize-bill-btn').style.display = 'block';
    } else {
        alert('Please enter the customer name.');
    }
});

document.getElementById('add-non-veg-item-btn').addEventListener('click', () => {
    const selectedItem = document.getElementById('non-veg-items').value;
    addItemToBill(selectedItem);
});

document.getElementById('add-veg-item-btn').addEventListener('click', () => {
    const selectedItem = document.getElementById('veg-items').value;
    addItemToBill(selectedItem);
});

function addItemToBill(itemName) {
    const price = itemPrices[itemName];
    
    // Create a div for the item
    const itemDiv = document.createElement('div');
    itemDiv.className = "item-row";
    
    // Add item name and price
    itemDiv.innerHTML = `<span class="item-name">${itemName}</span> <span class="item-price">$${price.toFixed(2)}</span>`;
    
    // Create a dropdown for quantity selection
    const quantitySelect = document.createElement('select');
    quantitySelect.className = 'quantity-select';
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        quantitySelect.appendChild(option);
    }
    itemDiv.appendChild(quantitySelect);
    
    // Event listener for changing quantity
    quantitySelect.addEventListener('change', () => {
        updateItemTotal(itemName, parseInt(quantitySelect.value), price);
    });
    
    document.getElementById('items-list').appendChild(itemDiv);
    
    // Add item to the list with initial quantity 1
    addedItems.push({ name: itemName, price: price, quantity: 1 });
    updateTotal();
}

function updateItemTotal(itemName, quantity, price) {
    // Find the item in the addedItems list and update its quantity
    for (let item of addedItems) {
        if (item.name === itemName) {
            item.quantity = quantity;
            break;
        }
    }
    updateTotal();
}

function updateTotal() {
    total = addedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    document.getElementById('total').innerText = total.toFixed(2);
}

document.getElementById('finalize-bill-btn').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text("HOTEL PRIYANKA", 75, 10);
    doc.text(`CUSTOMER'S NAME: ${customerName}`, 10, 20);
    
    const tableData = addedItems.map((item, index) => [
        index + 1, item.name, `${item.quantity} x $${item.price.toFixed(2)}`, `$${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    doc.autoTable({
        head: [['SR. NO.', 'ITEMS', 'QUANTITY', 'PRICE']],
        body: tableData,
        startY: 30,
    });
    
    doc.text(`TOTAL: $${total.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text("Thank you! VISIT AGAIN..", 10, doc.autoTable.previous.finalY + 20);
    
    doc.save('bill.pdf');
    
    // Reset the page for a new bill
    location.reload();
});
