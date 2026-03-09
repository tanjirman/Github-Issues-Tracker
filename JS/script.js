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
  
};// load cardData from API
    // priority function
function getPriorityBadge(priority) {
  if (priority === "high") {
    return `<div class="badge px-6 py-3 text-red-500 bg-red-100">High</div>`;
  }

  if (priority === "medium") {
    return `<div class="badge px-6 py-3 text-yellow-500 bg-yellow-100">Medium</div>`;
  }

  if (priority === "low") {
    return `<div class="badge px-6 py-3 text-gray-500 bg-gray-100">Low</div>`;
  }
}

// lebels function
function getLabels(labels) {
  return labels
    .map((label) => {
      if (label === "bug") {
        return `
      <div class="badge border border-red-300 text-red-500 bg-red-100">
        <i class="fa-solid fa-bug"></i> Bug
      </div>`;
      }

      if (label === "enhancement") {
        return `
      <div class="badge border border-green-300 text-green-500 bg-green-100">
        <i class="fa-solid fa-wand-magic-sparkles"></i> Enhancement
      </div>`;
      }

      if (label === "documentation") {
        return `
      <div class="badge border border-blue-300 text-blue-500 bg-blue-100">
        <i class="fa-brands fa-readme"></i> Documentation
      </div>`;
      }

      if (label === "good first issue") {
        return `
      <div class="badge border border-purple-300 text-purple-500 bg-purple-100">
        <i class="fa-solid fa-file-circle-exclamation"></i> Good first issue
      </div>`;
      }

      if (label === "help wanted") {
        return `
      <div class="badge border border-yellow-300 text-yellow-500 bg-yellow-100">
        <i class="fa-regular fa-circle-stop"></i> Help wanted
      </div>`;
      }
    })
    .join("");
}