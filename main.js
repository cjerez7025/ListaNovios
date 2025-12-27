// ============================================
// CONFIGURACIÓN
// ============================================

// URL de tu Google Apps Script (REEMPLAZAR CON TU URL)
const API_URL = 'https://script.google.com/macros/s/AKfycbxjs_kSyjTrBvsVu7nF49C_YzC4kolAcGJG_o7a_IbN6evOBWy4UVcN5uYlUcgqLKNJ/exec';
// Detectar si es dispositivo móvil
const isMobile = window.innerWidth <= 768;

// ============================================
// VARIABLES GLOBALES
// ============================================

let giftsData = [];
let currentGiftId = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadGifts();
});

// ============================================
// CARGA DE REGALOS DESDE API
// ============================================

async function loadGifts() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }

        const data = await response.json();
        giftsData = data.regalos || [];

        // Renderizar las tarjetas
        renderGifts();

        // Ocultar spinner y mostrar contenido
        hideLoadingScreen();

    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar los regalos. Por favor, recarga la página.', 'danger');
        hideLoadingScreen();
    }
}

// ============================================
// RENDERIZAR TARJETAS DE REGALOS
// ============================================

function renderGifts() {
    const grid = document.getElementById('gifts-grid');
    grid.innerHTML = '';

    giftsData.forEach((gift, index) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        
        const isReserved = gift.estado === 'Reservado';
        
        col.innerHTML = `
            <div class="gift-card ${isReserved ? 'reserved' : ''}" data-index="${index}">
                <img src="${gift.imagen || 'https://via.placeholder.com/400x200'}" 
                     alt="${gift.nombre}" 
                     class="gift-card-img">
                <div class="gift-card-body">
                    <h3 class="gift-title">${gift.nombre}</h3>
                    <p class="gift-description">${gift.descripcion}</p>
                    <p class="gift-price">$${formatPrice(gift.precio)}</p>
                    
                    ${isReserved 
                        ? `<span class="badge-reserved">
                             <i class="fas fa-check-circle"></i> Reservado
                           </span>` 
                        : `<button class="btn btn-reserve" onclick="openReserveModal(${gift.id}, '${gift.nombre}')">
                             <i class="fas fa-gift"></i> Reservar
                           </button>`
                    }
                </div>
            </div>
        `;
        
        grid.appendChild(col);
    });

    // Animar las tarjetas (solo en desktop para mejor performance)
    if (!isMobile) {
        animateCards();
    } else {
        // En móvil, solo hacer fade in simple sin stagger
        gsap.to('.gift-card', {
            opacity: 1,
            duration: 0.5
        });
    }
}

// ============================================
// ANIMACIONES CON GSAP
// ============================================

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    gsap.to(loadingScreen, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
            loadingScreen.style.display = 'none';
            
            // Mostrar contenido principal
            gsap.to(mainContent, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            });

            // Animar header (solo en desktop)
            if (!isMobile) {
                animateHeader();
            }
        }
    });
}

function animateHeader() {
    const timeline = gsap.timeline();
    
    timeline
        .from('.couple-photo', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        })
        .from('.hero-title', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.hero-subtitle, .hero-date, .hero-description', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: 'power2.out'
        }, '-=0.3');
}

function animateCards() {
    gsap.set('.gift-card', { opacity: 0, y: 30 });
    
    gsap.to('.gift-card', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Hover effect (solo desktop)
    document.querySelectorAll('.gift-card:not(.reserved)').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// MODAL DE RESERVA
// ============================================

function openReserveModal(giftId, giftName) {
    currentGiftId = giftId;
    
    document.getElementById('gift-id').value = giftId;
    document.getElementById('selected-gift-name').textContent = giftName;
    
    const modal = new bootstrap.Modal(document.getElementById('reserveModal'));
    modal.show();

    // Animar modal (solo en desktop)
    if (!isMobile) {
        gsap.from('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }
}



// ============================================
// ENVIAR RESERVA
// ============================================

document.getElementById('reserveForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const guestName = document.getElementById('guest-name').value.trim();
    const guestMessage = document.getElementById('guest-message').value.trim();
    const giftId = document.getElementById('gift-id').value;

    if (!guestName) {
        showAlert('Por favor ingresa tu nombre', 'warning');
        return;
    }

    // Mostrar loading en botón
    toggleButtonLoading(true);

    try {
        // Construir URL con parámetros GET
        const url = `${API_URL}?action=reservar&id_regalo=${giftId}&nombre_invitado=${encodeURIComponent(guestName)}&mensaje_novios=${encodeURIComponent(guestMessage)}`;
        
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('reserveModal')).hide();
            
            // Mostrar mensaje de éxito
            showAlert('¡Regalo reservado exitosamente! Gracias por tu generosidad 💕', 'success');
            
            // Limpiar formulario
            document.getElementById('reserveForm').reset();
            
            // Recargar regalos
            setTimeout(() => {
                loadGifts();
            }, 1500);

        } else {
            throw new Error(result.message || 'Error al reservar');
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message || 'Error al procesar la reserva. Inténtalo nuevamente.', 'danger');
    } finally {
        toggleButtonLoading(false);
    }
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toggleButtonLoading(isLoading) {
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnSubmit = document.getElementById('btn-submit');

    if (isLoading) {
        btnText.textContent = 'Procesando...';
        btnSpinner.classList.remove('d-none');
        btnSubmit.disabled = true;
    } else {
        btnText.textContent = 'Confirmar Reserva';
        btnSpinner.classList.add('d-none');
        btnSubmit.disabled = false;
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);

    // Scroll suave hacia la alerta
    alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}