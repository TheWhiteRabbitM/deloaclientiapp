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
        notifRequesting: 'Richiesta permesso notifiche...',
        notifCheap: 'Ora conveniente!',
        notifCheapBody: 'Prezzo: {price} €/kWh. Usa ora gli elettrodomestici!',
        notifExpensive: 'Ora costosa',
        notifExpensiveBody: 'Prezzo: {price} €/kWh. Evita elettrodomestici energivori.',
        smartNow: 'Ora',
        smartAt: 'Alle',
        smartSaveLabel: 'Risparmi',
        smartMinNow: 'Prezzo minimo raggiunto ora',
        smartMoreExpensive: 'più cara',
        smartCheaper: 'più economica',
        smartBandContext: 'Fascia {band} ({bandPrice} €/kWh) — {pct}% {dir} del minimo odierno ({minPrice} €/kWh alle {minHour})',
        app_washer: 'Lavatrice',
        app_dishwasher: 'Lavastoviglie',
        app_dryer: 'Asciugatrice',
        app_washer_dryer: 'Lavasciuga',
        app_oven: 'Forno elettrico',
        app_oven_small: 'Fornetto',
        app_microwave: 'Microonde',
        app_cooktop: 'Piano induzione',
        app_kettle: 'Bollitore',
        app_ev: 'Ricarica EV',
        app_ev_fast: 'Ricarica EV veloce',
        app_ac: 'Climatizzatore',
        app_heat_pump: 'Pompa di calore',
        app_boiler: 'Scaldabagno',
        app_iron: 'Ferro da stiro',
        app_vacuum: 'Aspirapolvere',
        app_coffee: 'Macchina caffè',
        bestHoursTitle: 'Quando conviene oggi',
        bestGood: 'Conviene',
        bestAvoid: 'Da evitare',
        levelLow: 'BASSO',
        levelMid: 'MEDIO',
        levelHigh: 'ALTO',
        shareLabel: 'Condividi',
        shareCopied: 'Copiato negli appunti',
        shareText: 'Deloa Energy ⚡ Prezzo alle {hour}: {price} €/kWh. Conviene oggi: {best}.',
        notifSettingsTitle: 'Soglie notifiche',
        notifCheapLabel: 'Avvisa quando conveniente',
        notifExpLabel: 'Avvisa quando costoso',
        notifSettingsHint: 'Percentuale rispetto al prezzo medio del giorno: sotto la prima soglia ricevi un avviso "conveniente", sopra la seconda un avviso "costoso".',
        settingsSaved: 'Impostazioni salvate',
        offlineMsg: 'Sei offline — dati salvati',
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
        notifRequesting: 'Berechtigung wird angefragt...',
        notifCheap: 'Günstige Stunde!',
        notifCheapBody: 'Preis: {price} €/kWh. Jetzt Geräte benutzen!',
        notifExpensive: 'Teure Stunde',
        notifExpensiveBody: 'Preis: {price} €/kWh. Energieintensive Geräte vermeiden.',
        smartNow: 'Jetzt',
        smartAt: 'Um',
        smartSaveLabel: 'Du sparst',
        smartMinNow: 'Niedrigster Preis jetzt erreicht',
        smartMoreExpensive: 'teurer',
        smartCheaper: 'günstiger',
        smartBandContext: 'Zone {band} ({bandPrice} €/kWh) — {pct}% {dir} als das Tagesminimum ({minPrice} €/kWh um {minHour})',
        app_washer: 'Waschmaschine',
        app_dishwasher: 'Geschirrspüler',
        app_dryer: 'Trockner',
        app_washer_dryer: 'Waschtrockner',
        app_oven: 'Backofen',
        app_oven_small: 'Mini-Backofen',
        app_microwave: 'Mikrowelle',
        app_cooktop: 'Induktionskochfeld',
        app_kettle: 'Wasserkocher',
        app_ev: 'E-Auto laden',
        app_ev_fast: 'E-Auto Schnellladen',
        app_ac: 'Klimaanlage',
        app_heat_pump: 'Wärmepumpe',
        app_boiler: 'Boiler',
        app_iron: 'Bügeleisen',
        app_vacuum: 'Staubsauger',
        app_coffee: 'Kaffeemaschine',
        bestHoursTitle: 'Wann es sich heute lohnt',
        bestGood: 'Günstig',
        bestAvoid: 'Vermeiden',
        levelLow: 'NIEDRIG',
        levelMid: 'MITTEL',
        levelHigh: 'HOCH',
        shareLabel: 'Teilen',
        shareCopied: 'In die Zwischenablage kopiert',
        shareText: 'Deloa Energy ⚡ Preis um {hour}: {price} €/kWh. Günstig heute: {best}.',
        notifSettingsTitle: 'Benachrichtigungs-Schwellen',
        notifCheapLabel: 'Hinweis wenn günstig',
        notifExpLabel: 'Hinweis wenn teuer',
        notifSettingsHint: 'Prozent vom Tagesdurchschnitt: unter dem ersten Wert gibt es einen "günstig"-Hinweis, über dem zweiten einen "teuer"-Hinweis.',
        settingsSaved: 'Einstellungen gespeichert',
        offlineMsg: 'Offline — gespeicherte Daten',
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
        notifRequesting: 'Requesting notification permission...',
        notifCheap: 'Cheap hour!',
        notifCheapBody: 'Price: {price} €/kWh. Use appliances now!',
        notifExpensive: 'Expensive hour',
        notifExpensiveBody: 'Price: {price} €/kWh. Avoid energy-intensive appliances.',
        smartNow: 'Now',
        smartAt: 'At',
        smartSaveLabel: 'You save',
        smartMinNow: 'Lowest price reached now',
        smartMoreExpensive: 'more expensive',
        smartCheaper: 'cheaper',
        smartBandContext: 'Band {band} ({bandPrice} €/kWh) — {pct}% {dir} than today\'s low ({minPrice} €/kWh at {minHour})',
        app_washer: 'Washing machine',
        app_dishwasher: 'Dishwasher',
        app_dryer: 'Dryer',
        app_washer_dryer: 'Washer-dryer',
        app_oven: 'Electric oven',
        app_oven_small: 'Mini oven',
        app_microwave: 'Microwave',
        app_cooktop: 'Induction hob',
        app_kettle: 'Kettle',
        app_ev: 'EV charging',
        app_ev_fast: 'Fast EV charging',
        app_ac: 'Air conditioner',
        app_heat_pump: 'Heat pump',
        app_boiler: 'Water heater',
        app_iron: 'Iron',
        app_vacuum: 'Vacuum cleaner',
        app_coffee: 'Coffee machine',
        bestHoursTitle: 'Best times today',
        bestGood: 'Cheapest',
        bestAvoid: 'Avoid',
        levelLow: 'LOW',
        levelMid: 'MEDIUM',
        levelHigh: 'HIGH',
        shareLabel: 'Share',
        shareCopied: 'Copied to clipboard',
        shareText: 'Deloa Energy ⚡ Price at {hour}: {price} €/kWh. Cheapest today: {best}.',
        notifSettingsTitle: 'Notification thresholds',
        notifCheapLabel: 'Alert when cheap',
        notifExpLabel: 'Alert when expensive',
        notifSettingsHint: 'Percentage of the daily average price: below the first value you get a "cheap" alert, above the second an "expensive" alert.',
        settingsSaved: 'Settings saved',
        offlineMsg: 'You are offline — cached data',
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
    const bhTitle = document.querySelector('.besthours-card .section-title');
    if (bhTitle) bhTitle.textContent = t('bestHoursTitle');
    const setTitle = document.querySelector('.settings-card .section-title');
    if (setTitle) setTitle.textContent = t('notifSettingsTitle');
    const clbl = document.getElementById('thr-cheap-label');
    if (clbl) clbl.textContent = t('notifCheapLabel');
    const elbl = document.getElementById('thr-exp-label');
    if (elbl) elbl.textContent = t('notifExpLabel');
    const shint = document.getElementById('settings-hint');
    if (shint) shint.textContent = t('notifSettingsHint');
    const sbtn = document.getElementById('btn-share');
    if (sbtn) sbtn.setAttribute('aria-label', t('shareLabel'));
}
