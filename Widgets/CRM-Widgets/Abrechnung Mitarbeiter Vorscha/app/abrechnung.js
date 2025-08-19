import * as utils from "./utils.js";
// Load Zoho SDK
(function loadZohoSdk(callback) {
  if (typeof ZOHO === "undefined") {
    const script = document.createElement("script");
    script.src = "https://js.zohocdn.com/embeddedapp/v1.0/embeddedApp.js";
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    callback();
  }
})(() => {
  ZOHO.embeddedApp.on("PageLoad", async (data) => {
    ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" });

    // Loop for all the selected Deals
    let tbody = document.getElementById("dynamicTableBody");
    let sumPunkte = 0;
    // let sumPunkte2 = 0;
    let sumStorno = 0;
    let sumProvision = 0;

    let getSelectDeals = data?.EntityId;

    for (const dealId of getSelectDeals) {
      let getAllSelectedDeals = await ZOHO.CRM.API.getRecord({
        Entity: data?.Entity,
        RecordID: dealId,
      });

      let dealData = getAllSelectedDeals?.data[0];

      let {
        Provision_inkl_Storno,
        Punktewert_Kalk,
        Contact_Name,
        Gesellschaft,
        Closing_Date,
        Stornowert_in_CHF,
        Tippgeber,
        Punktestufe,
        Punktestufe_TG,
      } = dealData;

      let kontakt = Contact_Name?.name || " ";
      let gesellschaft = Gesellschaft?.name || " ";
      let abschluss = utils.formatDate(Closing_Date) || " ";
      let tippgeber = Tippgeber?.name || " ";
      // let getTippgeberID = Tippgeber?.id || " ";
      let chfPunkt = parseFloat(Punktewert_Kalk || 0);
      let storno = parseFloat(Stornowert_in_CHF || 0);
      let provision = parseFloat(Provision_inkl_Storno || 0);
      let hasTippgeber = Tippgeber?.name;

      let punktestufeValue = parseFloat(Punktestufe) || 0;
      let punktestufeTGValue = parseFloat(Punktestufe_TG) || 0;
      let getPunktestufe = hasTippgeber
        ? Math.abs(punktestufeValue) - Math.abs(punktestufeTGValue)
        : punktestufeValue;

      /*
      let getVerg_tungsstufe = 0.0;
      if (Tippgeber?.id) {
        let getTippgeber = await ZOHO.CRM.API.getRecord({
          Entity: "Tippgeber1",
          RecordID: getTippgeberID,
        });
        let tippgeberData = getTippgeber?.data[0];

        getVerg_tungsstufe = parseFloat(tippgeberData?.Verg_tungsstufe || 0.0);
      } else {
        getVerg_tungsstufe = 0.0;
      }
*/

      let row = document.createElement("tr");
      row.innerHTML = `
    <td class="border px-2 py-1 break-words text-left align-middle">${kontakt}</td>
    <td class="border px-2 py-1 break-words text-left align-middle">${gesellschaft}</td>
    <td class="border px-2 py-1 break-words text-left align-middle">${abschluss}</td>
    <td class="border px-2 py-1 break-words text-left align-middle">${tippgeber}</td>
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

      tbody.appendChild(row);

      sumPunkte += chfPunkt;
      // sumPunkte2 += getVerg_tungsstufe;
      sumStorno += storno;
      sumProvision += provision;

      document.getElementById("sumPunkte").textContent = sumPunkte.toFixed(2);
      // document.getElementById("sumPunkte2").textContent = sumPunkte2.toFixed(2);
      document.getElementById("sumStorno").textContent = sumStorno.toFixed(2);
      document.getElementById("sumProvision").textContent =
        sumProvision.toFixed(2);
    }

    // Get The First Deal Details
    let getFirstDeal = await ZOHO.CRM.API.getRecord({
      Entity: `${data?.Entity}`,
      RecordID: `${data?.EntityId[0]}`,
    });

    // Get Deals Data
    let getFirstDealData = getFirstDeal?.data[0];

    // check if there any Mitarbeiter
    if (getFirstDealData?.Mitarbeiter?.id) {
      // All getMitarbeiter Details
      let getMitarbeiterDetails = await ZOHO.CRM.API.getRecord({
        Entity: "Mitarbeiter1",
        RecordID: `${getFirstDealData?.Mitarbeiter?.id}`,
      });
      // console.log(getMitarbeiterDetails);

      // Get Mitarbeiter Data
      let getMitarbeiterData = getMitarbeiterDetails?.data[0];

      // Get Current Month and Year
      const getCurrentMonthYear = utils.getMothYear();

      // Get Full Date
      const getFullDate = utils.getFullDate();

      // For Fields Form Mitarbeiter
      let {
        Vorname,
        Nachname,
        Strasse_Hausnummer,
        PLZ,
        Ort,
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
        Total_Stornokonto,
        Total_Punkte,
        Differenz_zur_n_chsten_Stufe,
        N_chste_St_fe,
        Storno_in,
      } = getMitarbeiterData;

      /* Start Calculation */
      let BRUTTOLOHNI = parseFloat(sumProvision + Bonus).toFixed(2);
      // let stornoreserve = parseFloat(((sumProvision + Bonus) * 0.15).toFixed(2));

      // get data from Storno effektiv
      const month = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ][new Date().getMonth()];

      const year = new Date().getFullYear().toString();
      const list = getMitarbeiterData?.Storno_effektiv || [];

      // Filter all records matching month & year, then sum their values
      const stornoEffektiv = list
        .filter((e) => e.Monat === month && e.Jahr === year)
        .reduce((sum, e) => sum + (parseFloat(e.Sornowert) || 0), 0.0);

      let BRUTTOLOHNII = parseFloat(
        BRUTTOLOHNI - (Math.abs(sumStorno) + Math.abs(stornoEffektiv))
      ).toFixed(2);

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
            AHVPercentage +
            ALVPercentage +
            NBUPercentage +
            BVG +
            KTGPercentage
          ).toFixed(2) || 0.0;
      }

      let NETTOLOHNI = (BRUTTOLOHNII - Math.abs(TOTALAbzüge)).toFixed(2) || 0.0;

      // Total NETTOLOHN II
      let TotalNETTOLOHNII =
        parseFloat(Kinderzulage || 0) +
        parseFloat(Spesen || 0) +
        parseFloat(Sonstiges || 0);

      let NETTOLOHNII = parseFloat(NETTOLOHNI || 0) + TotalNETTOLOHNII;

      let TotalStornokonto = parseFloat(Total_Stornokonto) || 0.0;

      let SaldoStornokontoNeu =
        parseFloat((TotalStornokonto + sumStorno).toFixed(2)) || 0.0;

      let TotalPunkte = parseFloat(Total_Punkte) || 0.0;

      let PunkteSaldoNeu =
        parseFloat((sumPunkte + TotalPunkte).toFixed(2)) || 0.0;

      let DifferenzZurNChstenStufe =
        parseFloat(Differenz_zur_n_chsten_Stufe) || 0.0;
      /* End Calculation */

      // Inject Abrechnung HTML
      const html = `
  <section class="mb-6">
    <p class="mb-1 font-semibold">${Vorname} ${Nachname}</p>
    <p class="mb-1">${Strasse_Hausnummer}</p>
    <p class="mb-1">${PLZ} ${Ort}</p>
    <p class="text-right">Cham, ${getFullDate}</p>
  </section>

  <h2 class="text-xl font-bold mb-4 border-b pb-1">Abrechnung ${getCurrentMonthYear}</h2>

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
        <td class="text-right px-4"> ${parseFloat(Bonus || 0.0).toFixed(2)}</td>
      </tr>
      <tr class="border-b font-semibold">
        <td class="py-1 px-4">BRUTTOLOHN I (gemäss Umsatzliste)</td>
        <td></td><td></td>
        <td class="text-right px-4">${BRUTTOLOHNI}</td>
      </tr>
      <tr class="border-b">
        <td class="py-1 px-4">./. Stornoreserve</td>
        <td class="text-right px-4">${Storno_in}%</td>
        <td></td>
        <td class="text-right px-4"> - ${sumStorno.toFixed(2)}</td>
      </tr>
      <tr class="border-b">
        <td class="py-1 px-4">./. Storno effektiv</td>
        <td></td><td></td>
        <td class="text-right px-4 text-red-500"> - ${stornoEffektiv.toFixed(
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
        <td class="text-right px-4">${parseFloat(NETTOLOHNI).toFixed(2)}</td>
      </tr>
      <tr>
        <td class="py-1 px-4">+ Kinderzulage</td>
        <td></td><td></td>
        <td class="text-right px-4">${parseFloat(Kinderzulage || 0.0).toFixed(
          2
        )}</td>
      </tr>
      <tr>
        <td class="py-1 px-4"> + Spesen</td>
        <td></td><td></td>
        <td class="text-right px-4">${parseFloat(Spesen || 0.0).toFixed(2)}</td>
      </tr>
      <tr>
        <td class="py-1 px-4">./. Sonstiges</td>
        <td></td><td></td>
        <td class="text-right px-4">${(parseFloat(Sonstiges) || 0.0).toFixed(
          2
        )}</td>
      </tr>
      <tr class="font-semibold">
        <td class="py-1 px-4">NETTOLOHN II</td>
        <td></td><td></td>
        <td class="text-right px-4">${parseFloat(NETTOLOHNII).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

<div class="grid grid-cols-2 gap-y-1 gap-x-16 justify-items-start text-sm w-fit">

  <div>Auszahlung auf folgendes Konto:</div>
  <div class="text-right font-semibold">${IBAN_f_r_Auszahlungen || " "}</div>

  <div>Storno diesen Monat:</div>
  <div class="text-right font-semibold">${parseFloat(sumStorno).toFixed(
    2
  )}</div>

  <div>Saldo Stornokonto alt:</div>
  <div class="text-right font-semibold">${TotalStornokonto}</div>

  <div>Saldo Stornokonto neu:</div>
  <div class="text-right font-semibold">${SaldoStornokontoNeu}</div>

  <div>Punkte diesen Monat:</div>
  <div class="text-right font-semibold">${sumPunkte.toFixed(2)}</div>

  <div>Punkte Saldo alt:</div>
  <div class="text-right font-semibold">${TotalPunkte}</div>

  <div>Punkte Saldo neu:</div>
  <div class="text-right text-red-500 font-semibold">${PunkteSaldoNeu}</div>

  <div>Diff. zur nächsten Stufe:</div>
  <div class="text-right font-semibold">
    ${DifferenzZurNChstenStufe || 0.0}
    (${N_chste_St_fe || " "})
  </div>
</div>

  </div>
`;

      document.getElementById("abrechnung").innerHTML = html;
    } else {
      alert("No Mitarbeiter Found");
    }
  });

  ZOHO.embeddedApp.init();
});
