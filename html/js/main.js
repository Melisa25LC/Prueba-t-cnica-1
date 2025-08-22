// 1. Event Listener para el botón
document.addEventListener('DOMContentLoaded', function() {
    const loadProductsBtn = document.getElementById('loadProductsBtn');
    
    if (loadProductsBtn) {
        loadProductsBtn.addEventListener('click', loadProducts);
    }
});

// 2. Función principal para cargar productos
async function loadProducts() {
    try {
       
        const productsContainer = document.getElementById('productsContainer');
        productsContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        
        const response = await fetch('https://api.escuelajs.co/api/v1/products?limit=41&offset=0');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const products = await response.json();
        
        
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `<div class="alert alert-danger">Error loading products: ${error.message}</div>`;
    }
}

// 3. Función para crear cada card
function createProductCard(product) {
    // Recorta la descripción a 100 caracteres
    const shortDescription = product.description 
        ? product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '')
        : 'No description available';
    
    
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
        <div class="card h-100">
            <img src="${product.images[0]}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text flex-grow-1">${shortDescription}</p>
                <p class="card-text fw-bold">$${product.price}</p>
                <button type="button" class="btn btn-primary view-btn" data-bs-toggle="modal" data-bs-target="#productModal" data-product-id="${product.id}">
                    View
                </button>
            </div>
        </div>
    `;
    return col;
}

// 4. Event Listener para los botones "View"
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-btn')) {
        const productId = e.target.getAttribute('data-product-id');
        showProductDetails(productId);
    }
});

// 5. Función para mostrar detalles en el modal
async function showProductDetails(productId) {
    try {
        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const product = await response.json();
        

        const modalTitle = document.getElementById('productModalLabel');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = product.title;
        const categoryName = product.category ? product.category.name : 'No category';
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.images[0]}" class="img-fluid rounded" alt="${product.title}">
                </div>
                <div class="col-md-6">
                    <h4>${product.title}</h4>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Category:</strong> ${categoryName}</p>
                    <p><strong>Description:</strong></p>
                    <p>${product.description || 'No description available'}</p>
                </div>
            </div>
            ${product.images.length > 1 ? `
            <div class="row mt-3">
                <div class="col-12">
                    <h5>Additional Images</h5>
                    <div class="d-flex gap-2">
                        ${product.images.slice(1, 3).map((image, index) => 
                            `<img src="${image}" class="img-thumbnail" alt="Additional image ${index + 1}" style="width: 150px; height: 150px; object-fit: cover;">`
                        ).join('')}
                    </div>
                </div>
            </div>
            ` : ''}
        `;
    } catch (error) {
        console.error('Error loading product details:', error);
        modalBody.innerHTML = `<div class="alert alert-danger">Error loading product details: ${error.message}</div>`;
    }
}