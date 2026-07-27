/* ==========================================================================
   LUMIÈRE ATELIER - LOGIC & WIZARD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // Fechar menu ao clicar em links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });

    // Modal Control
    const openModalBtn = document.getElementById('open-booking-modal');
    const closeModalBtn = document.getElementById('close-booking-modal');
    const bookingModal = document.getElementById('booking-modal');

    if (openModalBtn) openModalBtn.addEventListener('click', () => openBookingWizard());
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => closeBookingModal());
    
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    // Set default date to tomorrow
    const dateInput = document.getElementById('b_date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
    }
});

/* QUIZ LOGIC */
const quizAnswers = {};

function selectQ(step, answer) {
    quizAnswers[step] = answer;

    document.getElementById(`q-${step}`).classList.remove('active');

    if (step < 3) {
        document.getElementById(`q-${step + 1}`).classList.add('active');
        document.getElementById('quiz-fill').style.width = `${((step + 1) / 3) * 100}%`;
    } else {
        document.getElementById('q-res').classList.add('active');
        document.getElementById('quiz-fill').style.width = '100%';
        
        // Personalized recommendation
        const mainGoal = quizAnswers[1] || '';
        if (mainGoal.includes('Mechas')) {
            document.getElementById('q-res-title').innerText = 'Recomendado: Mechas & Colorimetria por Mayra Becker';
            document.getElementById('q-res-desc').innerText = 'Avaliação visagista com descoloração preservando a integridade dos fios e tonalização sob medida.';
        } else if (mainGoal.includes('Tratamento')) {
            document.getElementById('q-res-title').innerText = 'Recomendado: Spa Keune + Escova Grátis';
            document.getElementById('q-res-desc').innerText = 'Nutrição e reconstrução capilar com máscara Keune de 200ml inclusa.';
        } else {
            document.getElementById('q-res-title').innerText = 'Recomendado: Penteado de Gala por Luciana Quirino';
            document.getElementById('q-res-desc').innerText = 'Produção exclusiva com alta fixação para os seus momentos inesquecíveis.';
        }
    }
}

/* BOOKING WIZARD */
function openBookingWizard(serviceName = null) {
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) bookingModal.classList.add('active');

    if (serviceName) {
        const select = document.getElementById('b_service_select');
        if (select) {
            for (let option of select.options) {
                if (option.value.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(option.value.toLowerCase())) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

    nextWizStep(1);
}

function closeBookingModal() {
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) bookingModal.classList.remove('active');
}

function nextWizStep(step) {
    for (let i = 1; i <= 4; i++) {
        const page = document.getElementById(`wiz-page-${i}`);
        if (page) {
            if (i === step) page.classList.add('active');
            else page.classList.remove('active');
        }
    }
}

function quickBook(serviceName) {
    openBookingWizard(serviceName);
}

function bookWithStylist(stylistName) {
    openBookingWizard();
    showToast(`Agendamento direcionado para a especialista ${stylistName}`);
}

function confirmBooking() {
    const name = document.getElementById('b_name').value.trim();
    const phone = document.getElementById('b_phone').value.trim();

    if (!name || !phone) {
        showToast('Por favor, informe seu Nome e WhatsApp.');
        return;
    }

    nextWizStep(4);
    showToast('Agendamento efetuado com sucesso!');
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
