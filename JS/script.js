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
// load all cards

const loadIssue = () => {
  // load spinner
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("hidden");

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
      allIssues = data.data; // save globally
      spinner.classList.add("hidden"); // hide spinner
      displayIssues(allIssues);
    });
};

// modal details function
const loadCardDetail = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  //console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayCardDetail(details.data);
};

const displayCardDetail = (issue) => {
  console.log(issue);
  const detailBox = document.getElementById("details-container");

    // call functions
  const priority = getPriorityBadge(issue.priority);
  const labels = getLabels(issue.labels);
  detailBox.innerHTML = `
  
  <div class="space-y-6">
      <h2 class="text-xl font-bold">${issue.title}</h2>
      <div class="flex gap-3 items-center">
        <div class="${issue.status === 'closed' ? 'bg-purple-500' : 'bg-[#00A96E]'} text-white rounded-full px-3 py-1">
          ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
        </div>

        <p class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
          Opened by ${issue.author}
        </p>

        <p class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
          ${new Date(issue.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div class="flex flex-wrap gap-2">${labels}</div>
      <p class="text-gray-500">${issue.description}</p>

      <div class="flex justify-between w-11/12 mx-auto bg-sky-50 rounded-2xl p-4">
        <div>
          <p class="text-gray-500">Assignee:</p>
          <h4 class="text-sm font-bold">${issue.assignee || "Unassigned"}</h4>
        </div>
        <div>
          <p class="text-gray-500">Priority:</p>
          <h4>${priority}</h4>
        </div>
      </div>
    </div>

    `;

  document.getElementById("card_modal").showModal();
};

const displayIssues = (issues) => {
  // step-1
  const container = document.getElementById("issue-container");
  container.innerHTML = "";

  if (issues.length === 0) {
    container.innerHTML = `
      <div class="text-center col-span-full py-20 space-y-4">
        <i class="fa-solid fa-file-circle-minus text-5xl text-gray-400"></i>
        <h2 class="text-2xl font-bold text-gray-600">No Issues Found</h2>
        <p class="text-gray-400">Try searching with a different keyword.</p>
      </div>
    `;
    return;
  }


  // step-2
  issues.forEach((issue) => {
    // status image
    let statusImg = "./assets/Open-Status.png";
    let borderColor = "border-t-4 border-[#00A96E]";
    if (issue.status === "closed") {
      statusImg = "./assets/Closed- Status .png";
      borderColor = "border-t-4 border-[#A855F7]";
    }

    //   call function
    const priority = getPriorityBadge(issue.priority);
    const labels = getLabels(issue.labels);

    // step-3
    const card = document.createElement("div");
    card.innerHTML = `

        <div onclick="loadCardDetail(${issue.id})" class="space-y-4 shadow-2xl p-5 rounded-2xl h-full ${borderColor}">

      <div  class="flex flex-wrap justify-between items-center">
        <img src="${statusImg}" alt="">
        ${priority}
      </div>

      <h2 class="text-xl font-bold">${issue.title}</h2>

      <p class="text-gray-500 line-clamp-2">
        ${issue.description}
      </p>

      <div class="flex flex-wrap gap-2">
        ${labels}
      </div>

      <hr class="opacity-10">

      <p class="text-gray-400">#${issue.id} by ${issue.author}</p>
      <p class="text-gray-400">${issue.createdAt}</p>

        
        `;
        // step-4
    container.appendChild(card);
  });
};

loadIssue();