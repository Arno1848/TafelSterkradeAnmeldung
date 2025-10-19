// Rapport.js 19.10.2025

//-----------------------------------------------
function tagesRapport() {
//-----------------------------------------------
  const daten = namentlicheDatenCache[aktTerminIndex];
  const titel =  "Tagesrapport für " + aktTermin ;

  showOverlayRapport(titel, daten);
  createRapport();
}

//-----------------------------------------------
function showOverlayRapport(titel, anmeldungenArray) {
//-----------------------------------------------
  document.getElementById("overlayRapport-title").textContent = titel;

// Tabelle: Anmeldungen
  const anmeldungenTitle = document.getElementById("scrollboxAnmeldungen-title");
  anmeldungenTitle.textContent = `Anmeldungen: ${anmeldungenArray.length}`;

  const anmeldungenTable = document.getElementById("scrollboxAnmeldungen-table");
  anmeldungenTable.innerHTML = "";
  anmeldungenArray.forEach(eintrag => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${eintrag.name}</td><td>${eintrag.funktion}</td>`;
    anmeldungenTable.appendChild(row);
  });

  document.getElementById("overlayRapport").style.display = "flex";
}

//-----------------------------------------------
function xxxshowOverlayRapport(titel, anmeldungenArray, geburtstageArray) {
//-----------------------------------------------
  document.getElementById("overlayRapport-title").textContent = titel;

// Tabelle: Anmeldungen
  const anmeldungenTitle = document.getElementById("scrollboxAnmeldungen-title");
  anmeldungenTitle.textContent = `Anmeldungen: ${anmeldungenArray.length}`;

  const anmeldungenTable = document.getElementById("scrollboxAnmeldungen-table");
  anmeldungenTable.innerHTML = "";
  anmeldungenArray.forEach(eintrag => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${eintrag.name}</td><td>${eintrag.funktion}</td>`;
    anmeldungenTable.appendChild(row);
  });

// Tabelle: Geburtstage
console.log("showOverlayRapport:", geburtstageArray.length);

  const geburtstageTitle = document.getElementById("scrollboxGeburtstage-title");
  geburtstageTitle.textContent = `anstehende Geburtstage: ${geburtstageArray.length}`;

  const geburtstageTable = document.getElementById("scrollboxGeburtstage-table");
  geburtstageTable.innerHTML = "";
  geburtstageArray.forEach(eintrag => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${eintrag.Name}</td><td>${eintrag.Geburtstag}</td>`;
    geburtstageTable.appendChild(row);
  });


  document.getElementById("overlayRapport").style.display = "flex";
}

//---------------------------------------------------------------------------------------------
function closeOverlayRapport() {
//---------------------------------------------------------------------------------------------
  document.getElementById("overlayRapport").style.display = "none";
}
//-----------------------------------------------
function createRapport() {
//-----------------------------------------------
  const daten = namentlicheDatenCache[aktTerminIndex];
  apiCall('updateSheetRapport', {
    termin: aktTermin,
    rapportDaten: daten,
    bevorstehendeGeburtstage: bevorstehendeGeburtstage
  })
  .then(response => {
    console.log("Rapport erfolgreich erstellt:", response);
  })
  .catch(error => {
    console.error("Fehler beim Erstellen des Rapports:", error);
  });
}

// ----------------------------------
async function downloadLinkRapport() {
// ----------------------------------
  const spinnerId = 'downloadLink_Tagesrapport'; // Die ID des Download-Status-Containers
  const sheetRapport = "Tagesrapport";
  const pdfname = "Rapport " + aktTermin + ".pdf";
  const rapportoptions = { hideGridlines: true };

console.log("downloadLinkRapport:", pdfname);

  showLoadingSpinner(spinnerId, "Download-Link wird erstellt...");

  try {
    const downloadUrl = await apiCall('exportSheetToPdfAndGetLink', {
      sheetName: sheetRapport,
      options: {file: pdfname, options: rapportoptions}
    });

    showDownloadLink(spinnerId, pdfname, downloadUrl);

  } catch (error) {
    handleApiError(error, spinnerId, "Fehler beim Erstellen des PDF-Rapports.");
  }
}

// ----------------------------------
async function sendmailXLSRapport() {
// ----------------------------------
  const spinnerId = 'sendMailXLS_Tagesrapport'; 
  const sheetName = "Tagesrapport";
  const filename = "Rapport " + aktTermin + ".xlsx";

  console.log("sendmailXLSRapport:", sheetName, filename, formUsername);

  showLoadingSpinner(spinnerId, "XLSX-Datei wird per E-Mail gesendet...");

  try {
    const result = await apiCall('exportSheetToXlsxAndSendMail', { sheetName, filename, Anmelde: formUsername });

    if (result.success) {
        document.getElementById(spinnerId).innerHTML = result.message

} else {
        handleApiError({ message: "Senden fehlgeschlagen" }, spinnerId, "XLSX-Versand konnte nicht abgeschlossen werden.");
    }
  } catch (error) {
    handleApiError(error, spinnerId, "Fehler beim Erstellen/Senden der XLSX-Datei.");
  }
}
