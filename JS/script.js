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
});// search bar section
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", function () {

  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("hidden");

  const searchText = searchInput.value.trim().toLowerCase();

  // If input is empty, show all issues
  if (!searchText) {
    spinner.classList.add("hidden");
    displayIssues(allIssues);
    return;
  }

  // Filter issues only if match first word equals search text
  const filtered = allIssues.filter((issue) => {
    const firstWord = issue.title.split(" ")[0].toLowerCase();
    return firstWord === searchText; // First word exact match
  });

  displayIssues(filtered);
  spinner.classList.add("hidden");
});


// rendering data from API
 const searchIssues = async () => {

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
  const res = await fetch(url);
  const data = await res.json();
  spinner.classList.add("hidden");
  displayIssues(data.data);
  
};