function processTruliaPropertyPage() {
    // Processes URLs like
    // https://www.trulia.com/p/<state>/<city>/<street_addr>-<city>-<state>-<zip>--<listing_id>
    console.log("processTruliaPropertyPage")

    // Initialize the property data to be recorded
    var property_data = {
        "Website":"trulia.com",
        "URL": window.location.href,
        "listing_id": window.location.href.split("--")[1]
    }

    // Note the access date for the page
    accessDate = new Date();
    property_data["AccessDate"] = accessDate.getFullYear() +
                                    "-" + String(accessDate.getMonth()+1).padStart(2, '0') +
                                    "-" + String(accessDate.getDate()).padStart(2, '0');
    // Scrape Price
    h3_elements = document.getElementsByTagName("h3");
    for (let i = 1; i < h3_elements.length; i++) {
        var h3_element = h3_elements[i]
        let data_test_id = h3_element.getAttribute("data-testid");
        if (data_test_id == "on-market-price-details" ) {
            property_data["Price"] = h3_element.innerText
            break;
        }
    }

    // Scrape Address
    div_elements = document.getElementsByTagName("div");
    for (let i = 1; i < div_elements.length; i++) {
        var div_element = div_elements[i]
        let data_test_id = div_element.getAttribute("data-testid");
        if (data_test_id == "home-details-summary-address" ) {
            property_data["Address"] = div_element.innerText.replace("\n", "; ")
            break;
        }
    }

    // Scrape Year Built

    // Scrape Square Footage

    // Scrape Days on Market

    // Scrape Number of Bedrooms

    // Scrape Number of Bathrooms

    // Persist property data to disk
    downloadPropertyDataAsJson(property_data)
}

function downloadPropertyDataAsJson(property_data) {
    console.log("downloadPropertyDataAsJson")

    var transactionJson = JSON.stringify(property_data);
    filename = property_data["AccessDate"] + ' ' + property_data['Website']+'--'+property_data['listing_id']+'.re.json'
    downloadContent(filename, transactionJson);
}


processTruliaPropertyPage();