// ============================================
// CONFIGURACIÓN
// ============================================

// URL de tu Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbwpk_qIksMbrHBWixnbqk2ZJyCd7z6DCrszLqT-mh9ds7Kdx7-KRlvy4V5ms7xYwfe2/exec';

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

function renderGifts() {
    const grid = document.getElementById('gifts-grid');
    grid.innerHTML = '';

    giftsData.forEach((gift, index) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        
        // Los depósitos NUNCA están reservados
        const isReserved = gift.tipo !== 'deposito' && gift.estado === 'Reservado';
        
        col.innerHTML = `
            <div class="gift-card ${isReserved ? 'reserved' : ''}" data-index="${index}">
                <img src="${gift.imagen || 'https://via.placeholder.com/400x200'}" 
                     alt="${gift.nombre}" 
                     class="gift-card-img">
                <div class="gift-card-body">
                    <h3 class="gift-title">${gift.nombre}</h3>
                    <p class="gift-description">${gift.descripcion}</p>
                    ${gift.precio > 0 ? `<p class="gift-price">$${formatPrice(gift.precio)}</p>` : ''}
                    
                    ${gift.tipo === 'deposito' ? `
                        <div class="deposit-info mb-2">
                            <i class="fas fa-info-circle"></i> 
                            <small style="color: var(--color-silver); opacity: 0.8;">
                                Múltiples personas pueden realizar depósitos
                            </small>
                        </div>
                    ` : gift.link_compra ? `
                        <a href="${gift.link_compra}" target="_blank" class="btn-view-product mb-2">
                            <i class="fas fa-external-link-alt"></i> Ver Producto
                        </a>
                    ` : ''}
                    
                    ${isReserved 
                        ? `<span class="badge-reserved">
                             <i class="fas fa-check-circle"></i> Reservado
                           </span>` 
                        : `<button class="btn btn-reserve" onclick="openReserveModal(${gift.id}, '${gift.nombre.replace(/'/g, "\\'")}')">
                             <i class="fas fa-${gift.tipo === 'deposito' ? 'dollar-sign' : 'gift'}"></i> 
                             ${gift.tipo === 'deposito' ? 'Hacer Depósito' : 'Reservar'}
                           </button>`
                    }
                </div>
            </div>
        `;
        
        grid.appendChild(col);
    });

    // Animar las tarjetas
    if (!isMobile) {
        animateCards();
    } else {
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
    
    // Buscar el regalo en los datos
    const regalo = giftsData.find(g => g.id === giftId);
    
    document.getElementById('gift-id').value = giftId;
    document.getElementById('selected-gift-name').textContent = giftName;
    
    // Limpiar campos especiales anteriores
    const existingDepositField = document.getElementById('deposit-amount-field');
    const existingBankInfo = document.getElementById('bank-info');
    if (existingDepositField) existingDepositField.remove();
    if (existingBankInfo) existingBankInfo.remove();
    
    // Si es depósito, mostrar campos especiales
    if (regalo && regalo.tipo === 'deposito') {
        const messageField = document.getElementById('guest-message').parentElement;
        
        // Agregar campo de monto
        const depositField = document.createElement('div');
        depositField.id = 'deposit-amount-field';
        depositField.className = 'mb-3';
        depositField.innerHTML = `
            <label for="deposit-amount" class="form-label">Monto a depositar *</label>
            <div class="input-group">
                <span class="input-group-text" style="background: rgba(255,255,255,0.05); border-color: rgba(192,192,192,0.3); color: var(--color-silver);">$</span>
                <input type="number" class="form-control" id="deposit-amount" required 
                       placeholder="Ej: 50000" min="1000" step="1000">
            </div>
            <small class="form-text" style="color: var(--color-light-silver); opacity: 0.7;">
                Ingresa el monto que deseas aportar
            </small>
        `;
        
        // Agregar información bancaria
        const bankInfo = document.createElement('div');
        bankInfo.id = 'bank-info';
        bankInfo.className = 'alert mb-3';
        bankInfo.style.cssText = 'background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); color: var(--color-light-silver);';
        bankInfo.innerHTML = `
            <h6 style="color: var(--color-gold); margin-bottom: 0.75rem;">
                <i class="fas fa-university"></i> Datos para Transferencia
            </h6>
            <div style="font-size: 0.95rem; line-height: 1.8;">
                <strong>Titular:</strong> Cesar Lopez<br>
                <strong>Banco:</strong> Banco Itaú<br>
                <strong>Tipo de Cuenta:</strong> Cuenta Corriente<br>
                <strong>N° de Cuenta:</strong> 00-000-0000000-0<br>
                <strong>RUT:</strong> XX.XXX.XXX-X<br>
                <strong>Email:</strong> cesarlopez@example.com
            </div>
            <small class="mt-2 d-block" style="opacity: 0.8;">
                <i class="fas fa-info-circle"></i> Después de transferir, completa este formulario para registrar tu aporte
            </small>
        `;
        
        // Insertar antes del campo de mensaje
        messageField.parentElement.insertBefore(depositField, messageField);
        messageField.parentElement.insertBefore(bankInfo, messageField);
    }
    
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
    
    // Verificar si es depósito
    const depositAmountField = document.getElementById('deposit-amount');
    const depositAmount = depositAmountField ? depositAmountField.value.trim() : '';

    if (!guestName) {
        showAlert('Por favor ingresa tu nombre', 'warning');
        return;
    }
    
    if (depositAmountField && !depositAmount) {
        showAlert('Por favor ingresa el monto del depósito', 'warning');
        return;
    }

    // Mostrar loading en botón
    toggleButtonLoading(true);

    try {
        // Construir URL con parámetros GET
        let url = `${API_URL}?action=reservar&id_regalo=${giftId}&nombre_invitado=${encodeURIComponent(guestName)}&mensaje_novios=${encodeURIComponent(guestMessage)}`;
        
        // Agregar monto si es depósito
        if (depositAmount) {
            url += `&monto_deposito=${encodeURIComponent(depositAmount)}`;
        }
        
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('reserveModal')).hide();
            
            // Mensaje personalizado para depósitos
            const successMessage = depositAmount 
                ? '¡Depósito registrado! Recuerda realizar la transferencia con los datos proporcionados 💕'
                : '¡Regalo reservado exitosamente! Gracias por tu generosidad 💕';
            
            showAlert(successMessage, 'success');
            
            // Limpiar formulario
            document.getElementById('reserveForm').reset();
            
            // Recargar regalos
            setTimeout(() => {
                loadGifts();
            }, 1500);

        } else {
            throw new Error(result.message || 'Error al procesar');
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message || 'Error al procesar. Inténtalo nuevamente.', 'danger');
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