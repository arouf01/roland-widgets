// Import js files
import * as tippgeber from "./tippgeber.js";

ZOHO.embeddedApp.on("PageLoad", async (data) => {
  // console.log("data : ", data);

  // Resize the widget window
  ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" });

  // Get The Tippgeber Details
  let getTippgeber = await ZOHO.CRM.API.getRecord({
    Entity: `${data?.Entity}`,
    RecordID: `${data?.EntityId[0]}`,
  });
  // console.log(getTippgeber?.data[0]);

  if (getTippgeber !== null) {
    // Calling createTippgeberTable Function to create dynamic Table
    tippgeber.createTippgeberTable(getTippgeber?.data[0]);
  } else {
    alert("Failed !!!");
  }
});

ZOHO.embeddedApp.init();
