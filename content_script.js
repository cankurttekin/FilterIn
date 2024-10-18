function filterJobs(options) {
  // Select all job listings
  const jobs = document.querySelectorAll('li.jobs-search-results__list-item');

  jobs.forEach(job => {
    let shouldHide = false;

    // Check if the job is applied
    if (options.hideApplied) {
      const status = job.querySelector('.job-card-container__footer-job-state');
      if (status && status.textContent.includes('Applied')) {
        shouldHide = true;
      }
    }

    // Check if the job is from a specific company
    if (options.hideCompanies.length > 0) {
      const company = job.querySelector('.artdeco-entity-lockup__subtitle')?.textContent.trim();
      if (company && options.hideCompanies.some(c => company.includes(c))) {
        shouldHide = true;
      }
    }

    // Check if the job contains specific keywords
    if (options.hideKeywords.length > 0) {
      const jobTitle = job.querySelector('.job-card-list__title')?.textContent.trim();
      if (jobTitle && options.hideKeywords.some(keyword => jobTitle.includes(keyword))) {
        shouldHide = true;
      }
    }

    // Check if the job has been viewed
    if (options.hideViewed) {
      const viewed = job.querySelector('.job-card-container__footer-job-state');
      if (viewed && viewed.textContent.includes('Viewed')) {
        shouldHide = true;
      }
    }

    // Hide the job if any conditions are met
    if (shouldHide) {
      job.style.display = 'none';
    }
  });
}

// Load options from storage and apply filters
function applyFilters() {
  browser.storage.sync.get({
    hideApplied: false,
    hideCompanies: [],
    hideKeywords: [],
    hideViewed: false
  }).then((options) => {
    filterJobs(options);
  }).catch((error) => {
    console.error('Error retrieving options:', error);
  });
}

// Add a message listener for the popup to apply filters
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'applyFilters') {
    applyFilters();
  }
});

// Apply filters when the page loads
window.addEventListener('load', applyFilters);

// Apply filters when the page is updated (e.g., scrolling down for more jobs)
const observer = new MutationObserver(applyFilters);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
