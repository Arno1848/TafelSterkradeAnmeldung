// Geburtstage.js 19.10.2025

//---------------------------------------------------------------------------------------------
function filterGeburtstageByTageVoraus(alleGeburtstage, tageVoraus) {
 //---------------------------------------------------------------------------------------------
/**
 * Filtert die Liste aller Geburtstage auf diejenigen, die in den nächsten tageVoraus Tagen anstehen.
 * @param {Array<Object>} alleGeburtstage Die ungefilterte Liste aller Helfer-Geburtstage.
 * @param {number} tageVoraus Die Anzahl der Tage, die in die Zukunft geblickt werden soll.
 * @returns {Array<Object>} Die gefilterte und nach Datum sortierte Liste.
 */
   const heute = new Date();
    // Setze die Uhrzeit auf 00:00:00, um Rundungsfehler zu vermeiden
    heute.setHours(0, 0, 0, 0); 

    const gefilterteListe = [];

    alleGeburtstage.forEach(eintrag => {
        // Geburtsdatum aus dem String holen (ohne Jahr)
        const parts = eintrag.GeburtsmonatTag.split('.'); // Erwartet tt.mm.

        // Datum für das aktuelle Jahr erstellen
        let geburtstagDiesesJahr = new Date(heute.getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[0]));
        
        // Wenn das Datum ungültig ist, überspringen
        if (isNaN(geburtstagDiesesJahr.getTime())) return;
        
        // Wenn der Geburtstag dieses Jahr schon vorbei ist, nimm das nächste Jahr
        // (Berücksichtigt auch den heutigen Tag)
        if (geburtstagDiesesJahr < heute && (geburtstagDiesesJahr.getDate() !== heute.getDate() || geburtstagDiesesJahr.getMonth() !== heute.getMonth())) {
            geburtstagDiesesJahr.setFullYear(heute.getFullYear() + 1);
        }
        
        // Berechne die Differenz in Tagen (Aufrunden auf den nächsten vollen Tag)
        const msInDay = 1000 * 60 * 60 * 24;
        const differenzTage = Math.ceil((geburtstagDiesesJahr - heute) / msInDay);

        // Filter anwenden: Muss heute oder in den nächsten 'tageVoraus' Tagen sein
        if (differenzTage >= 0 && differenzTage <= tageVoraus) {
            
            // Formatierung (optional: nur Tag und Monat)
            const formatierterGeburtstag = eintrag.GeburtsmonatTag.slice(0, 5); // tt.mm.
            
            gefilterteListe.push({
                Name: eintrag.Name,
                Geburtstag: formatierterGeburtstag, // tt.mm.
                _sortDatum: geburtstagDiesesJahr // Zum Sortieren
            });
        }
    });

    // Nach Datum sortieren
    gefilterteListe.sort((a, b) => a._sortDatum - b._sortDatum);
    
    // Das temporäre Sortierfeld entfernen und nur Name/Geburtstag zurückgeben
    return gefilterteListe.map(({ Name, Geburtstag }) => ({ Name, Geburtstag }));
}

//-----------------------------------------------
// Wird bei Änderung des Inputfeldes oder Klick auf die Buttons aufgerufen
function changeWochenvoraus(newValue) {
//-----------------------------------------------
    // Stelle sicher, dass der Wert ein Integer ist (von den Buttons kommt ein berechneter Wert)
    const newWochen = parseInt(newValue);
    
    // Die gültigen Grenzen
    const MIN_WOCHEN = 1;
    const MAX_WOCHEN = 52; 
    
    let finalWochen;

    // 1. Validierung (zwischen 1 und 52 Wochen)
    if (isNaN(newWochen) || newWochen < MIN_WOCHEN) {
        finalWochen = MIN_WOCHEN;
    } else if (newWochen > MAX_WOCHEN) {
        finalWochen = MAX_WOCHEN;
    } else {
        finalWochen = newWochen;
    }
    
    // Nur aktualisieren, wenn sich der Wert ändert
    if (GeburtsdatumWochenvoraus !== finalWochen) {
        // 2. Globale Variable aktualisieren
        GeburtsdatumWochenvoraus = finalWochen;
        
        // 3. Input-Feld und Ansicht neu rendern
        document.getElementById("wochen-input").value = finalWochen;
        updateGeburtstageView();
    }
}

//-----------------------------------------------
function geburtstageOeffnen() {
//-----------------------------------------------
    const titel = "Geburtstage";
    
    // 1. Inputfeld mit dem aktuellen Wert initialisieren
    const wochenInput = document.getElementById("wochen-input");
    if (wochenInput) {
        // Setzt den aktuellen Wert der globalen Variable in das Inputfeld
        wochenInput.value = GeburtsdatumWochenvoraus; 
    }
    
    // 2. Ansicht initialisieren und filtern
    updateGeburtstageView();

    // 3. Overlay anzeigen
    document.getElementById("overlayGeburtstage").style.display = "flex";
}

//-----------------------------------------------
function updateGeburtstageView() {
//-----------------------------------------------
    const titel = "Geburtstage";
    // Umrechnung der Wochen in Tage
    const GeburtsdatumTagevoraus = GeburtsdatumWochenvoraus * 7;
    
    // 1. Daten filtern
    const gefilterteDaten = filterGeburtstageByTageVoraus(alleGeburtstageCache, GeburtsdatumTagevoraus);

    // 2. Zeitraum und Enddatum anzeigen
    updateGeburtstageZeitraum(GeburtsdatumTagevoraus);

    // 3. Liste rendern
    showOverlayGeburtstage(titel, gefilterteDaten);
}


//-----------------------------------------------
// Logik von showOverlayGeburtstage leicht angepasst
function showOverlayGeburtstage(titel, geburtstageArray) {
//-----------------------------------------------
    document.getElementById("overlayGeburtstage-title").textContent = titel;
// console.log("showOverlayGeburtstage:", geburtstageArray.length);

    const geburtstageTitle = document.getElementById("scrollboxGeburtstage-title");
    geburtstageTitle.textContent = `anstehende Geburtstage: ${geburtstageArray.length}`;

    const geburtstageTable = document.getElementById("scrollboxGeburtstage-table");
    geburtstageTable.innerHTML = "";

    geburtstageArray.forEach(eintrag => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${eintrag.Name}</td><td>${eintrag.Geburtstag}</td>`;
        geburtstageTable.appendChild(row);
    });
    // WICHTIG: Die Zeile document.getElementById("overlayGeburtstage").style.display = "flex";
    // wurde aus dieser Funktion entfernt, um sie wiederverwendbar zu machen. 
    // Sie ist jetzt nur noch in geburtstageOeffnen enthalten.
}


//-----------------------------------------------------------------------------
function updateGeburtstageZeitraum(GeburtsdatumTagevoraus) {
//-----------------------------------------------------------------------------

    const heute = new Date();
    // Kopie des heutigen Datums erstellen, um es zu modifizieren
    const datumBis = new Date(heute.getTime()); 
    
    // Fügt die Tage hinzu
    datumBis.setDate(heute.getDate() + GeburtsdatumTagevoraus);
    
    // Formatierung (tt.mm.jjjj)
    const tag = String(datumBis.getDate()).padStart(2, '0');
    const monat = String(datumBis.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const jahr = datumBis.getFullYear();
    const datumBisFormatiert = `${tag}.${monat}.${jahr}`;
    
    // Text zusammenbauen
    const bisdatumText = `Geburtstage bis ${datumBisFormatiert}`;
    
    // Im Overlay anzeigen
    // Hinweis: Da der Zeitraum (X Wochen) nun im Input-Feld steht, 
    // zeigen wir in den <p>-Elementen nur noch das errechnete Enddatum an.
    //    document.getElementById("geburtstage-zeitraum").textContent = ""; // Wird nicht mehr benötigt
    document.getElementById("geburtstage-bisdatum").textContent = bisdatumText; 
}

//---------------------------------------------------------------------------------------------
function closeOverlayGeburtstage() {
//---------------------------------------------------------------------------------------------
    document.getElementById("overlayGeburtstage").style.display = "none";
}

