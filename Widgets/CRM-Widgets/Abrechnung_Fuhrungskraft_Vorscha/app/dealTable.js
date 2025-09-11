// Import js files
import * as utils from "./utils.js";

// Default Value
let sumPunkte = 0;
let sumStorno = 0;
let sumProvision = 0;
const createDealTable = (allDealData) => {
  let tBody = document.getElementById("dynamicTableBody");

  if (allDealData.length == 0) return;

  for (let deal of allDealData) {
    let {
      Contact_Name,
      Gesellschaft,
      Mitarbeiter,
      Tippgeber,
      Closing_Date,
      Punktewert_Kalk,
      Stornowert_in_CHF_FK,
      F_hrungsstufe_FK,
      F_hrungskraft,
      Punktestufe,
      Stornowert_in_CHF,
      Provision_inkl_Storno_FK,
      Provision_inkl_Storno,
    } = deal;
    // console.log(deal);

    // Fallbacks and formatting
    let getFhrungskraft = F_hrungskraft?.name || " ";
    let kontakt = Contact_Name?.name || " ";
    let gesellschaft = Gesellschaft?.name || " ";
    let abschluss = utils.formatDate(Closing_Date) || " ";
    let getMitarbeiter = Mitarbeiter?.name || " ";
    let getTippgeber = Tippgeber?.name || " ";
    let chfPunkt = 0;
    let getPunktestufe = parseFloat(F_hrungsstufe_FK || 0);
    let storno = parseFloat(Stornowert_in_CHF_FK || 0);
    let provision = parseFloat(Provision_inkl_Storno_FK || 0);

    // Check and validate if Fuhrungskraft and Mitarbeiter name is same and Provision_inkl_Storno_FK value is 0
    if (getFhrungskraft == getMitarbeiter) {
      getMitarbeiter = " ";
      chfPunkt = parseFloat(Punktewert_Kalk || 0);
      getPunktestufe = parseFloat(Punktestufe || 0);
      storno = parseFloat(Stornowert_in_CHF || 0);
      provision = parseFloat(Provision_inkl_Storno || 0);
    }

    // Append table row
    let row = document.createElement("tr");
    row.style.height = "40px";

    row.innerHTML = `
  <td class="border px-2 py-1 break-words text-left align-middle">${kontakt}</td>
  <td class="border px-2 py-1 break-words text-left align-middle">${gesellschaft}</td>
  <td class="border px-2 py-1 break-words text-left align-middle">${abschluss}</td>
  <td class="border px-2 py-1 break-words text-left align-middle">${getMitarbeiter}</td>
  <td class="border px-2 py-1 break-words text-left align-middle">${getTippgeber}</td>
  <td class="border px-4 py-1 break-words text-right align-middle">${chfPunkt.toFixed(
    2
  )}</td>
  <td class="border px-4 py-1 break-words text-right align-middle">${getPunktestufe.toFixed(
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
    sumPunkte += chfPunkt;
    sumStorno += storno;
    sumProvision += provision;
    /*
    // Add to totals
    sumPunkte += chfPunkt;
    if (storno == " " && getPunktestufe == " " && provision == " ") {
      sumStorno += 0;
      sumProvision += 0;
    } else {
      sumStorno += storno;
      sumProvision += provision;
    }
      */
  }

  // Update footer totals
  document.getElementById("sumPunkte").textContent = sumPunkte.toFixed(2);
  document.getElementById("sumStorno").textContent = sumStorno.toFixed(2);
  document.getElementById("sumProvision").textContent = sumProvision.toFixed(2);
};

export { createDealTable };
