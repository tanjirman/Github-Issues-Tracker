let allIssues = [];

// tabs button functionality

const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    tabButtons.forEach((btn) => btn.classList.remove("btn-primary")); //remove the blue color
    this.classList.add("btn-primary"); //adding the blue color

    // Get status to filter
    const tabText = this.innerText.toLowerCase();

    if (tabText === "all") {
      displayIssues(allIssues);
    } else {
      const filtered = allIssues.filter((issue) => issue.status === tabText);
      displayIssues(filtered);
    }
  });
});