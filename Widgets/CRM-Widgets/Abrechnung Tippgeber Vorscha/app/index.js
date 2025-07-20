// Import js files
import * as dealTable from "./dealTable.js";
import * as tippgeberTable from "./tippgeberTable.js";

// Start Code
ZOHO.embeddedApp.on("PageLoad", async (data) => {
  let getEntity = data?.Entity;
  let getEntityIds = data?.EntityId;
  // console.log("data : ", data);

  // Resize the widget window
  ZOHO.CRM.UI.Resize({ height: "90%", width: "70%" });

  /* 1st Part */

  // Loop through each ID and fetch data
  for (const getID of getEntityIds) {
    const response = await ZOHO.CRM.API.getRecord({
      Entity: getEntity,
      RecordID: getID,
    });

    // Calling createDealTable Function to create dynamic Table
    dealTable.createDealTable(response?.data);
  }

  /* 2nd Part */

  // Get The First Deal Details
  let getFirstDeal = await ZOHO.CRM.API.getRecord({
    Entity: `${data?.Entity}`,
    RecordID: `${data?.EntityId[0]}`,
  });
  // Get Deals Data
  let getFirstDealData = getFirstDeal?.data[0];

  if (getFirstDealData?.Tippgeber?.id) {
    // All get Tippgeber Details
    let getTippgeberDetails = await ZOHO.CRM.API.getRecord({
      Entity: "Tippgeber1",
      RecordID: `${getFirstDealData?.Tippgeber?.id}`,
    });

    // Calling createTippgeberTable Function to create dynamic Table
    tippgeberTable.createTippgeberTable(getTippgeberDetails?.data[0]);
  } else {
    alert("No Tippgeber Found in the Vertrage");
  }
});

ZOHO.embeddedApp.init();
