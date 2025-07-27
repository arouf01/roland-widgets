// Import js files
import * as mitarbeiter from "./mitarbeiter.js";

ZOHO.embeddedApp.on("PageLoad", async (data) => {
  // Resize the widget window
  ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" });

  // Get The Mitarbeiter Details
  let getMitarbeiter = await ZOHO.CRM.API.getRecord({
    Entity: `${data?.Entity}`,
    RecordID: `${data?.EntityId[0]}`,
  });
  //   console.log(getMitarbeiter?.data[0]);

  if (getMitarbeiter !== null) {
    // Calling createMitarbeiterTable Function to create dynamic Table
    mitarbeiter.createMitarbeiterTable(getMitarbeiter?.data[0]);
  } else {
    alert("Failed !!!");
  }
});

ZOHO.embeddedApp.init();
