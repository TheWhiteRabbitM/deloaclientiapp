const LANGUAGES = {
    it: {
        pageTitle: 'Deloa Energy - Prezzi Orari',
        currentPrice: 'Prezzo attuale',
        lastUpdate: 'Ultimo',
        nextUpdate: 'Prossimo',
        cheapest: 'Più economica',
        mostExpensive: 'Più costosa',
        upcomingChanges: 'Prossimi cambiamenti',
        priceRising: 'Il prezzo sale',
        priceFalling: 'Il prezzo scende',
        priceTrend: 'Andamento Prezzi Oggi',
        convenient: 'Conviene',
        normal: 'Normale',
        avoid: 'Evita',
        hourlyDetail: 'Dettaglio Orario',
        historyTitle: 'Storico Prezzi',
        noHistory: 'I dati storici appariranno dopo il primo aggiornamento giornaliero',
        compareTitle: 'Confronto con ieri',
        today: 'Oggi',
        yesterday: 'Ieri stessa ora',
        saving: 'Risparmi',
        moreExpensive: 'Costa',
        more: 'in più',
        respectYesterday: 'rispetto a ieri',
        samePrice: 'Stesso prezzo di ieri',
        noDataYesterday: 'Dati non disponibili per ieri',
        dataAvailableTomorrow: 'Dati disponibili dal prossimo aggiornamento',
        firstLoad: 'Primo caricamento, dati disponibili domani',
        tipsTitle: 'Quando usare cosa',
        washer: 'Lavatrice / Asciugatrice',
        washerDesc: 'Nelle ore verdi',
        ev: 'Ricarica auto elettrica',
        evDesc: 'Notte o primo pomeriggio',
        oven: 'Forno / Piano cottura',
        ovenDesc: 'Evitare ore rosse',
        ac: 'Condizionatore',
        acDesc: 'Evitare 18-22',
        noChanges: 'Nessun cambiamento significativo previsto',
        dataUpdated: 'Dati aggiornati',
        loadError: 'Errore nel caricamento',
        noNotifSupport: 'Browser non supporta notifiche',
        notifEnabled: 'Notifiche attivate',
        notifDenied: 'Notifiche non concesse',
        notifCheap: 'Ora conveniente!',
        notifCheapBody: 'Prezzo: {price} €/kWh. Usa ora gli elettrodomestici!',
        notifExpensive: 'Ora costosa',
        notifExpensiveBody: 'Prezzo: {price} €/kWh. Evita elettrodomestici energivori.',
        min: 'min',
        avg: 'media',
        max: 'max',
        langLabel: 'Lingua',
    },
    de: {
        pageTitle: 'Deloa Energy - Stundenpreise',
        currentPrice: 'Aktueller Preis',
        lastUpdate: 'Letzte',
        nextUpdate: 'Nächste',
        cheapest: 'Am günstigsten',
        mostExpensive: 'Am teuersten',
        upcomingChanges: 'Nächste Änderungen',
        priceRising: 'Preis steigt',
        priceFalling: 'Preis fällt',
        priceTrend: 'Preisverlauf Heute',
        convenient: 'Günstig',
        normal: 'Normal',
        avoid: 'Vermeiden',
        hourlyDetail: 'Stündliche Details',
        historyTitle: 'Preisverlauf',
        noHistory: 'Historische Daten erscheinen nach dem ersten täglichen Update',
        compareTitle: 'Vergleich mit gestern',
        today: 'Heute',
        yesterday: 'Gestern gleiche Stunde',
        saving: 'Spare',
        moreExpensive: 'Kostet',
        more: 'mehr',
        respectYesterday: 'als gestern',
        samePrice: 'Gleicher Preis wie gestern',
        noDataYesterday: 'Keine Daten für gestern verfügbar',
        dataAvailableTomorrow: 'Daten ab dem nächsten Update verfügbar',
        firstLoad: 'Erstes Laden, Daten morgen verfügbar',
        tipsTitle: 'Wann was verwenden',
        washer: 'Waschmaschine / Trockner',
        washerDesc: 'In den grünen Stunden',
        ev: 'Elektroauto laden',
        evDesc: 'Nacht oder früher Nachmittag',
        oven: 'Ofen / Kochfeld',
        ovenDesc: 'Rote Stunden vermeiden',
        ac: 'Klimaanlage',
        acDesc: '18-22 Uhr vermeiden',
        noChanges: 'Keine signifikanten Änderungen erwartet',
        dataUpdated: 'Daten aktualisiert',
        loadError: 'Fehler beim Laden',
        noNotifSupport: 'Browser unterstützt keine Benachrichtigungen',
        notifEnabled: 'Benachrichtigungen aktiviert',
        notifDenied: 'Benachrichtigungen abgelehnt',
        notifCheap: 'Günstige Stunde!',
        notifCheapBody: 'Preis: {price} €/kWh. Jetzt Geräte benutzen!',
        notifExpensive: 'Teure Stunde',
        notifExpensiveBody: 'Preis: {price} €/kWh. Energieintensive Geräte vermeiden.',
        min: 'min',
        avg: 'durchschn.',
        max: 'max',
        langLabel: 'Sprache',
    },
    en: {
        pageTitle: 'Deloa Energy - Hourly Prices',
        currentPrice: 'Current price',
        lastUpdate: 'Last',
        nextUpdate: 'Next',
        cheapest: 'Cheapest',
        mostExpensive: 'Most expensive',
        upcomingChanges: 'Upcoming changes',
        priceRising: 'Price rising',
        priceFalling: 'Price falling',
        priceTrend: 'Today\'s Price Trend',
        convenient: 'Good deal',
        normal: 'Normal',
        avoid: 'Avoid',
        hourlyDetail: 'Hourly Details',
        historyTitle: 'Price History',
        noHistory: 'Historical data will appear after the first daily update',
        compareTitle: 'Comparison with yesterday',
        today: 'Today',
        yesterday: 'Yesterday same hour',
        saving: 'Saving',
        moreExpensive: 'Costs',
        more: 'more',
        respectYesterday: 'than yesterday',
        samePrice: 'Same price as yesterday',
        noDataYesterday: 'No data available for yesterday',
        dataAvailableTomorrow: 'Data available from next update',
        firstLoad: 'First load, data available tomorrow',
        tipsTitle: 'When to use what',
        washer: 'Washer / Dryer',
        washerDesc: 'During green hours',
        ev: 'EV charging',
        evDesc: 'Night or early afternoon',
        oven: 'Oven / Cooktop',
        ovenDesc: 'Avoid red hours',
        ac: 'Air conditioner',
        acDesc: 'Avoid 18-22',
        noChanges: 'No significant changes expected',
        dataUpdated: 'Data updated',
        loadError: 'Loading error',
        noNotifSupport: 'Browser does not support notifications',
        notifEnabled: 'Notifications enabled',
        notifDenied: 'Notifications denied',
        notifCheap: 'Cheap hour!',
        notifCheapBody: 'Price: {price} €/kWh. Use appliances now!',
        notifExpensive: 'Expensive hour',
        notifExpensiveBody: 'Price: {price} €/kWh. Avoid energy-intensive appliances.',
        min: 'min',
        avg: 'avg',
        max: 'max',
        langLabel: 'Language',
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

function t(key) {
    return LANGUAGES[currentLang]?.[key] || LANGUAGES.it[key] || key;
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
    document.querySelector('#best-hour-card .highlight-card__label').textContent = t('cheapest');
    document.querySelector('#worst-hour-card .highlight-card__label').textContent = t('mostExpensive');
    document.querySelector('.timeline-card .section-title').textContent = t('upcomingChanges');
    document.querySelector('.chart-card .section-title').textContent = t('priceTrend');
    document.querySelector('.chart-legend__item:nth-child(1) span:last-child').textContent = t('convenient');
    document.querySelector('.chart-legend__item:nth-child(2) span:last-child').textContent = t('normal');
    document.querySelector('.chart-legend__item:nth-child(3) span:last-child').textContent = t('avoid');
    document.querySelector('.history-card .section-title').textContent = t('historyTitle');
    document.querySelector('.table-card .section-title').textContent = t('hourlyDetail');
    document.querySelector('.tips-card .section-title').textContent = t('tipsTitle');
    document.querySelector('.compare-card .section-title').textContent = t('compareTitle');
    document.querySelector('#compare-today .compare-item__label').textContent = t('today');
    document.querySelector('#compare-yesterday .compare-item__label').textContent = t('yesterday');
    document.querySelector('.tip-item:nth-child(1) .tip-item__title').textContent = t('washer');
    document.querySelector('.tip-item:nth-child(1) .tip-item__desc').textContent = t('washerDesc');
    document.querySelector('.tip-item:nth-child(2) .tip-item__title').textContent = t('ev');
    document.querySelector('.tip-item:nth-child(2) .tip-item__desc').textContent = t('evDesc');
    document.querySelector('.tip-item:nth-child(3) .tip-item__title').textContent = t('oven');
    document.querySelector('.tip-item:nth-child(3) .tip-item__desc').textContent = t('ovenDesc');
    document.querySelector('.tip-item:nth-child(4) .tip-item__title').textContent = t('ac');
    document.querySelector('.tip-item:nth-child(4) .tip-item__desc').textContent = t('acDesc');
}
