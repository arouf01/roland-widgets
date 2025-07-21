// Import js files
import * as mitarbeiter from "./mitarbeiter.js";

// Start Code
ZOHO.embeddedApp.on("PageLoad", async (data) => {
  // console.log("data : ", data);

  // Resize the widget window
  ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" });

  // Get The First Deal Details
  let getMitarbeiter = await ZOHO.CRM.API.getRecord({
    Entity: `${data?.Entity}`,
    RecordID: `${data?.EntityId[0]}`,
  });

  if (getMitarbeiter !== null) {
    // Calling createTippgeberTable Function to create dynamic Table
    mitarbeiter.createMitarbeiterTable(getMitarbeiter?.data[0]);
  } else {
    alert("Failed !!!");
  }
});

ZOHO.embeddedApp.init();
