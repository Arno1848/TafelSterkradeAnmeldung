// Start.js 11.06.2025

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyoGKR58bdWuOmPyKYjCJKL33g-EGz1HLoFXuBZmaQccsbo_NHjU691n0Xu_h-DiU8tGA/exec";

//---------------------------------------------------------------------------------------------
function apiCall(action, payload) {
//---------------------------------------------------------------------------------------------
  return new Promise((resolve, reject) => {
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Wenn der Server einen Fehler zurückgibt, wird er hier als Promise-Fehler behandelt
      if (data && data.error) {
        reject(new Error(data.error));
      } else {
        resolve(data);
      }
    })
    .catch(error => {
      console.error("API-Anfrage fehlgeschlagen:", error);
      reject(error);
    });
  });
}


  let TESTVERSION = false; // Standardwert
  
apiCall('getTestversion')
  .then(versionFlag => {
    TESTVERSION = versionFlag;
    if (TESTVERSION) {
      const versionDivs = document.querySelectorAll('.version');
      versionDivs.forEach(div => {
        div.innerHTML += ' <span style="color:red;">(Testversion)</span>';
      });
    }
  })
  .catch(error => {
    console.error("Fehler beim Laden der Testversion:", error);
  });


  //-----------------------------
    function showSection(sectionId) {
  //-----------------------------
      // JavaScript-Funktion zum Umschalten der Ansicht
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('formular-section').classList.add('hidden');
        document.getElementById(sectionId).classList.remove('hidden');
      }

      // Initialer Zustand beim Laden der App
      //document.addEventListener('DOMContentLoaded', () => {
      //  showSection('login-section'); // Standardmäßig den Login-Bereich anzeigen
        // Initialisiere die Login-Seite
      //  initLoginPage(); // Diese Funktion wird in LoginJavaScript.html definiert
      //});

  //-----------------------------
      document.addEventListener('DOMContentLoaded', () => {
  //-----------------------------
        // Prüfe, ob ein Test-Benutzername gesetzt ist (nicht 'undefined' und nicht leer/null)
        if (typeof loggedInUsernameForTesting !== 'undefined' && loggedInUsernameForTesting) {
          // Wenn ja, überspringe den Login und gehe direkt zum Formular
          // Rufe die Funktion auf, die die Formular-Sektion anzeigt und die Daten lädt
          showFormAndLoadData(loggedInUsernameForTesting); 
        } else {
          // Wenn kein Test-Benutzername gesetzt ist, gehe den normalen Login-Weg
          showSection('login-section'); 
          initLoginPage(); 
        }
    });


    //-----------------------------
    function showFormAndLoadData(username) {
    //-----------------------------
      // Funktion, die vom Login-Skript aufgerufen wird, um zum Formular zu wechseln
      // und die Formulardaten zu laden.
        showSection('formular-section');
        initFormPage(username); // Diese Funktion wird in FormJavaScript.html definiert
    }

