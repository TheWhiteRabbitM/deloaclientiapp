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
    compareToday: document.getElementById('compare-today-val'),
    compareYesterday: document.getElementById('compare-yesterday-val'),
    compareDiff: document.getElementById('compare-diff'),
    bestHour: document.getElementById('best-hour'),
    bestPrice: document.getElementById('best-price'),
    worstHour: document.getElementById('worst-hour'),
    worstPrice: document.getElementById('worst-price'),
    timeline: document.getElementById('timeline'),
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
    const items = doc.querySelectorAll('.deloa-item');
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
    const cheapest = priceData.find(p => p.price === Math.min(...priceData.map(p => p.price)));
    const mostExpensive = priceData.find(p => p.price === Math.max(...priceData.map(p => p.price)));

    const pad = (n) => n.toString().padStart(2, '0');

    elements.statusValue.textContent = currentPrice
        ? `${currentPrice.price.toFixed(3)} €/kWh`
        : 'N/D';

    elements.lastUpdate.textContent = `${t('lastUpdate')}: ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    elements.bestHour.textContent = `${pad(cheapest.hour)}:00`;
    elements.bestPrice.textContent = `${cheapest.price.toFixed(3)} €/kWh`;

    elements.worstHour.textContent = `${pad(mostExpensive.hour)}:00`;
    elements.worstPrice.textContent = `${mostExpensive.price.toFixed(3)} €/kWh`;

    updateCompare(currentPrice, currentHour, history);
    renderTimeline(currentHour, avgPrice);
    renderChart(currentHour, avgPrice);
    renderHistory(history);
    renderTable(currentHour, avgPrice);
    checkNotifications(currentPrice, avgPrice);
}

function updateCompare(currentPrice, currentHour, history) {
    if (!currentPrice) {
        elements.compareToday.textContent = '--';
        elements.compareToday.className = 'compare-item__value compare-item__value--empty';
        elements.compareYesterday.textContent = '--';
        elements.compareYesterday.className = 'compare-item__value compare-item__value--empty';
        elements.compareDiff.textContent = '';
        elements.compareDiff.className = 'compare-diff';
        return;
    }

    elements.compareToday.textContent = `${currentPrice.price.toFixed(3)} €/kWh`;
    elements.compareToday.className = 'compare-item__value';

    const yesterday = history.find(h => {
        const d = new Date(h.date);
        const today = new Date();
        const diff = (today - d) / (1000 * 60 * 60 * 24);
        return diff >= 1 && diff < 2;
    });

    if (yesterday) {
        const yesterdayPrice = yesterday.data.find(p => p.hour === currentHour);
        if (yesterdayPrice) {
            elements.compareYesterday.textContent = `${yesterdayPrice.price.toFixed(3)} €/kWh`;
            elements.compareYesterday.className = 'compare-item__value';
            const diff = currentPrice.price - yesterdayPrice.price;
            const pct = ((diff / yesterdayPrice.price) * 100).toFixed(1);
            if (diff < 0) {
                elements.compareDiff.textContent = `${t('saving')} ${Math.abs(diff).toFixed(3)} €/kWh (${pct}%) ${t('respectYesterday')}`;
                elements.compareDiff.className = 'compare-diff compare-diff--down';
            } else if (diff > 0) {
                elements.compareDiff.textContent = `${t('moreExpensive')} ${diff.toFixed(3)} €/kWh ${t('more')} (${pct}%) ${t('respectYesterday')}`;
                elements.compareDiff.className = 'compare-diff compare-diff--up';
            } else {
                elements.compareDiff.textContent = t('samePrice');
                elements.compareDiff.className = 'compare-diff compare-diff--same';
            }
        } else {
            elements.compareYesterday.textContent = '--';
            elements.compareYesterday.className = 'compare-item__value compare-item__value--empty';
            elements.compareDiff.textContent = t('noDataYesterday');
            elements.compareDiff.className = 'compare-diff compare-diff--same';
        }
    } else if (history.length > 0) {
        elements.compareYesterday.textContent = '--';
        elements.compareYesterday.className = 'compare-item__value compare-item__value--empty';
        elements.compareDiff.textContent = t('dataAvailableTomorrow');
        elements.compareDiff.className = 'compare-diff compare-diff--same';
    } else {
        elements.compareYesterday.textContent = '--';
        elements.compareYesterday.className = 'compare-item__value compare-item__value--empty';
        elements.compareDiff.textContent = t('firstLoad');
        elements.compareDiff.className = 'compare-diff compare-diff--same';
    }
}

function renderTimeline(currentHour, avgPrice) {
    elements.timeline.innerHTML = '';

    const upcoming = [];
    for (let i = 1; i <= 6; i++) {
        const h = (currentHour + i) % 24;
        const p = priceData.find(d => d.hour === h);
        if (p) upcoming.push({ ...p, diff: i });
    }

    const changes = [];
    for (let i = 0; i < upcoming.length - 1; i++) {
        const curr = upcoming[i];
        const next = upcoming[i + 1];
        const goingUp = next.price > curr.price * 1.1;
        const goingDown = next.price < curr.price * 0.9;
        if (goingUp || goingDown) {
            changes.push({
                from: curr,
                to: next,
                goingUp,
                time: `${next.hour.toString().padStart(2, '0')}:00`,
            });
        }
    }

    if (changes.length === 0) {
        elements.timeline.innerHTML = `<p style="text-align:center;color:var(--text-tertiary);font-size:13px;padding:8px 0;">${t('noChanges')}</p>`;
        return;
    }

    changes.slice(0, 3).forEach(c => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        const iconClass = c.goingUp ? 'timeline-item__icon--bad' : 'timeline-item__icon--good';
        const iconName = c.goingUp ? 'trending_up' : 'trending_down';
        const label = c.goingUp ? t('priceRising') : t('priceFalling');
        const desc = `${c.from.price.toFixed(3)} → ${c.to.price.toFixed(3)} €/kWh`;

        item.innerHTML = `
            <div class="timeline-item__icon ${iconClass}">
                <span class="material-icons-round">${iconName}</span>
            </div>
            <div class="timeline-item__info">
                <p class="timeline-item__title">${label}</p>
                <p class="timeline-item__desc">${desc}</p>
            </div>
            <span class="timeline-item__time">${c.time}</span>
        `;
        elements.timeline.appendChild(item);
    });
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

    if (history.length <= 1) {
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
    const saved = localStorage.getItem('deloa-theme');
    const current = document.documentElement.getAttribute('data-theme');
    if (saved) {
        setTheme(current === 'dark' ? 'light' : 'dark');
    } else {
        setTheme(current === 'dark' ? 'light' : 'dark');
    }
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
