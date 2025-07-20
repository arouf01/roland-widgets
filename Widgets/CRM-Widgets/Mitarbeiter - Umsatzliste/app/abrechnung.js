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
    ZOHO.CRM.UI.Resize({ height: "90%", width: "70%" });

    // Format Date
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // Loop for all the selected Deals
    let tbody = document.getElementById("dynamicTableBody");
    let sumPunkte = 0;
    let sumStorno = 0;
    let sumProvision = 0;

    let getSelectDeals = data?.EntityId;

    getSelectDeals.forEach(async (dealId) => {
      let getAllSelectedDeals = await ZOHO.CRM.API.getRecord({
        Entity: data?.Entity,
        RecordID: dealId,
      });

      let dealData = getAllSelectedDeals?.data[0];

      // Get fields from each deal
      let {
        Provision_inkl_Storno,
        Punktewert_Kalk,
        Contact_Name,
        Gesellschaft,
        Closing_Date,
        Stornowert_in_CHF,
      } = dealData;

      // Fallbacks and formatting
      let kontakt = Contact_Name?.name || "NA";
      let gesellschaft = Gesellschaft?.name || "NA";
      let abschluss = formatDate(Closing_Date) || "NA";
      let chfPunkt = parseFloat(Punktewert_Kalk || 0);
      let storno = parseFloat(Stornowert_in_CHF || 0);
      let provision = parseFloat(Provision_inkl_Storno || 0);

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

      tbody.appendChild(row);

      // Add to totals
      sumPunkte += chfPunkt;
      sumStorno += storno;
      sumProvision += provision;

      // Update footer totals (inside the loop so it's live-updated per row)
      document.getElementById("sumPunkte").textContent = sumPunkte.toFixed(2);
      document.getElementById("sumStorno").textContent = sumStorno.toFixed(2);
      document.getElementById("sumProvision").textContent =
        sumProvision.toFixed(2);
    });

    // Get The First Deal Details
    let getFirstDeal = await ZOHO.CRM.API.getRecord({
      Entity: `${data?.Entity}`,
      RecordID: `${data?.EntityId[0]}`,
    });

    // Get Deals Data
    let getFirstDealData = getFirstDeal?.data[0];

    // All getMitarbeiter Details
    let getMitarbeiterDetails = await ZOHO.CRM.API.getRecord({
      Entity: "Mitarbeiter1",
      RecordID: `${getFirstDealData?.Mitarbeiter?.id}`,
    });
    // console.log(getMitarbeiterDetails);

    // Get Mitarbeiter Data
    let getMitarbeiterData = getMitarbeiterDetails?.data[0];

    const getFullDateTime = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // For Fields Form Mitarbeiter
    let { Vorname, Nachname, Strasse_Hausnummer, PLZ, Ort } =
      getMitarbeiterData;

    // Inject Abrechnung HTML
    document.getElementById("abrechnung").innerHTML = `
  <section class="mb-6">
    <p class="mb-1 font-semibold">${Vorname} ${Nachname}</p>
    <p class="mb-1">${Strasse_Hausnummer}</p>
    <p class="mb-1">${PLZ} ${Ort}</p>
    <p class="text-right">Cham, ${getFullDateTime()}</p>
  </section>
`;
  });

  ZOHO.embeddedApp.init();
});
