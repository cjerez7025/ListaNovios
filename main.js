// ============================================
// CONFIGURACIÓN
// ============================================

// URL de tu Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbw42ujKQ8t27jbImc07kKH8jKTSMIHvBQlZ2TTM7mXfPihrKsplMH1-LNoS26uJs4Di/exec'
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
    const existingShippingInfo = document.getElementById('shipping-info');
    if (existingDepositField) existingDepositField.remove();
    if (existingBankInfo) existingBankInfo.remove();
    if (existingShippingInfo) existingShippingInfo.remove();
    
    const nameField = document.getElementById('guest-name').parentElement;
    
    // SI ES DEPÓSITO → Mostrar datos bancarios
    if (regalo && regalo.tipo === 'deposito') {
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
            <h6 style="color: var(--color-gold); margin-bottom: 1rem; font-weight: 600;">
                <i class="fas fa-university"></i> Datos para Transferencia / Depósito
            </h6>
            
            <div class="bank-data-grid" style="display: grid; gap: 0.8rem;">
                
                <div class="bank-data-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color: var(--color-silver); font-size: 0.85rem;">Titular:</strong>
                        <button type="button" class="btn-copy-icon" onclick="copyToClipboard('Cesar Orlando Lopez Navarro', this)" title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-value">Cesar Orlando Lopez Navarro</div>
                </div>
                
                <div class="bank-data-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color: var(--color-silver); font-size: 0.85rem;">RUT:</strong>
                        <button type="button" class="btn-copy-icon" onclick="copyToClipboard('13.436.870-5', this)" title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-value">13.436.870-5</div>
                </div>
                
                <div class="bank-data-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color: var(--color-silver); font-size: 0.85rem;">Banco:</strong>
                        <button type="button" class="btn-copy-icon" onclick="copyToClipboard('Banco Itaú', this)" title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-value">Banco Itaú</div>
                </div>
                
                <div class="bank-data-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color: var(--color-silver); font-size: 0.85rem;">Tipo de Cuenta:</strong>
                        <button type="button" class="btn-copy-icon" onclick="copyToClipboard('Cuenta Corriente', this)" title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-value">Cuenta Corriente</div>
                </div>
                
                <div class="bank-data-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color: var(--color-silver); font-size: 0.85rem;">N° de Cuenta:</strong>
                        <button type="button" class="btn-copy-icon" onclick="copyToClipboard('0229806460', this)" title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-value" style="font-family: 'Courier New', monospace; font-size: 1.1rem; letter-spacing: 1px;">0229806460</div>
                </div>
                
                <div class="bank-data-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color: var(--color-silver); font-size: 0.85rem;">Email:</strong>
                        <button type="button" class="btn-copy-icon" onclick="copyToClipboard('celopezn@gmail.com', this)" title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-value" style="text-transform: lowercase;">celopezn@gmail.com</div>
                </div>
                
            </div>
            
            <div class="mt-3 pt-3" style="border-top: 1px solid rgba(212, 175, 55, 0.2);">
                <button type="button" class="btn-copy-all" onclick="copyAllBankData(this)">
                    <i class="fas fa-clipboard-list"></i> Copiar Todos los Datos
                </button>
            </div>
            
            <small class="mt-3 d-block" style="opacity: 0.8; text-align: center;">
                <i class="fas fa-info-circle"></i> Después de transferir, completa este formulario para registrar tu aporte
            </small>
        `;
        
        nameField.parentElement.insertBefore(depositField, nameField);
        nameField.parentElement.insertBefore(bankInfo, nameField);
    } 
    // SI ES REGALO NORMAL → Mostrar dirección de envío
    else {
        const shippingInfo = document.createElement('div');
        shippingInfo.id = 'shipping-info';
        shippingInfo.className = 'alert mb-3';
        shippingInfo.style.cssText = 'background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); color: var(--color-light-silver);';
        shippingInfo.innerHTML = `
            <h6 style="color: #4CAF50; margin-bottom: 0.8rem; font-weight: 600;">
                <i class="fas fa-shipping-fast"></i> Dirección de Envío
            </h6>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong style="color: var(--color-silver); font-size: 0.9rem;">Enviar a:</strong>
                    <button type="button" class="btn-copy-icon" onclick="copyShippingAddress(this)" title="Copiar dirección">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div style="color: #ffffff; font-size: 1.05rem; font-weight: 600; line-height: 1.6;">
                    Versalles 5783<br>
                    Conchalí, Santiago
                </div>
            </div>
            <small style="opacity: 0.9;">
                <i class="fas fa-info-circle"></i> 
                Puedes comprar el regalo en la tienda de tu preferencia y enviarlo a esta dirección
            </small>
        `;
        
        nameField.parentElement.insertBefore(shippingInfo, nameField);
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
// FUNCIONES DE COPIAR
// ============================================

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Cambiar icono temporalmente
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        
        // Cambiar a check
        icon.className = 'fas fa-check';
        button.classList.add('copied');
        
        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar. Intenta seleccionar y copiar manualmente.');
    });
}

function copyAllBankData(button) {
    const allData = `DATOS BANCARIOS - CESAR & PAULI

Titular: Cesar Orlando Lopez Navarro
RUT: 13.436.870-5
Banco: Banco Itaú
Tipo de Cuenta: Cuenta Corriente
N° de Cuenta: 0229806460
Email: celopezn@gmail.com`;

    navigator.clipboard.writeText(allData).then(() => {
        const icon = button.querySelector('i');
        const text = button.childNodes[1]; // El texto del botón
        const originalIconClass = icon.className;
        const originalText = text.textContent;
        
        // Cambiar a check
        icon.className = 'fas fa-check-circle';
        text.textContent = ' ¡Copiado!';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
        
        setTimeout(() => {
            icon.className = originalIconClass;
            text.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar. Intenta copiar cada dato individualmente.');
    });
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
// ============================================
// COPIAR UBICACIÓN
// ============================================

function copyLocation() {
    const locationData = `📍 UBICACIÓN DEL EVENTO - CESAR & PAULI

🎉 La Boda del Año
📍 Dirección: Lo Fontecilla, Parcela 9A, Batuco
🏙️ Región Metropolitana

📅 Fecha: 10 de Enero, 2026
🕐 Horario: 10:30 - 19:00 hrs
⭐ Llegada sugerida: Desde las 10:30 hrs

✉️ Confirmar asistencia hasta: 02 de Enero, 2026

🗺️ Google Maps:
https://maps.app.goo.gl/Fk5bWtH7xzd4z5Km8`;

    navigator.clipboard.writeText(locationData).then(() => {
        showAlert('✅ Ubicación copiada al portapapeles', 'success');
    }).catch(err => {
        console.error('Error al copiar:', err);
        showAlert('❌ No se pudo copiar la ubicación', 'danger');
    });
}
// ============================================
// MODAL DE CONFIRMACIÓN DE ASISTENCIA (RSVP)
// ============================================

function openRSVPModal() {
    const modal = new bootstrap.Modal(document.getElementById('rsvpModal'));
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

// Manejar envío del formulario RSVP
document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value.trim();
    const guests = document.getElementById('rsvp-guests').value;
    const phone = document.getElementById('rsvp-phone').value.trim();
    const message = document.getElementById('rsvp-message').value.trim();

    if (!name || !guests) {
        showAlert('Por favor completa los campos obligatorios', 'warning');
        return;
    }

    // Mostrar loading
    toggleRSVPButtonLoading(true);

    try {
        // Construir URL con parámetros GET
        const url = `${API_URL}?action=confirmar&nombre=${encodeURIComponent(name)}&num_personas=${encodeURIComponent(guests)}&telefono=${encodeURIComponent(phone)}&mensaje=${encodeURIComponent(message)}`;
        
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('rsvpModal')).hide();
            
            // Mostrar mensaje de éxito
            showAlert('✅ ¡Asistencia confirmada! Gracias por confirmar 💕', 'success');
            
            // Limpiar formulario
            document.getElementById('rsvpForm').reset();

        } else {
            throw new Error(result.message || 'Error al confirmar asistencia');
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message || 'Error al confirmar. Inténtalo nuevamente.', 'danger');
    } finally {
        toggleRSVPButtonLoading(false);
    }
});

function toggleRSVPButtonLoading(isLoading) {
    const btnText = document.getElementById('btn-rsvp-text');
    const btnSpinner = document.getElementById('btn-rsvp-spinner');
    const btnSubmit = document.getElementById('btn-rsvp-submit');

    if (isLoading) {
        btnText.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Confirmando...';
        btnSpinner.classList.remove('d-none');
        btnSubmit.disabled = true;
    } else {
        btnText.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar Asistencia';
        btnSpinner.classList.add('d-none');
        btnSubmit.disabled = false;
    }
}
function copyShippingAddress(button) {
    const address = `Versalles 5783, Conchalí, Santiago`;
    
    navigator.clipboard.writeText(address).then(() => {
        if (button) {
            // Si se llama desde el botón pequeño del modal
            const icon = button.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            button.classList.add('copied');
            
            setTimeout(() => {
                icon.className = originalClass;
                button.classList.remove('copied');
            }, 2000);
        } else {
            // Si se llama desde el botón grande del banner
            showAlert('✅ Dirección copiada al portapapeles', 'success');
        }
    }).catch(err => {
        console.error('Error al copiar:', err);
        showAlert('❌ No se pudo copiar la dirección', 'danger');
    });
}
// ============================================
// NAVEGACIÓN Y SCROLL SUAVE
// ============================================

// Scroll suave al hacer click en los links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // No prevenir default si es el botón de confirmar
        if (href === '#' || this.classList.contains('nav-link-special')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // 80px offset para el navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Cerrar navbar en móvil
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Cambiar estilo del navbar al hacer scroll
const navbar = document.getElementById('mainNavbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Actualizar active state de los links
    updateActiveNavLink();
    
    lastScrollTop = scrollTop;
});

// Actualizar link activo según la sección visible
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // Si está en el top, activar "Inicio"
    if (scrollY < 100) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#inicio') {
                link.classList.add('active');
            }
        });
    }
}

// Inicializar active state al cargar
document.addEventListener('DOMContentLoaded', updateActiveNavLink);
// ============================================
// OBTENER DIRECCIONES DESDE UBICACIÓN DEL USUARIO
// ============================================

// ============================================
// OBTENER DIRECCIONES DESDE UBICACIÓN DEL USUARIO
// ============================================

function getDirectionsFromMyLocation() {
    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
        showAlert('❌ Tu navegador no soporta geolocalización', 'danger');
        return;
    }
    
    // Obtener referencia al botón que fue clickeado
    const button = event.currentTarget || event.target;
    const originalHTML = button.innerHTML;
    
    // Mostrar loading en el botón
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';
    button.disabled = true;
    
    // Coordenadas del destino (Lo Fontecilla 9A, Batuco)
    const destinationLat = -33.2156422;
    const destinationLng = -70.8418056;
    
    // Obtener ubicación del usuario
    navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Construir URL de Google Maps con direcciones
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
            
            // Abrir en nueva pestaña
            window.open(mapsUrl, '_blank');
            
            // Restaurar botón
            button.innerHTML = originalHTML;
            button.disabled = false;
            
            // Mensaje de éxito
            showAlert('🗺️ Abriendo direcciones en Google Maps...', 'success');
        },
        // Error callback
        (error) => {
            // Restaurar botón
            button.innerHTML = originalHTML;
            button.disabled = false;
            
            let errorMessage = '';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '❌ Debes permitir acceso a tu ubicación para ver las direcciones';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '❌ No se pudo obtener tu ubicación';
                    break;
                case error.TIMEOUT:
                    errorMessage = '❌ Tiempo de espera agotado al obtener tu ubicación';
                    break;
                default:
                    errorMessage = '❌ Error desconocido al obtener tu ubicación';
            }
            
            showAlert(errorMessage, 'danger');
            
            // Ofrecer alternativa
            setTimeout(() => {
                if (confirm('¿Quieres abrir Google Maps para introducir tu ubicación manualmente?')) {
                    window.open('https://maps.app.goo.gl/Fk5bWtH7xzd4z5Km8', '_blank');
                }
            }, 1500);
        },
        // Options
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}