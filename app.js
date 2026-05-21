const API_URL = 'https://deloaenergy.it/wp-json/wp/v2/pages/2719';
const REFRESH_INTERVAL = 60 * 60 * 1000;
const HISTORY_KEY = 'deloa-history';
const HISTORY_DAYS = 7;
let priceData = [];
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

    renderChart(currentHour, avgPrice);
    renderHistory(history);
    renderTable(currentHour, avgPrice);
    renderSmartConsumption(avgPrice);
    checkNotifications(currentPrice, avgPrice);
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

function renderSmartConsumption(avgPrice) {
    const savingEl = document.getElementById('smart-saving');
    if (!savingEl) return;

    const sorted = [...priceData].sort((a, b) => a.price - b.price);
    const bestAvg = sorted.slice(0, 4).reduce((s, p) => s + p.price, 0) / 4;
    const consumoAnnuiKwh = 2700;
    const pctSpostabile = 30;
    const costoOriginale = consumoAnnuiKwh * avgPrice;
    const consumoSpostabile = consumoAnnuiKwh * (pctSpostabile / 100);
    const costoOttimizzato = (consumoAnnuiKwh - consumoSpostabile) * avgPrice + consumoSpostabile * bestAvg;
    const risparmio = costoOriginale - costoOttimizzato;

    if (risparmio > 0) {
        savingEl.innerHTML =
            `<span class="smart-saving__highlight">${t('smartSaving', { pct: pctSpostabile, kwh: Math.round(consumoSpostabile), amount: risparmio.toFixed(0) })}</span>` +
            `<br><small>${t('smartSavingExample')}</small>`;
    } else {
        savingEl.innerHTML = `<span class="smart-saving__empty">${t('smartNoData')}</span>`;
    }
}

function showLoading() {
    elements.statusValue.textContent = '';
    elements.chart.innerHTML = '<div class="loading-spinner"></div>';
    elements.priceTable.innerHTML = '';
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
