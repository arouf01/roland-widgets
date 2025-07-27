// Import js files
import * as stornoEffektiv from "./stornoEffektiv.js";

// Start Code
const createMitarbeiterTable = (data) => {
  // Get Data From Mitarbeiter
  let {
    Name,
    Vorname,
    Nachname,
    Strasse_Hausnummer,
    PLZ,
    Ort,
    Stornotext_in_der_bersicht,
  } = data;

  // Insert into the DOM
  document.getElementById("mitarbeiterStornomeldungContainer").innerHTML = `
      <section class="mb-6">
        <p class="mb-1 font-semibold">${Vorname} ${Nachname}</p>
        <p class="mb-1">${Strasse_Hausnummer}</p>
        <p class="mb-1">${PLZ} ${Ort}</p>
      </section>
    `;

  // Get Data Form Mitarbeiter Storno_effektiv
  if (data?.Storno_effektiv) {
    stornoEffektiv.getSornowert(data?.Storno_effektiv, Name);
  }

  // Input Stornotext Content
  document.getElementById("Stornotext").textContent =
    Stornotext_in_der_bersicht || " ";
};
export { createMitarbeiterTable };
