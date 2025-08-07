// Import js files
import * as utils from "./utils.js";

const createTippgeberTable = (tippgeberData) => {
  // get the sum of Total Provision and sumStorno
  let sumProvision =
    parseFloat(document.getElementById("sumProvision").textContent) || 0;
  let sumStorno =
    parseFloat(document.getElementById("sumStorno").textContent) || 0;
  let sumPunkte =
    parseFloat(document.getElementById("sumPunkte").textContent) || 0;

  let {
    Vorname,
    Nachname,
    Strasse_Hausnummer,
    PLZ,
    Ort,
    Bonus_Bemerkung,
    Bonus,
    Storno_in,
    Storno_effektiv_Tippgeber,
    AHV,
    ALV,
    NBU,
    BVG,
    KTG,
    Kinderzulage,
    Spesen,
    Sonstiges,
    IBAN_f_r_Auszahlungen,
    Total_Stornokonto,
    Total_Punkte,
    Differenz_zur_n_chsten_Stufe,
    N_chste_St_fe,
  } = tippgeberData;

  // Calculation Start
  let BRUTTOLOHNI = sumProvision + Bonus;
  let StornoEffektiv =
    utils.getStornoEffektiv(Storno_effektiv_Tippgeber) || 0.0;
  // let BRUTTOLOHNII = parseFloat(
  //   BRUTTOLOHNI - (Math.abs(sumStorno) + Math.abs(StornoEffektiv)) || 0.0
  // ).toFixed(2);

  let BRUTTOLOHNII = BRUTTOLOHNI;

  let AHVPercentage = 0.0;
  let ALVPercentage = 0.0;
  let NBUPercentage = 0.0;
  let KTGPercentage = 0.0;
  let getBVG = 0.0;
  let TOTALAbzüge = 0.0;

  if (BRUTTOLOHNII >= 0) {
    AHVPercentage = utils.CalculatePercentage(BRUTTOLOHNII, AHV);
    ALVPercentage = utils.CalculatePercentage(BRUTTOLOHNII, ALV);
    NBUPercentage = utils.CalculatePercentage(BRUTTOLOHNII, NBU);
    KTGPercentage = utils.CalculatePercentage(BRUTTOLOHNII, KTG);
    getBVG = BVG;
    TOTALAbzüge =
      (
        Math.abs(AHVPercentage) +
        Math.abs(ALVPercentage) +
        Math.abs(NBUPercentage) +
        Math.abs(BVG) +
        Math.abs(KTGPercentage)
      ).toFixed(2) || 0.0;
  }
  let NETTOLOHNI = (BRUTTOLOHNII - Math.abs(TOTALAbzüge)).toFixed(2) || 0.0;

  // Total NETTOLOHN II
  let TotalNETTOLOHNII =
    parseFloat(Kinderzulage || 0) +
    parseFloat(Spesen || 0) +
    parseFloat(Sonstiges || 0);
  let NETTOLOHNII = parseFloat(NETTOLOHNI || 0) + TotalNETTOLOHNII;

  let SaldoStornokontoNeu = Total_Stornokonto + sumStorno || 0.0;

  let PunkteSaldoNeu = parseFloat((sumPunkte + Total_Punkte).toFixed(2)) || 0.0;

  // Calculation End

  // Insert into the DOM
  document.getElementById("abrechnungContainer").innerHTML = `
      <section class="mb-6">
        <p class="mb-1 font-semibold">${Vorname} ${Nachname}</p>
        <p class="mb-1">${Strasse_Hausnummer}</p>
        <p class="mb-1">${PLZ} ${Ort}</p>
        <p class="text-right">Cham, ${utils.getFullDateTime()}</p>
      </section>

      <h2 class="text-xl font-bold mb-4 border-b pb-1">Abrechnung ${utils.getMothYear()}</h2>

      <table class="w-full mb-6 border border-collapse border-gray-300">
        <tbody>
          <tr class="border-b">
            <td class="py-1 px-4">Bezeichnung</td>
            <td class="py-1 px-4 text-right">%</td>
            <td class="py-1 px-4 text-right">Ansatz</td>
            <td class="py-1 px-4 text-right">Betrag</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">Total gemäss Umsatzliste</td>
            <td></td><td></td>
            <td class="text-right px-4">${sumProvision.toFixed(2) || 0.0}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">+ Bonus ${Bonus_Bemerkung || " "}</td>
            <td></td><td></td>
            <td class="text-right px-4"> ${parseFloat(Bonus || 0.0).toFixed(
              2
            )}</td>
          </tr>
          <tr class="border-b font-semibold">
            <td class="py-1 px-4">BRUTTOLOHN I (gemäss Umsatzliste)</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(
              BRUTTOLOHNI || 0.0
            ).toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. Stornoreserve</td>
            <td class="text-right px-4">${Storno_in}%</td>
            <td></td>
            <td class="text-right px-4"> - ${parseFloat(
              sumStorno || 0.0
            ).toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. Storno effektiv</td>
            <td></td><td></td>
            <td class="text-right px-4 text-red-500"> - ${StornoEffektiv.toFixed(
              2
            )}</td>
          </tr>
          <tr class="border-b font-semibold">
            <td class="py-1 px-4">BRUTTOLOHN II (AHV-Lohn)</td>
            <td></td><td></td>
            <td class="text-right px-4">${BRUTTOLOHNII}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. AHV</td>
            <td class="text-right px-4">${AHV}%</td>
            <td class="text-right px-4">${BRUTTOLOHNII}</td>
            <td class="text-right px-4"> - ${AHVPercentage.toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. ALV</td>
            <td class="text-right px-4">${ALV}%</td>
            <td class="text-right px-4">${BRUTTOLOHNII}</td>
            <td class="text-right px-4"> - ${ALVPercentage.toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. NBU</td>
            <td class="text-right px-4">${NBU}%</td>
            <td class="text-right px-4">${BRUTTOLOHNII}</td>
            <td class="text-right px-4"> - ${NBUPercentage.toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. BVG</td>
            <td class="text-right px-4"></td>
            <td class="text-right px-4"></td>
            <td class="text-right px-4"> - ${getBVG.toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">./. KTG</td>
            <td class="text-right px-4">${KTG}%</td>
            <td class="text-right px-4">${BRUTTOLOHNII}</td>
            <td class="text-right px-4"> - ${KTGPercentage.toFixed(2)}</td>
          </tr>
          <tr class="border-b font-semibold">
            <td class="py-1 px-4">TOTAL Abzüge</td>
            <td></td><td></td>
            <td class="text-right px-4"> - ${parseFloat(TOTALAbzüge).toFixed(
              2
            )}</td>
          </tr>
          <tr class="border-b font-semibold">
            <td class="py-1 px-4">NETTOLOHN I</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(NETTOLOHNI).toFixed(
              2
            )}</td>
          </tr>
          <tr>
            <td class="py-1 px-4">+ Kinderzulage</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(
              Kinderzulage || 0.0
            ).toFixed(2)}</td>
          </tr>
          <tr>
            <td class="py-1 px-4"> + Spesen</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(Spesen || 0.0).toFixed(
              2
            )}</td>
          </tr>
          <tr>
            <td class="py-1 px-4">./. Sonstiges</td>
            <td></td><td></td>
            <td class="text-right px-4">${(
              parseFloat(Sonstiges) || 0.0
            ).toFixed(2)}</td>
          </tr>
          <tr class="font-semibold">
            <td class="py-1 px-4">NETTOLOHN II</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(NETTOLOHNII).toFixed(
              2
            )}</td>
          </tr>
        </tbody>
      </table>

    <div class="grid grid-cols-2 gap-y-1 gap-x-16 justify-items-start text-sm w-fit">

      <div>Auszahlung auf folgendes Konto:</div>
      <div class="text-right font-semibold">${
        IBAN_f_r_Auszahlungen || " "
      }</div>

      <div>Storno diesen Monat:</div>
      <div class="text-right font-semibold">${parseFloat(sumStorno).toFixed(
        2
      )}</div>

      <div>Saldo Stornokonto alt:</div>
      <div class="text-right font-semibold">${parseFloat(
        Total_Stornokonto
      ).toFixed(2)}</div>

      <div>Saldo Stornokonto neu:</div>
      <div class="text-right font-semibold">${parseFloat(
        SaldoStornokontoNeu
      ).toFixed(2)}</div>

      <div>Punkte diesen Monat:</div>
      <div class="text-right font-semibold">${parseFloat(
        sumPunkte || 0.0
      ).toFixed(2)}</div>

      <div>Punkte Saldo alt:</div>
      <div class="text-right font-semibold">${parseFloat(Total_Punkte).toFixed(
        2
      )}</div>

      <div>Punkte Saldo neu:</div>
      <div class="text-right text-red-500 font-semibold">${PunkteSaldoNeu}</div>

      <div>Diff. zur nächsten Stufe:</div>
      <div class="text-right font-semibold">
        ${parseFloat(Differenz_zur_n_chsten_Stufe || 0.0).toFixed(2)}
        (${N_chste_St_fe || " "})
      </div>
    </div>

      </div>
    `;
};

export { createTippgeberTable };
