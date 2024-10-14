document.addEventListener('DOMContentLoaded', () => {
    const hideAppliedCheckbox = document.getElementById('hide-applied');
    const hideViewedCheckbox = document.getElementById('hide-viewed');
    const hideKeywordsCheckbox = document.getElementById('hide-keywords');
    const hideCompaniesCheckbox = document.getElementById('hide-companies');
    const optionsButton = document.getElementById('options-button');

    // Load stored options and set the UI
    function loadOptions() {
        browser.storage.sync.get({
            hideApplied: false,
            hideViewed: false,
            hideKeywords: false,
            hideCompanies: false,
        }).then(options => {
            hideAppliedCheckbox.checked = options.hideApplied;
            hideViewedCheckbox.checked = options.hideViewed;
            hideKeywordsCheckbox.checked = options.hideKeywords;
            hideCompaniesCheckbox.checked = options.hideCompanies;
        }).catch(error => {
            console.error('Error loading options:', error);
        });
    }

    // Save options and immediately apply filters
    function saveOptions() {
        const hideApplied = hideAppliedCheckbox.checked;
        const hideViewed = hideViewedCheckbox.checked;
        const hideKeywords = hideKeywordsCheckbox.checked;
        const hideCompanies = hideCompaniesCheckbox.checked;

        const options = { hideApplied, hideViewed, hideKeywords, hideCompanies };

        // Save options to storage
        browser.storage.sync.set(options).then(() => {
            // Notify content script to apply the new filters
            browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                browser.tabs.sendMessage(tabs[0].id, { action: 'applyFilters' });
            });
        }).catch(error => {
            console.error('Error saving options:', error);
        });
    }

    // Open options page
    optionsButton.addEventListener('click', () => {
        browser.runtime.openOptionsPage();
    });

    hideAppliedCheckbox.addEventListener('change', saveOptions);
    hideViewedCheckbox.addEventListener('change', saveOptions);
    hideKeywordsCheckbox.addEventListener('change', saveOptions);
    hideCompaniesCheckbox.addEventListener('change', saveOptions);

    // Load options when popup is opened
    loadOptions();
});
