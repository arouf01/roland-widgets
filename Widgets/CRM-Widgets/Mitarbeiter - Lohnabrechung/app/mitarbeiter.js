// Import js files
import * as utils from "./utils.js";

const createMitarbeiterTable = (mitarbeiterData) => {
  let {
    Vorname,
    Nachname,
    Strasse_Hausnummer,
    PLZ,
    Ort,
    Lohn_f_r_Vertrag,
    Bonus_Bemerkung,
    Bonus,
    AHV,
    ALV,
    NBU,
    BVG,
    KTG,
    Kinderzulage,
    Spesen,
    Sonstiges,
    IBAN_f_r_Auszahlungen,
  } = mitarbeiterData;

  // Calculation Start
  let LohnfrVertrag = Lohn_f_r_Vertrag || 0.0;
  let BRUTTOLOHNI = Lohn_f_r_Vertrag + Bonus || 0.0;
  let BRUTTOLOHNII = BRUTTOLOHNI;
  /*
  let BRUTTOLOHNII = parseFloat(
    BRUTTOLOHNI - (Math.abs(sumStorno) + Math.abs(StornoEffektiv)) || 0.0
  ).toFixed(2);
*/

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

  // Calculation End

  // Insert into the DOM
  document.getElementById("abrechnungContainer").innerHTML = `
      <section class="mb-6">
        <p class="mb-1 font-semibold">${Vorname} ${Nachname}</p>
        <p class="mb-1">${Strasse_Hausnummer}</p>
        <p class="mb-1">${PLZ} ${Ort}</p>
        <p class="text-right">Cham, ${utils.getFullDateTime()}</p>
      </section>

      <h2 class="text-xl font-bold mb-4 border-b pb-1">Lohnabrechung ${utils.getMothYear()}</h2>

      <table class="w-full mb-6 border border-collapse border-gray-300">
        <tbody>
          <tr class="border-b">
            <td class="py-1 px-4">Bezeichnung</td>
            <td class="py-1 px-4 text-right">%</td>
            <td class="py-1 px-4 text-right">Ansatz</td>
            <td class="py-1 px-4 text-right">Betrag</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">Total gemäss gearbeitete Stunden</td>
            <td></td><td></td>
            <td class="text-right px-4">${LohnfrVertrag.toFixed(2)}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-4">+ Bonus ${Bonus_Bemerkung || " "}</td>
            <td></td><td></td>
            <td class="text-right px-4"> ${parseFloat(Bonus || 0.0).toFixed(
              2
            )}</td>
          </tr>
          <tr class="border-b font-semibold">
            <td class="py-1 px-4">BRUTTOLOHN I</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(
              BRUTTOLOHNI || 0.0
            ).toFixed(2)}</td>
          </tr>
          
          <tr class="border-b font-semibold">
            <td class="py-1 px-4">BRUTTOLOHN II (AHV-Lohn)</td>
            <td></td><td></td>
            <td class="text-right px-4">${parseFloat(
              BRUTTOLOHNII || 0.0
            ).toFixed(2)}</td>
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
      </div>
    `;
};

export { createMitarbeiterTable };
