// Import js files
import * as utils from "./utils.js";

// Default Value
let sumPunkte = 0;
let sumStorno = 0;
let sumProvision = 0;
const createDealTable = (allDealData) => {
  let tBody = document.getElementById("dynamicTableBody");

  if (allDealData.length == 0) return;

  allDealData.forEach((deal) => {
    let {
      Contact_Name,
      Gesellschaft,
      Mitarbeiter,
      Tippgeber,
      Closing_Date,
      Punktewert_Kalk,
      Stornowert_in_CHF_FK,
      Provision_ausbezahlt_FK,
      F_hrungsstufe_FK,
      F_hrungskraft,
      Provision_inkl_Storno_FK,
    } = deal;

    // Fallbacks and formatting
    let kontakt = Contact_Name?.name || " ";
    let gesellschaft = Gesellschaft?.name || " ";
    let abschluss = utils.formatDate(Closing_Date) || " ";
    let getMitarbeiter = Mitarbeiter?.name || " ";
    let getTippgeber = Tippgeber || " ";
    let chfPunkt = parseFloat(Punktewert_Kalk || 0);
    let getFhrungsstufeFK = parseFloat(F_hrungsstufe_FK || 0);
    let storno = parseFloat(Stornowert_in_CHF_FK || 0);
    let provision = parseFloat(Provision_ausbezahlt_FK || 0);

    // Check and validate if Fuhrungskraft and Mitarbeiter name is same and Provision_inkl_Storno_FK value is 0
    let getFhrungskraft = F_hrungskraft?.name || " ";
    if (getFhrungskraft == getMitarbeiter || Provision_inkl_Storno_FK == 0) {
      getMitarbeiter = " ";
      chfPunkt = 0.0;
      getFhrungsstufeFK = 0.0;
      storno = 0.0;
      provision = 0.0;
    }
    // let getMitarbeiterName =
    //   getFhrungskraft == getMitarbeiter && Provision_inkl_Storno_FK == 0
    //     ? " "
    //     : getMitarbeiter;

    // Append table row
    let row = document.createElement("tr");
    row.innerHTML = `
    <td class="border px-2 py-1 break-words text-left align-middle">${kontakt}</td>

    <td class="border px-2 py-1 break-words text-left align-middle">${gesellschaft}</td>

    <td class="border px-2 py-1 break-words text-left align-middle">${abschluss}</td>
    <td class="border px-2 py-1 break-words text-left align-middle">${getMitarbeiter}</td>
    <td class="border px-2 py-1 break-words text-left align-middle">${getTippgeber}</td>

    <td class="border px-4 py-1 break-words text-right align-middle">${chfPunkt.toFixed(
      2
    )}</td>
      <td class="border px-4 py-1 break-words text-right align-middle">${getFhrungsstufeFK.toFixed(
        2
      )}</td>

    <td class="border px-4 py-1 break-words text-right align-middle">${storno.toFixed(
      2
    )}</td>

    <td class="border px-4 py-1 break-words text-right align-middle">${provision.toFixed(
      2
    )}</td>
      
      `;
    tBody.appendChild(row);

    // Add to totals
    sumPunkte += chfPunkt;
    sumStorno += storno;
    sumProvision += provision;

    // Update footer totals
    document.getElementById("sumPunkte").textContent = sumPunkte.toFixed(2);
    document.getElementById("sumStorno").textContent = sumStorno.toFixed(2);
    document.getElementById("sumProvision").textContent =
      sumProvision.toFixed(2);
  });
};

export { createDealTable };
