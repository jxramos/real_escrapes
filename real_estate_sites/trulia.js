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

    // Scrape Address, Listing Date
    div_elements = document.getElementsByTagName("div");
    for (let i = 1; i < div_elements.length; i++) {
        var div_element = div_elements[i]
        let data_test_id = div_element.getAttribute("data-testid");
        if (data_test_id == "home-details-summary-address" ) {
            property_data["Address"] = div_element.innerText.replace("\n", "; ")
        } else if (data_test_id == "seo-description-paragraph") {
            seo_desc = div_element.innerText.split(" on ")[1].replace(". This property is pet friendly", "");
            property_data["Listing Date"] = seo_desc.substring(0,seo_desc.length-1);
            break;
        }
    }

    // Scrape Year Built

    // Scrape Number of Bedrooms, Number of Baths, and Square Footage
    ul_elements = document.getElementsByTagName("ul");
    for (let i = 1; i < ul_elements.length; i++) {
        var ul_element = ul_elements[i]
        let data_test_id = ul_element.getAttribute("data-testid");
        if (data_test_id == "facts-list") {
            break;
        }
    }
    property_data["Beds"] = ul_element.children[0].innerText;
    property_data["Baths"] = ul_element.children[1].innerText;
    property_data["sqft"] =  ul_element.children[2].innerText;

    // Scrape Property Type
    span_elements = document.getElementsByTagName("span");
    for (let i = 1; i < span_elements.length; i++) {
        var span_element = span_elements[i]
        if (span_element.innerText.startsWith("Property Type: ")) {
            property_data["Property Type"] = span_element.innerText
            break;
        }
    }

    // Persist property data to disk
    downloadPropertyDataAsJson(property_data)
}

function downloadPropertyDataAsJson(property_data) {
    console.log("downloadPropertyDataAsJson")

    var transactionJson = JSON.stringify(property_data);
    filename = property_data["AccessDate"] + ' ' + property_data['Website']+'--'+property_data['listing_id']+'.re.json'
    downloadContent(filename, transactionJson);
}

function downloadContent(filename, content) {
    let a = document.createElement('a');
    a.href = "data:application/octet-stream,"+encodeURIComponent(content);
    a.download = filename;
    a.click();
}


processTruliaPropertyPage();