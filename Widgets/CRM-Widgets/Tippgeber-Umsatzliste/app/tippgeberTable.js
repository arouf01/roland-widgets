// Import js files
import * as utils from "./utils.js";

const createTippgeberTable = (tippgeberData) => {
  let { Vorname, Nachname, Strasse_Hausnummer, PLZ, Ort } = tippgeberData;

  // Insert into the DOM
  document.getElementById("abrechnungContainer").innerHTML = `
      <section class="mb-6">
        <p class="mb-1 font-semibold">${Vorname} ${Nachname}</p>
        <p class="mb-1">${Strasse_Hausnummer}</p>
        <p class="mb-1">${PLZ} ${Ort}</p>
        <p class="text-right">Cham, ${utils.getFullDateTime()}</p>
      </section>
    `;
};

export { createTippgeberTable };
