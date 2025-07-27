const getSornowert = (sornowertData, Name) => {
  // Get Current Year and Month (Swiss Locale)
  const currentYear = new Date().getFullYear().toString();
  const monthName = new Date().toLocaleString("de-CH", { month: "long" });

  // Calculate Sornowert
  let totalSornowert = 0;

  // Get Elements
  const tBody = document.getElementById("dynamicTableBody");
  const headerEl = document.getElementById("headerMonthYear");

  // Set Header Text
  headerEl.textContent = `Stornoliste ${monthName} ${currentYear}`;

  // Filter data by current month/year
  const filteredData = sornowertData.filter(
    (data) => data["Jahr"] == currentYear && data["Monat"] == monthName
  );

  // Check if any Filter Data
  if (filteredData) {
    // Populate table rows
    filteredData.forEach((data) => {
      const row = document.createElement("tr");

      const Firma = data["Firma"]?.name || "";
      const Kontaktname = data["Kontaktname"]?.name || "";
      const Produkt = data["Produkt"] || "";
      const Gesellschaftsname = data["Gesellschaftsname"] || "";
      const Stornogrund = data["Stornogrund"] || "";
      const Sornowert = data["Sornowert"] || "";
      totalSornowert += Sornowert;

      row.innerHTML = `
      <td class="border px-4 py-1 break-words text-left align-middle">${
        Name || " "
      }</td>
      <td class="border px-4 py-1 break-words text-left align-middle">${Firma} ${Kontaktname}</td>
      <td class="border px-4 py-1 break-words text-left align-middle">${Produkt}</td>
      <td class="border px-4 py-1 break-words text-left align-middle">${Gesellschaftsname}</td>
      <td class="border px-4 py-1 break-words text-left align-middle">${parseFloat(
        Sornowert || 0
      ).toFixed(2)}</td>
      <td class="border px-4 py-1 break-words text-right align-middle">${Sornowert}</td>
    `;

      tBody.appendChild(row);
    });
    document.getElementById("totalSornowert").textContent = `CHF ${parseFloat(
      totalSornowert || 0
    ).toFixed(2)}`;
  }
};

export { getSornowert };
