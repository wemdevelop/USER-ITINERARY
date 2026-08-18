document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PRICING DATA FOR CATEGORIES
    // ==========================================
    const pricingData = {
        deluxe: {
            label: 'DELUXE',
            total: 11489,
            hotels: 6000,
            activity: 800,
            vehicles: 3300,
            tax: 1389,
            cardBg: '#6156f6',
            btnTextColor: '#6156f6'
        },
        ruby: {
            label: 'RUBY',
            total: 15500,
            hotels: 9000,
            activity: 1500,
            vehicles: 4000,
            tax: 1000,
            cardBg: '#f43f5e',
            btnTextColor: '#f43f5e'
        },
        standard: {
            label: 'STANDARD',
            total: 8500,
            hotels: 4000,
            activity: 500,
            vehicles: 3100,
            tax: 900,
            cardBg: '#16a34a',
            btnTextColor: '#16a34a'
        }
    };

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    // ==========================================
    // CATEGORY TABS FUNCTIONALITY
    // ==========================================
    const categoryButtons = document.querySelectorAll('.cat-pill');
    const priceCard = document.getElementById('priceCard');
    const priceSubhead = document.getElementById('priceSubhead');
    const priceTag = document.getElementById('priceTag');
    const bigPrice = document.getElementById('bigPrice');
    const convertBtn = document.getElementById('convertBtn');

    const valHotels = document.getElementById('valHotels');
    const valActivity = document.getElementById('valActivity');
    const valVehicles = document.getElementById('valVehicles');
    const valSubtotal = document.getElementById('valSubtotal');
    const valTax = document.getElementById('valTax');
    const valTotal = document.getElementById('valTotal');

    function updateCategory(catKey, clickedBtn) {
        const data = pricingData[catKey];
        if (!data) return;

        // Active button states
        categoryButtons.forEach(btn => {
            if (clickedBtn ? btn === clickedBtn : btn.dataset.category === catKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Price card UI
        priceCard.style.backgroundColor = data.cardBg;
        priceTag.textContent = data.label;
        priceSubhead.textContent = `• ${formatCurrency(data.total)} / Adult`;
        bigPrice.textContent = formatCurrency(data.total);

        if (!convertBtn.classList.contains('pending')) {
            convertBtn.style.color = data.btnTextColor;
        }

        // Breakdown UI
        valHotels.textContent = formatCurrency(data.hotels);
        valActivity.textContent = formatCurrency(data.activity);
        valVehicles.textContent = formatCurrency(data.vehicles);

        const subtotal = data.hotels + data.activity + data.vehicles;
        valSubtotal.textContent = formatCurrency(subtotal);
        valTax.textContent = formatCurrency(data.tax);
        valTotal.textContent = formatCurrency(data.total);
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateCategory(btn.dataset.category, btn);
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    const categoryTabsContainer = document.querySelector('.category-tabs-container');
    if (categoryTabsContainer) {
        categoryTabsContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                categoryTabsContainer.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    // ==========================================
    // HERO TABS SWITCHING (Itinerary / Policies / Summary)
    // ==========================================
    const heroTabs = document.querySelectorAll('.hero-tab');
    const tabViews = document.querySelectorAll('.tab-content-view');

    heroTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            if (!targetTab) return;

            heroTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabViews.forEach(view => {
                if (view.id === `tab-${targetTab}`) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // ==========================================
    // DAY PLAN SIDEBAR SWITCHING
    // ==========================================
    const dayItems = document.querySelectorAll('.day-item');

    dayItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Ignore if clicked on trash or copy icon
            if (e.target.classList.contains('day-action-icon')) return;

            dayItems.forEach(d => d.classList.remove('active'));
            item.classList.add('active');

            // Scroll to corresponding day section
            const dayNum = item.dataset.day;
            const targetSection = document.querySelector(`.day-section[data-day="${dayNum}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // ACCORDION TOGGLES
    // ==========================================
    const accordionTitles = document.querySelectorAll('.accordion-title');

    accordionTitles.forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            const icon = title.querySelector('i');

            if (content.style.display === 'none') {
                content.style.display = 'flex';
                icon.className = 'fa-solid fa-chevron-up';
            } else {
                content.style.display = 'none';
                icon.className = 'fa-solid fa-chevron-down';
            }
        });
    });

    // ==========================================
    // ACTIONS (Remove / Clear / Convert)
    // ==========================================
    document.querySelectorAll('.link-remove').forEach(removeBtn => {
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const eventCard = e.target.closest('.event-card');
            if (eventCard && confirm('Are you sure you want to remove this event?')) {
                eventCard.remove();
            }
        });
    });

    const clearBtn = document.querySelector('.clear-itinerary');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all itinerary events?')) {
                document.querySelectorAll('.event-card').forEach(card => card.remove());
            }
        });
    }


    // ==========================================
    // CONFIRMATION MODAL
    // ==========================================
    const modal         = document.getElementById('confirmModal');
    const modalCancel   = document.getElementById('modalCancelBtn');
    const modalConfirm  = document.getElementById('modalConfirmBtn');
    const modalBadge    = document.getElementById('modalPackageBadge');
    const modalHotels   = document.getElementById('modalHotels');
    const modalActivity = document.getElementById('modalActivity');
    const modalVehicles = document.getElementById('modalVehicles');
    const modalTax      = document.getElementById('modalTax');
    const modalTotal    = document.getElementById('modalTotal');

    // Badge colours per category
    const badgeColors = {
        deluxe:   '#6156f6',
        ruby:     '#f43f5e',
        standard: '#16a34a'
    };

    function openModal() {
        if (convertBtn && convertBtn.classList.contains('pending')) {
            alert('Your booking request is already submitted and currently waiting for approval.');
            return;
        }

        // Find which category is currently active
        const activeBtn = document.querySelector('.cat-pill.active');
        const catKey    = activeBtn ? activeBtn.dataset.category : 'deluxe';
        const data      = pricingData[catKey];

        // Update modal badge
        modalBadge.textContent        = data.label;
        modalBadge.style.background   = badgeColors[catKey];

        // Populate breakdown
        modalHotels.textContent   = formatCurrency(data.hotels);
        modalActivity.textContent = formatCurrency(data.activity);
        modalVehicles.textContent = formatCurrency(data.vehicles);
        modalTax.textContent      = formatCurrency(data.tax);
        modalTotal.textContent    = formatCurrency(data.total);

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', openModal);
    }

    // Close on Cancel button
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }

    // Close when clicking outside the modal box
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Confirm action
    if (modalConfirm) {
        modalConfirm.addEventListener('click', () => {
            modalConfirm.textContent = '✓ Booking Confirmed!';
            modalConfirm.style.background = '#16a34a';

            setTimeout(() => {
                closeModal();

                // Change main button content to "Waiting for Approval"
                if (convertBtn) {
                    convertBtn.textContent = 'Waiting for Approval';
                    convertBtn.classList.add('pending');
                    convertBtn.style.color = '#ffffff';
                    convertBtn.style.background = 'rgba(255, 255, 255, 0.25)';
                    convertBtn.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                }

                // Reset modal confirm button
                setTimeout(() => {
                    modalConfirm.textContent  = 'Yes, Confirm Booking';
                    modalConfirm.style.background = '';
                }, 400);
            }, 1200);
        });
    }

});
