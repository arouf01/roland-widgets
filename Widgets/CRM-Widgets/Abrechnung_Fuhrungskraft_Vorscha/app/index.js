// Import js files
import * as dealTable from "./dealTable.js";
import * as FuhrungskraftTable from "./FuhrungskraftTable.js";

// Start Code
ZOHO.embeddedApp.on("PageLoad", async (data) => {
  let getEntity = data?.Entity;
  let getEntityIds = data?.EntityId;
  //   console.log("data : ", data);

  // Resize the widget window
  ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" });

  /* 1st Part */

  // Loop through each ID and fetch data

  for (const getID of getEntityIds) {
    const response = await ZOHO.CRM.API.getRecord({
      Entity: getEntity,
      RecordID: getID,
    });

    // Calling createDealTable Function to create dynamic Table
    dealTable.createDealTable(response?.data || []);
  }

  /* 2nd Part */
  // Get The First Deal Details
  let getFirstDeal = await ZOHO.CRM.API.getRecord({
    Entity: `${data?.Entity}`,
    RecordID: `${data?.EntityId[0]}`,
  });
  // Get Deals Data
  let getFirstDealData = getFirstDeal?.data[0];

  if (getFirstDealData?.Mitarbeiter?.id) {
    // All get Tippgeber Details
    let getMitarbeiterDetails = await ZOHO.CRM.API.getRecord({
      Entity: "Mitarbeiter1",
      RecordID: `${getFirstDealData?.Mitarbeiter?.id}`,
    });

    // Get the Deal Fuhrungskraft Percentage
    let getStornoreserveinFK = getFirstDealData?.Stornoreserve_in_FK || 0.0;

    // Calling createFuhrungskraftTableTable Function to create dynamic Table
    FuhrungskraftTable.createFuhrungskraftTableTable(
      getMitarbeiterDetails?.data[0],
      getStornoreserveinFK
    );
  } else {
    alert("No Mitarbeiter Found in the Vertrage");
  }
});

ZOHO.embeddedApp.init();
