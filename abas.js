const tabs = document.querySelectorAll('.tab-button');

tabs.forEach(tab => tab.addEventListener('click', () => tabClicked(tab)));

const tabClicked = (tab) => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    // Add active class to the clicked tab
    tab.classList.add('active');

    // Hide all contents
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('show'));

    // Show the content corresponding to the clicked tab
    const contentId = tab.getAttribute('content-id');
    const content = document.getElementById(contentId);
    content.classList.add('show');
}

// Initialize by showing the content of the active tab
document.addEventListener('DOMContentLoaded', () => {
    const currentActiveTab = document.querySelector('.tab-button.active');
    tabClicked(currentActiveTab);
});
