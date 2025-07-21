// Import js files
import * as utils from "./utils.js";

// Default Value
let sumPunkte = 0;
let sumStorno = 0;
let sumProvision = 0;
const createDealTable = (allDealData) => {
  let tBody = document.getElementById("dynamicTableBody");

  allDealData.forEach((deal) => {
    let {
      Contact_Name,
      Gesellschaft,
      Closing_Date,
      Punktewert_Kalk,
      Stornowert_in_CHF_TG,
      Provision_ausbezahlt_TG,
    } = deal;

    // Fallbacks and formatting
    let kontakt = Contact_Name?.name || " ";
    let gesellschaft = Gesellschaft?.name || " ";
    let abschluss = utils.formatDate(Closing_Date) || " ";
    let chfPunkt = parseFloat(Punktewert_Kalk || 0);
    let storno = parseFloat(Stornowert_in_CHF_TG || 0);
    let provision = parseFloat(Provision_ausbezahlt_TG || 0);

    // Append table row
    let row = document.createElement("tr");
    row.innerHTML = `
    <td class="border px-2 py-1 break-words text-left align-middle">${kontakt}</td>

    <td class="border px-2 py-1 break-words text-left align-middle">${gesellschaft}</td>

    <td class="border px-2 py-1 break-words text-left align-middle">${abschluss}</td>

    <td class="border px-4 py-1 break-words text-right align-middle">${chfPunkt.toFixed(
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
