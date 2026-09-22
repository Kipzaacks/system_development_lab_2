// Get elements from the page
const addressInput = document.getElementById("address");
const benchmarkSelect = document.getElementById("benchmark");
const submitButton = document.getElementById("submitButton");

const status = document.getElementById("status");
const result = document.getElementById("result");

const matchedAddress = document.getElementById("matchedAddress");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const benchmarkUsed = document.getElementById("benchmarkUsed");

const map = document.getElementById("map");
const mapFrame = document.getElementById("mapFrame");

// Google Maps Embed API key
const googleMapsApiKey = "AIzaSyCUrXltBNrIPML-9uX-OeHpo6ZPVHs8Zf4";

/*
LOAD ALL CENSUS BENCHMARKS
*/

async function loadBenchmarks() {

try {

    const url =
        "https://geocoding.geo.census.gov/geocoder/benchmarks?format=json";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not load benchmarks.");
    }

    const data = await response.json();

    console.log("Census benchmark response:", data);

    // The benchmarks are directly inside data
    const benchmarks = data.benchmarks;

    // Clear "Loading benchmarks..."
    benchmarkSelect.innerHTML = "";

    // Add each benchmark to the dropdown
    benchmarks.forEach(function (benchmark) {

        const option = document.createElement("option");

        // Benchmark ID
        option.value = benchmark.id;

        // Text displayed to the user
        option.textContent =
            `${benchmark.benchmarkName} - ${benchmark.benchmarkDescription}`;

        benchmarkSelect.appendChild(option);
    });

    status.textContent = "";

} catch (error) {

    console.error("Benchmark error:", error);

    status.textContent =
        "Unable to load Census benchmarks.";

    status.classList.add("error");
}

}



/*
GEOCODE THE ADDRESS
*/

async function geocodeAddress() {


const address = addressInput.value.trim();
const benchmark = benchmarkSelect.value;

// Check for an address
if (address === "") {

    status.textContent =
        "Please enter an address.";

    status.classList.add("error");

    return;
}

// Check for a benchmark
if (benchmark === "") {

    status.textContent =
        "Please select a benchmark.";

    status.classList.add("error");

    return;
}

status.classList.remove("error");

status.textContent =
    "Finding address...";

result.style.display = "none";
map.style.display = "none";


try {

    /*
        Census Geocoder API request

        address = user's address
        benchmark = selected benchmark
        format = JSON
    */

    const url =
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
        + "?address=" + encodeURIComponent(address)
        + "&benchmark=" + encodeURIComponent(benchmark)
        + "&format=json";


    // Make API request
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Census API request failed.");
    }


    // Convert response to JSON
    const data = await response.json();


    // Check for matching addresses
    if (
        !data.result ||
        !data.result.addressMatches ||
        data.result.addressMatches.length === 0
    ) {

        status.textContent =
            "No matching address was found.";

        status.classList.add("error");

        return;
    }


    // Get the first matching address
    const match =
        data.result.addressMatches[0];


    /*
        Census coordinates:

        x = longitude
        y = latitude
    */

    const longitudeValue =
        match.coordinates.x;

    const latitudeValue =
        match.coordinates.y;

    const matchedAddressValue =
        match.matchedAddress;


    // Display matched address
    matchedAddress.textContent =
        matchedAddressValue;

    // Display latitude
    latitude.textContent =
        latitudeValue;

    // Display longitude
    longitude.textContent =
        longitudeValue;


    // Display benchmark
    benchmarkUsed.textContent =
        data.result.input.benchmark.benchmarkName;


    // Show results
    result.style.display = "block";

    status.textContent =
        "Address successfully geocoded.";


    /*
        GOOGLE MAPS EMBED API

        q = matched address
        center = latitude,longitude
        zoom = 18
    */

    const mapUrl =
        "https://www.google.com/maps/embed/v1/place"
        + "?key=" + googleMapsApiKey
        + "&q=" + encodeURIComponent(matchedAddressValue)
        + "&center=" + latitudeValue + "," + longitudeValue
        + "&zoom=18";


    // Put the Google Maps URL into the iframe
    mapFrame.src = mapUrl;

    // Show map
    map.style.display = "block";


} catch (error) {

    console.error(error);

    status.textContent =
        "There was an error communicating with the Census Geocoder.";

    status.classList.add("error");
}


}

/*
LOAD BENCHMARKS WHEN PAGE LOADS
*/

loadBenchmarks();

/*
SUBMIT BUTTON
*/

submitButton.addEventListener("click", geocodeAddress);

/*
ALLOW ENTER KEY TO SUBMIT
*/

addressInput.addEventListener("keydown", function (event) {


if (event.key === "Enter") {
    geocodeAddress();
}

});
