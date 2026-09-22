const interests = document.getElementById("interests");
const button = document.getElementById("submit_interests");
const output = document.getElementById("output");
const myInterests = document.getElementById("myinterests");

button.addEventListener("click", function () {
    const input = interests.value.trim();

    // Validate that the user entered something
    if (input === "") {
        output.textContent = "Please enter at least two interests separated by commas.";
        return;
    }

    // Split input by commas and remove empty entries
    const interestList = input
        .split(",")
        .map(function (interest) {
            return interest.trim();
        })
        .filter(function (interest) {
            return interest !== "";
        });

    // Make sure the user entered a comma-separated list
    if (!input.includes(",") || interestList.length < 2) {
        output.style.color = "red";
        output.textContent =
            "Please enter multiple interests separated by commas, for example: reading, music, travel.";
        return;
    }

    // Display the updated interests
    output.style.color = "black";
    output.textContent =
        `Then, you can explore articles based on your interests: ${input}`;

    // Clear the existing list before adding the new interests
    myInterests.innerHTML = "";

    // Add each new interest to the list
    interestList.forEach(function (interest) {
        const li = document.createElement("li");
        li.textContent = interest;
        myInterests.appendChild(li);
    });
});