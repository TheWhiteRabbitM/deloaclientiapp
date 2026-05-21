const API_URL = 'https://deloaenergy.it/wp-json/wp/v2/pages/2719';
const REFRESH_INTERVAL = 60 * 60 * 1000;
const HISTORY_KEY = 'deloa-history';

const HISTORY_DAYS = 7;
let priceData = [];

const APPLIANCES = [
    { id: 'washer', icon: 'local_laundry_service', label: 'Lavatrice', kwh: 1.5, note: 'ciclo eco 40°C' },
    { id: 'dishwasher', icon: 'local_laundry_service', label: 'Lavastoviglie', kwh: 1.3, note: 'ciclo eco 50°C' },
    { id: 'dryer', icon: 'local_laundry_service', label: 'Asciugatrice', kwh: 2.5, note: 'pompa di calore' },
    { id: 'washer_dryer', icon: 'local_laundry_service', label: 'Lavasciuga', kwh: 3.8, note: 'ciclo combinato' },
    { id: 'oven', icon: 'kitchen', label: 'Forno elettrico', kwh: 1.2, note: '1 ora a 180°C' },
    { id: 'oven_small', icon: 'kitchen', label: 'Fornetto', kwh: 0.9, note: '1 ora' },
    { id: 'microwave', icon: 'kitchen', label: 'Microonde', kwh: 0.8, note: '15 min potenza max' },
    { id: 'cooktop', icon: 'kitchen', label: 'Piano induzione', kwh: 1.8, note: '1 ora cottura' },
    { id: 'kettle', icon: 'local_cafe', label: 'Bollitore', kwh: 0.11, note: '1L 100°C' },
    { id: 'ev', icon: 'electric_car', label: 'Ricarica EV', kwh: 15, note: 'ricarica notturna media' },
    { id: 'ev_fast', icon: 'electric_car', label: 'Ricarica EV veloce', kwh: 30, note: 'ricarica completa 40 kWh' },
    { id: 'ac', icon: 'ac_unit', label: 'Climatizzatore', kwh: 1.5, note: '1 ora raffrescamento' },
    { id: 'heat_pump', icon: 'ac_unit', label: 'Pompa di calore', kwh: 2.5, note: '1 ora riscaldamento' },
    { id: 'boiler', icon: 'water_drop', label: 'Scaldabagno', kwh: 2.0, note: '1 ora riscaldamento' },
    { id: 'iron', icon: 'local_laundry_service', label: 'Ferro da stiro', kwh: 1.0, note: '1 ora' },
    { id: 'vacuum', icon: 'local_laundry_service', label: 'Aspirapolvere', kwh: 0.8, note: '1 ora' },
    { id: 'coffee', icon: 'local_cafe', label: 'Macchina caffè', kwh: 0.06, note: '1 tazzina' },
];
let selectedAppliances = new Set();
let refreshTimer = null;
let countdownTimer = null;
let nextRefreshTime = null;

const elements = {
    statusValue: document.getElementById('status-value'),
    lastUpdate: document.getElementById('last-update'),
    nextUpdate: document.getElementById('next-update'),
    minToday: document.getElementById('min-today'),
    maxToday: document.getElementById('max-today'),
    compareToday: document.getElementById('compare-today-val'),
    compareYesterday: document.getElementById('compare-yesterday-val'),
    compareDiff: document.getElementById('compare-diff'),
    chart: document.getElementById('chart'),
    historyList: document.getElementById('history-list'),
    priceTable: document.getElementById('price-table'),
    btnRefresh: document.getElementById('btn-refresh'),
    btnTheme: document.getElementById('btn-theme'),
    themeIcon: document.getElementById('theme-icon'),
    btnNotifications: document.getElementById('btn-notifications'),
    notifIcon: document.getElementById('notif-icon'),
    langSelect: document.getElementById('lang-select'),
    snackbar: document.getElementById('snackbar'),
    snackbarMessage: document.getElementById('snackbar-message'),
    snackbarAction: document.getElementById('snackbar-action'),
};

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveHistory(data) {
    const history = getHistory();
    const today = new Date().toDateString();
    const existing = history.findIndex(h => h.date === today);
    const entry = {
        date: today,
        data: data,
        avg: data.reduce((s, p) => s + p.price, 0) / data.length,
        min: Math.min(...data.map(p => p.price)),
        max: Math.max(...data.map(p => p.price)),
    };
    if (existing >= 0) {
        history[existing] = entry;
    } else {
        history.unshift(entry);
    }
    const trimmed = history.slice(0, HISTORY_DAYS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    return trimmed;
}

async function fetchPrices() {
    showLoading();
    try {
        const response = await fetch(API_URL, {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const page = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(page.content.rendered, 'text/html');
        priceData = parsePrices(doc);
        const history = saveHistory(priceData);
        updateUI(history);
        showSnackbar(t('dataUpdated'));
        scheduleNextRefresh();
    } catch (error) {
        console.error('Fetch error:', error);
        showError();
        showSnackbar(t('loadError'));
        scheduleNextRefresh();
    }
}

function parsePrices(doc) {
    const todaySection = doc.querySelector('.deloa-day-section');
    const items = todaySection ? todaySection.querySelectorAll('.deloa-item') : doc.querySelectorAll('.deloa-item');
    const prices = [];
    items.forEach((item) => {
        const ora = item.querySelector('.ora')?.textContent.trim();
        const prezzo = item.querySelector('.prezzo')?.textContent.trim();
        if (ora && prezzo) {
            const hour = parseInt(ora.split(':')[0], 10);
            const priceStr = prezzo.replace(/[^\d,]/g, '').replace(',', '.');
            const price = parseFloat(priceStr);
            if (!isNaN(price)) {
                prices.push({ hour, price });
            }
        }
    });
    return prices.sort((a, b) => a.hour - b.hour);
}

function updateUI(history) {
    if (priceData.length === 0) {
        showError();
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const avgPrice = priceData.reduce((sum, p) => sum + p.price, 0) / priceData.length;
    const currentPrice = priceData.find(p => p.hour === currentHour);
    const minPrice = priceData.reduce((m, p) => p.price < m.price ? p : m);
    const maxPrice = priceData.reduce((m, p) => p.price > m.price ? p : m);

    const pad = (n) => n.toString().padStart(2, '0');

    elements.statusValue.textContent = currentPrice
        ? `${currentPrice.price.toFixed(3)} €/kWh`
        : 'N/D';

    elements.minToday.textContent = `${minPrice.price.toFixed(3)}`;
    elements.maxToday.textContent = `${maxPrice.price.toFixed(3)}`;

    elements.lastUpdate.textContent = `${t('lastUpdate')}: ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    if (currentPrice) {
        elements.compareToday.textContent = `${currentPrice.price.toFixed(3)} €/kWh`;

        const yesterday = history.find(h => {
            const d = new Date(h.date);
            const diff = (now - d) / (1000 * 60 * 60 * 24);
            return diff >= 1 && diff < 2;
        });

        if (yesterday) {
            const yPrice = yesterday.data.find(p => p.hour === currentHour);
            if (yPrice) {
                elements.compareYesterday.textContent = `${yPrice.price.toFixed(3)} €/kWh`;
                const diff = currentPrice.price - yPrice.price;
                const pct = ((diff / yPrice.price) * 100).toFixed(1);
                if (diff < 0) {
                    elements.compareDiff.textContent = `-${Math.abs(diff).toFixed(3)} (${pct}%)`;
                    elements.compareDiff.className = 'status-card__diff status-card__diff--down';
                } else if (diff > 0) {
                    elements.compareDiff.textContent = `+${diff.toFixed(3)} (${pct}%)`;
                    elements.compareDiff.className = 'status-card__diff status-card__diff--up';
                } else {
                    elements.compareDiff.textContent = '=';
                    elements.compareDiff.className = 'status-card__diff status-card__diff--same';
                }
            } else {
                elements.compareYesterday.textContent = '--';
                elements.compareDiff.textContent = '';
                elements.compareDiff.className = 'status-card__diff status-card__diff--same';
            }
        } else {
            elements.compareYesterday.textContent = '--';
            elements.compareDiff.textContent = '';
            elements.compareDiff.className = 'status-card__diff status-card__diff--same';
        }
    } else {
        elements.compareToday.textContent = '--';
        elements.compareYesterday.textContent = '--';
        elements.compareDiff.textContent = '';
    }

    renderBands(currentHour);
    renderChart(currentHour, avgPrice);
    renderHistory(history);
    renderTable(currentHour, avgPrice);
    renderSmartConsumption(avgPrice, currentPrice);
    checkNotifications(currentPrice, avgPrice);
}

function getHourBand(hour) {
    const d = new Date();
    const day = d.getDay();
    if (day === 0) return 'F3';
    if (day === 6) {
        if (hour >= 7 && hour < 23) return 'F2';
        return 'F3';
    }
    if (hour >= 8 && hour < 19) return 'F1';
    if ((hour >= 7 && hour < 8) || (hour >= 19 && hour < 23)) return 'F2';
    return 'F3';
}

function computeBandAvg(band) {
    const prices = priceData.filter(p => getHourBand(p.hour) === band);
    if (prices.length === 0) return null;
    return prices.reduce((s, p) => s + p.price, 0) / prices.length;
}

function renderBands(currentHour) {
    const container = document.getElementById('bands-grid');
    if (!container) return;

    const bands = ['F1', 'F2', 'F3'];
    const now = new Date();
    const currentBand = getHourBand(currentHour);

    let html = '';
    const bandPrices = {};
    bands.forEach(b => { bandPrices[b] = computeBandAvg(b); });

    const f3Avg = bandPrices['F3'];
    const f1Avg = bandPrices['F1'];
    const f2Avg = bandPrices['F2'];

    bands.forEach(b => {
        const active = b === currentBand ? ' band-item--active' : '';
        const price = bandPrices[b];
        if (price == null) return;

        let diffHtml = '';
        if (b === 'F3' && f1Avg) {
            const d = ((f3Avg - f1Avg) / f1Avg * 100);
            if (Math.abs(d) > 0.1) {
                const isMore = d > 0;
                diffHtml = `<div class="band-item__diff ${isMore ? 'band-item__diff--more' : 'band-item__diff--less'}">${isMore ? '+' : ''}${d.toFixed(1)}% vs F1</div>`;
            }
        } else if ((b === 'F1' || b === 'F2') && f3Avg) {
            const d = ((price - f3Avg) / f3Avg * 100);
            if (Math.abs(d) > 0.1) {
                const isMore = d > 0;
                diffHtml = `<div class="band-item__diff ${isMore ? 'band-item__diff--more' : 'band-item__diff--less'}">${isMore ? '+' : ''}${d.toFixed(1)}% vs F3</div>`;
            }
        }

        const hoursLabel = b === 'F1' ? t('bandF1Hours')
            : b === 'F2' ? t('bandF2Hours')
            : t('bandF3Hours');

        html += `<div class="band-item${active}">
            <div class="band-item__name band-item__name--${b.toLowerCase()}">${t('bandF' + b.slice(1))}</div>
            <div class="band-item__hours">${hoursLabel}</div>
            <div class="band-item__price">${price.toFixed(3)} €/kWh</div>
            ${diffHtml}
            ${active ? `<div style="font-size:10px;color:var(--deloa-green);margin-top:4px;font-weight:600;">${t('bandNow')}</div>` : ''}
        </div>`;
    });

    container.innerHTML = html;
}

function renderChart(currentHour, avgPrice) {
    const maxPrice = Math.max(...priceData.map(p => p.price));
    const chartHeight = 108;

    elements.chart.innerHTML = '';

    priceData.forEach(({ hour, price }) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-bar-wrapper';

        const bar = document.createElement('div');
        const height = Math.max((price / maxPrice) * chartHeight, 4);
        bar.className = 'chart-bar';
        bar.style.height = `${height}px`;

        if (hour === currentHour) bar.classList.add('chart-bar--current');
        if (price < avgPrice * 0.8) bar.classList.add('chart-bar--cheap');
        else if (price > avgPrice * 1.15) bar.classList.add('chart-bar--expensive');
        else bar.classList.add('chart-bar--medium');

        bar.title = `${hour.toString().padStart(2, '0')}:00 - ${price.toFixed(3)} €/kWh`;

        const time = document.createElement('div');
        time.className = 'chart-bar__time';
        time.textContent = hour % 3 === 0 ? `${hour}` : '';

        wrapper.appendChild(bar);
        wrapper.appendChild(time);
        elements.chart.appendChild(wrapper);
    });
}

function renderHistory(history) {
    elements.historyList.innerHTML = '';

    if (history.length === 0) {
        elements.historyList.innerHTML = `<p class="history-empty">${t('noHistory')}</p>`;
        return;
    }

    history.forEach(h => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const dateObj = new Date(h.date);
        const dayName = dateObj.toLocaleDateString(currentLang === 'it' ? 'it-IT' : currentLang === 'de' ? 'de-DE' : 'en-US', { weekday: 'short' });
        const dayNum = dateObj.toLocaleDateString(currentLang === 'it' ? 'it-IT' : currentLang === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit' });

        item.innerHTML = `
            <span class="history-item__date">${dayName} ${dayNum}</span>
            <span class="history-item__min">${t('min')} ${h.min.toFixed(3)}</span>
            <span class="history-item__avg">${t('avg')} ${h.avg.toFixed(3)}</span>
            <span class="history-item__max">${t('max')} ${h.max.toFixed(3)}</span>
        `;
        elements.historyList.appendChild(item);
    });
}

function renderTable(currentHour, avgPrice) {
    elements.priceTable.innerHTML = '';

    priceData.forEach(({ hour, price }) => {
        const item = document.createElement('div');
        item.className = 'price-item';
        if (hour === currentHour) item.classList.add('price-item--current');
        if (price < avgPrice * 0.8) item.classList.add('price-item--cheap');
        else if (price > avgPrice * 1.15) item.classList.add('price-item--expensive');

        item.innerHTML = `
            <span class="price-item__time">${hour.toString().padStart(2, '0')}:00</span>
            <span class="price-item__value">${price.toFixed(3)} €/kWh</span>
        `;

        elements.priceTable.appendChild(item);
    });
}

function renderSmartConsumption(avgPrice, currentPrice) {
    const container = document.getElementById('smart-saving');
    if (!container) return;

    const now = new Date();
    const currentHour = now.getHours();
    const band = getHourBand(currentHour);
    const bandPrice = computeBandAvg(band);

    const sorted = [...priceData].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0];
    const mostExp = sorted[sorted.length - 1];
    const priceMap = {};
    priceData.forEach(p => { priceMap[p.hour] = p.price; });

    let chipsHtml = APPLIANCES.map(a => {
        const sel = selectedAppliances.has(a.id) ? ' appliance-chip--sel' : '';
        return `<button class="appliance-chip${sel}" data-id="${a.id}">
            <span class="material-icons-round">${a.icon}</span>
            <span>${a.label}</span>
        </button>`;
    }).join('');

    let resultsHtml = '';
    selectedAppliances.forEach(id => {
        const app = APPLIANCES.find(a => a.id === id);
        if (!app) return;

        const costNow = currentPrice ? currentPrice.price * app.kwh : null;
        const costBest = cheapest ? cheapest.price * app.kwh : null;
        const costWorst = mostExp ? mostExp.price * app.kwh : null;

        const pctNow = currentPrice ? ((currentPrice.price - cheapest.price) / cheapest.price * 100) : null;
        const bestHour = cheapest ? cheapest.hour : null;

        let bodyHtml = `<div class="appliance-result__row">
            <span class="material-icons-round">${app.icon}</span>
            <span class="appliance-result__name">${app.label} <span class="appliance-result__kwh">${app.kwh} kWh</span></span>
            <span class="appliance-result__now">${costNow != null ? costNow.toFixed(2) + ' €' : '—'}</span>
        </div>`;

        if (costNow != null && costBest != null && bestHour != null) {
            const saved = costNow - costBest;
            const pct = pctNow != null ? Math.round(Math.abs(pctNow)) : 0;
            bodyHtml += `<div class="appliance-result__bars">
                <div class="appliance-result__bar">
                    <span>Ora (${String(currentHour).padStart(2, '0')}:00)</span>
                    <span class="appliance-result__bar-val appliance-result__bar-val--high">${costNow.toFixed(2)} €</span>
                </div>
                <div class="appliance-result__bar">
                    <span>Alle ${String(bestHour).padStart(2, '0')}:00</span>
                    <span class="appliance-result__bar-val appliance-result__bar-val--low">${costBest.toFixed(2)} €</span>
                </div>
                <div class="appliance-result__saved">Risparmi <b>${saved.toFixed(2)} €</b> (${pct}%)</div>
            </div>`;
        } else if (costNow != null && bestHour === currentHour) {
            bodyHtml += `<div class="appliance-result__bars"><div class="appliance-result__saved appliance-result__saved--now">Prezzo minimo raggiunto ora</div></div>`;
        }

        resultsHtml += bodyHtml;
    });

    let bandContextHtml = '';
    if (bandPrice && cheapest) {
        const diffFromLowest = ((bandPrice - cheapest.price) / cheapest.price * 100).toFixed(0);
        const dir = diffFromLowest > 0 ? 'più cara' : 'più economica';
        const absDiff = Math.abs(diffFromLowest);
        bandContextHtml = `<div class="smart-block__note">Fascia ${band} (${bandPrice.toFixed(3)} €/kWh) — ${absDiff}% ${dir} del minimo odierno (${cheapest.price.toFixed(3)} €/kWh alle ${String(cheapest.hour).padStart(2, '0')}:00)</div>`;
    }

    container.innerHTML = `
        <div class="smart-block">
            <div class="smart-block__label">${t('smartPickAppliance')}</div>
            <div class="smart-appliances__chips">${chipsHtml}</div>
        </div>
        ${resultsHtml ? `<div class="smart-appliances__results">${resultsHtml}</div>` : `<div class="smart-block__note" style="text-align:center;color:var(--text-tertiary);padding:12px 0;">${t('smartNoData')}</div>`}
        ${bandContextHtml ? `<div class="smart-block" style="margin-top:8px;background:var(--bg-card);">${bandContextHtml}</div>` : ''}
    `;

    container.querySelectorAll('.appliance-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (selectedAppliances.has(id)) {
                selectedAppliances.delete(id);
            } else {
                selectedAppliances.add(id);
            }
            renderSmartConsumption(avgPrice, currentPrice);
        });
    });
}

function showLoading() {
    elements.statusValue.textContent = '';
    elements.chart.innerHTML = '<div class="loading-spinner"></div>';
    elements.priceTable.innerHTML = '';
    const bandsEl = document.getElementById('bands-grid');
    if (bandsEl) bandsEl.innerHTML = '';
    const smartEl = document.getElementById('smart-saving');
    if (smartEl) smartEl.innerHTML = '';
}

function showError() {
    elements.statusValue.textContent = 'N/D';
    elements.lastUpdate.textContent = `${t('lastUpdate')}: --`;
}

function showSnackbar(message) {
    elements.snackbarMessage.textContent = message;
    elements.snackbar.classList.add('snackbar--visible');
    setTimeout(() => {
        elements.snackbar.classList.remove('snackbar--visible');
    }, 2500);
}

function scheduleNextRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    nextRefreshTime = Date.now() + REFRESH_INTERVAL;
    refreshTimer = setTimeout(fetchPrices, REFRESH_INTERVAL);
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    if (!nextRefreshTime) return;
    const remaining = Math.max(0, nextRefreshTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    elements.nextUpdate.textContent = `${t('nextUpdate')}: ${mins}m ${secs.toString().padStart(2, '0')}s`;
}

function androidNotify(title, body) {
    try {
        if (window.AndroidNotifier && window.AndroidNotifier.isAvailable()) {
            window.AndroidNotifier.showNotification(title, body);
            return true;
        }
    } catch (e) {}
    return false;
}

function androidNotifPermission() {
    try {
        if (window.AndroidNotifier && window.AndroidNotifier.isAvailable()) {
            return window.AndroidNotifier.getPermissionStatus();
        }
    } catch (e) {}
    return null;
}

async function checkNotifications(currentPrice, avgPrice) {
    const lastNotified = localStorage.getItem('deloa_last_notified');
    const today = new Date().toDateString();
    if (lastNotified === today) return;

    let canNotify = androidNotifPermission() === 'granted';
    if (!canNotify && 'Notification' in window) {
        canNotify = Notification.permission === 'granted';
    }
    if (!canNotify) return;

    if (currentPrice) {
        if (currentPrice.price < avgPrice * 0.7) {
            const title = `Deloa Energy - ${t('notifCheap')}`;
            const body = t('notifCheapBody').replace('{price}', currentPrice.price.toFixed(3));
            if (!androidNotify(title, body)) {
                new Notification(title, { body, icon: 'icon-192.png', tag: 'cheap-hour' });
            }
            localStorage.setItem('deloa_last_notified', today);
        } else if (currentPrice.price > avgPrice * 1.4) {
            const title = `Deloa Energy - ${t('notifExpensive')}`;
            const body = t('notifExpensiveBody').replace('{price}', currentPrice.price.toFixed(3));
            if (!androidNotify(title, body)) {
                new Notification(title, { body, icon: 'icon-192.png', tag: 'expensive-hour' });
            }
            localStorage.setItem('deloa_last_notified', today);
        }
    }
}

function getSystemTheme() {
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    catch (e) { return 'dark'; }
}

function setTheme(theme, isAuto) {
    document.documentElement.setAttribute('data-theme', theme);
    if (isAuto) {
        localStorage.removeItem('deloa-theme');
    } else {
        localStorage.setItem('deloa-theme', theme);
    }
    elements.themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#1C1B1F' : '#F6F2F7';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const saved = localStorage.getItem('deloa-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMedia.addEventListener('change', (e) => {
    if (!localStorage.getItem('deloa-theme')) {
        setTheme(e.matches ? 'dark' : 'light', true);
    }
});

async function requestNotificationPermission() {
    try {
        if (window.AndroidNotifier && window.AndroidNotifier.isAvailable()) {
            const cur = window.AndroidNotifier.getPermissionStatus();
            if (cur === 'denied') {
                window.AndroidNotifier.requestPermission();
                showSnackbar('Richiesta permesso notifiche...');
                const poll = setInterval(() => {
                    const st = window.AndroidNotifier.getPermissionStatus();
                    if (st !== 'denied') {
                        clearInterval(poll);
                        elements.notifIcon.textContent = st === 'granted' ? 'notifications' : 'notifications_off';
                        showSnackbar(st === 'granted' ? t('notifEnabled') : t('notifDenied'));
                    }
                }, 500);
                setTimeout(() => clearInterval(poll), 10000);
            } else {
                elements.notifIcon.textContent = cur === 'granted' ? 'notifications' : 'notifications_off';
                showSnackbar(cur === 'granted' ? t('notifEnabled') : t('notifDenied'));
            }
            return;
        }
    } catch (e) { console.error('AndroidNotifier error:', e); }
    if ('Notification' in window) {
        try {
            const permission = await Notification.requestPermission();
            elements.notifIcon.textContent = permission === 'granted' ? 'notifications' : 'notifications_off';
            showSnackbar(permission === 'granted' ? t('notifEnabled') : t('notifDenied'));
            return;
        } catch (e) { console.error('Web Notification error:', e); }
    }
    showSnackbar('Notifiche non disponibili in questa app');
}

function updateNotificationIcon() {
    let granted = false;
    try {
        if (window.AndroidNotifier && window.AndroidNotifier.isAvailable()) {
            granted = window.AndroidNotifier.getPermissionStatus() === 'granted';
        }
    } catch (e) {}
    if (!granted) {
        try {
            granted = 'Notification' in window && Notification.permission === 'granted';
        } catch (e) {}
    }
    elements.notifIcon.textContent = granted ? 'notifications' : 'notifications_off';
}

elements.btnRefresh.addEventListener('click', () => {
    const icon = elements.btnRefresh.querySelector('.material-icons-round');
    icon.style.animation = 'spin 0.8s linear';
    fetchPrices().finally(() => {
        setTimeout(() => { icon.style.animation = ''; }, 800);
    });
});

elements.btnTheme.addEventListener('click', toggleTheme);
elements.btnNotifications.addEventListener('click', requestNotificationPermission);
elements.langSelect.addEventListener('change', (e) => {
    setLanguage(e.target.value);
});
elements.snackbarAction.addEventListener('click', () => {
    elements.snackbar.classList.remove('snackbar--visible');
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((reg) => {
            console.log('SW registrato:', reg.scope);
            if ('periodicSync' in reg) {
                reg.periodicSync.register('refresh-prices', { minInterval: 60 * 60 * 1000 })
                    .catch(() => {});
            }
        })
        .catch((err) => console.error('SW registration failed:', err));
}

const savedTheme = localStorage.getItem('deloa-theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme(getSystemTheme(), true);
}

const savedLang = localStorage.getItem('deloa-lang');
const initialLang = savedLang || detectSystemLanguage();
elements.langSelect.value = initialLang;
setLanguage(initialLang);

updateNotificationIcon();
fetchPrices();
