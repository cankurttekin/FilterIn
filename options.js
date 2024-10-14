
// Save options to browser storage
function saveOptions() {
  const hideApplied = document.getElementById('hideApplied').checked;
  const hideCompanies = document.getElementById('hideCompanies').value.split('\n').map(c => c.trim()).filter(c => c.length > 0);
  const hideKeywords = document.getElementById('hideKeywords').value.split('\n').map(k => k.trim()).filter(k => k.length > 0);

  browser.storage.sync.set({
    hideApplied,
    hideCompanies,
    hideKeywords
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => { status.textContent = ''; }, 1500);
  });
}

// Restore options from browser storage
function restoreOptions() {
  browser.storage.sync.get({
    hideApplied: false,
    hideCompanies: [],
    hideKeywords: []
  }, (options) => {
    document.getElementById('hideApplied').checked = options.hideApplied;
    document.getElementById('hideCompanies').value = options.hideCompanies.join('\n');
    document.getElementById('hideKeywords').value = options.hideKeywords.join('\n');
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
