const LANGUAGES = {
    it: {
        pageTitle: 'Deloa Energy - Prezzi Orari',
        currentPrice: 'Prezzo attuale',
        lastUpdate: 'Ultimo',
        nextUpdate: 'Prossimo',
        bandTitle: 'Fasce orarie',
        bandF1: 'F1 - Punta',
        bandF2: 'F2 - Intermedia',
        bandF3: 'F3 - Fuori punta',
        bandF1Hours: 'Lun-Ven 8-19',
        bandF2Hours: 'Lun-Ven 7-8, 19-23 + Sab 7-23',
        bandF3Hours: 'Lun-Sab 23-7 + Dom tutto il giorno',
        bandNow: 'Ora in corso',
        bandExplain: 'Confronta i prezzi orari Deloa con le fasce ARERA F1/F2/F3 usate dai fornitori tradizionali. Se la tua tariffa attuale è a fasce, questo confronto ti mostra quanto pagheresti oggi con Deloa rispetto alla media di fascia.',
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
        smartPickAppliance: 'Scegli un elettrodomestico',
        smartNoData: 'Dati insufficienti per il calcolo',
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
        bandTitle: 'Stromtarifzonen',
        bandF1: 'F1 - Spitzenzeit',
        bandF2: 'F2 - Mittelzeit',
        bandF3: 'F3 - Nebenzeit',
        bandF1Hours: 'Mo-Fr 8-19',
        bandF2Hours: 'Mo-Fr 7-8, 19-23 + Sa 7-23',
        bandF3Hours: 'Mo-Sa 23-7 + So ganzer Tag',
        bandNow: 'Aktuelle Zone',
        bandExplain: 'Vergleiche die stündlichen Deloa-Preise mit den ARERA-Zonen F1/F2/F3, die von traditionellen Anbietern verwendet werden. Falls dein aktueller Tarif nach Zonen abgerechnet wird, siehst du hier, was du heute mit Deloa im Vergleich zum Zonendurchschnitt zahlen würdest.',
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
        smartPickAppliance: 'Wähle ein Gerät',
        smartNoData: 'Unzureichende Daten für die Berechnung',
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
        bandTitle: 'Time bands',
        bandF1: 'F1 - Peak',
        bandF2: 'F2 - Intermediate',
        bandF3: 'F3 - Off-peak',
        bandF1Hours: 'Mon-Fri 8-19',
        bandF2Hours: 'Mon-Fri 7-8, 19-23 + Sat 7-23',
        bandF3Hours: 'Mon-Sat 23-7 + Sun all day',
        bandNow: 'Current band',
        bandExplain: 'Compare Deloa\'s hourly prices with ARERA bands F1/F2/F3 used by traditional suppliers. If your current plan is band-based, this shows what you\'d pay today with Deloa vs the band average.',
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
        smartPickAppliance: 'Pick an appliance',
        smartNoData: 'Insufficient data for calculation',
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
    const bandTitle = document.querySelector('.bands-card .section-title');
    if (bandTitle) bandTitle.textContent = t('bandTitle');
    const bandExplain = document.getElementById('bands-explain');
    if (bandExplain) bandExplain.textContent = t('bandExplain');
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
