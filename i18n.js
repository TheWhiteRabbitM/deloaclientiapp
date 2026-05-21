const LANGUAGES = {
    it: {
        pageTitle: 'Deloa Energy - Prezzi Orari',
        currentPrice: 'Prezzo attuale',
        lastUpdate: 'Ultimo',
        nextUpdate: 'Prossimo',
        priceTrend: 'Andamento Prezzi Oggi',
        convenient: 'Conviene',
        normal: 'Normale',
        avoid: 'Evita',
        hourlyDetail: 'Dettaglio Orario',
        historyTitle: 'Storico Prezzi',
        noHistory: 'I dati storici appariranno dopo il primo aggiornamento giornaliero',
        yesterdayLabel: 'ieri',
        todayLabel: 'oggi',
        smartTitle: 'Consumo intelligente',
        smartSaving: 'Spostando il {pct}% dei consumi ({kwh} kWh/anno) nelle ore migliori, potresti risparmiare fino a {amount} €/anno',
        smartNoData: 'Dati insufficienti per il calcolo',
        smartSavingExample: 'Ricarica elettrica, lavatrice e asciugatrice nelle ore più convenienti',
        min: 'min',
        avg: 'media',
        max: 'max',
        dataUpdated: 'Dati aggiornati',
        loadError: 'Errore nel caricamento',
        noNotifSupport: 'Browser non supporta notifiche',
        notifEnabled: 'Notifiche attivate',
        notifDenied: 'Notifiche non concesse',
        notifCheap: 'Ora conveniente!',
        notifCheapBody: 'Prezzo: {price} €/kWh. Usa ora gli elettrodomestici!',
        notifExpensive: 'Ora costosa',
        notifExpensiveBody: 'Prezzo: {price} €/kWh. Evita elettrodomestici energivori.',
    },
    de: {
        pageTitle: 'Deloa Energy - Stundenpreise',
        currentPrice: 'Aktueller Preis',
        lastUpdate: 'Letzte',
        nextUpdate: 'Nächste',
        priceTrend: 'Preisverlauf Heute',
        convenient: 'Günstig',
        normal: 'Normal',
        avoid: 'Vermeiden',
        hourlyDetail: 'Stündliche Details',
        historyTitle: 'Preisverlauf',
        noHistory: 'Historische Daten erscheinen nach dem ersten täglichen Update',
        yesterdayLabel: 'gestern',
        todayLabel: 'heute',
        smartTitle: 'Intelligenter Stromverbrauch',
        smartSaving: 'Durch Verschieben von {pct}% des Verbrauchs ({kwh} kWh/Jahr) in die günstigsten Stunden könntest du bis zu {amount} €/Jahr sparen',
        smartNoData: 'Unzureichende Daten für die Berechnung',
        smartSavingExample: 'E-Auto laden, Waschmaschine und Trockner in den günstigsten Stunden nutzen',
        min: 'min',
        avg: 'durchschn.',
        max: 'max',
        dataUpdated: 'Daten aktualisiert',
        loadError: 'Fehler beim Laden',
        noNotifSupport: 'Browser unterstützt keine Benachrichtigungen',
        notifEnabled: 'Benachrichtigungen aktiviert',
        notifDenied: 'Benachrichtigungen abgelehnt',
        notifCheap: 'Günstige Stunde!',
        notifCheapBody: 'Preis: {price} €/kWh. Jetzt Geräte benutzen!',
        notifExpensive: 'Teure Stunde',
        notifExpensiveBody: 'Preis: {price} €/kWh. Energieintensive Geräte vermeiden.',
    },
    en: {
        pageTitle: 'Deloa Energy - Hourly Prices',
        currentPrice: 'Current price',
        lastUpdate: 'Last',
        nextUpdate: 'Next',
        priceTrend: "Today's Price Trend",
        convenient: 'Good deal',
        normal: 'Normal',
        avoid: 'Avoid',
        hourlyDetail: 'Hourly Details',
        historyTitle: 'Price History',
        noHistory: 'Historical data will appear after the first daily update',
        yesterdayLabel: 'yesterday',
        todayLabel: 'today',
        smartTitle: 'Smart consumption',
        smartSaving: 'By shifting {pct}% of consumption ({kwh} kWh/year) to the cheapest hours, you could save up to {amount} €/year',
        smartNoData: 'Insufficient data for calculation',
        smartSavingExample: 'EV charging, washer and dryer during cheapest hours',
        min: 'min',
        avg: 'avg',
        max: 'max',
        dataUpdated: 'Data updated',
        loadError: 'Loading error',
        noNotifSupport: 'Browser does not support notifications',
        notifEnabled: 'Notifications enabled',
        notifDenied: 'Notifications denied',
        notifCheap: 'Cheap hour!',
        notifCheapBody: 'Price: {price} €/kWh. Use appliances now!',
        notifExpensive: 'Expensive hour',
        notifExpensiveBody: 'Price: {price} €/kWh. Avoid energy-intensive appliances.',
    },
};

function detectSystemLanguage() {
    try {
        const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (lang.startsWith('de')) return 'de';
        if (lang.startsWith('en')) return 'en';
    } catch (e) {}
    return 'it';
}

let currentLang = 'it';

function t(key, params) {
    let val = LANGUAGES[currentLang]?.[key] || LANGUAGES.it[key] || key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            val = val.replace(`{${k}}`, v);
        }
    }
    return val;
}

function setLanguage(lang) {
    if (!LANGUAGES[lang]) return;
    currentLang = lang;
    localStorage.setItem('deloa-lang', lang);
    document.documentElement.lang = lang;
    document.title = t('pageTitle');
    updateStaticTexts();
    if (priceData.length > 0) {
        const history = getHistory();
        updateUI(history);
    }
}

function updateStaticTexts() {
    document.querySelector('.status-card__label').textContent = t('currentPrice');
    document.querySelector('#last-update').textContent = t('lastUpdate') + ': --';
    document.querySelector('#next-update').textContent = t('nextUpdate') + ': --';
    document.querySelector('.chart-card .section-title').textContent = t('priceTrend');
    document.querySelector('.chart-legend__item:nth-child(1) span:last-child').textContent = t('convenient');
    document.querySelector('.chart-legend__item:nth-child(2) span:last-child').textContent = t('normal');
    document.querySelector('.chart-legend__item:nth-child(3) span:last-child').textContent = t('avoid');
    document.querySelector('.table-card .section-title').textContent = t('hourlyDetail');
    document.querySelector('.history-card .section-title').textContent = t('historyTitle');
    document.querySelector('.smart-card .section-title').textContent = t('smartTitle');
    const compareLabels = document.querySelectorAll('.status-card__compare span:first-child');
    if (compareLabels[0]) compareLabels[0].textContent = t('yesterdayLabel');
    if (compareLabels[1]) compareLabels[1].textContent = t('todayLabel');
}
