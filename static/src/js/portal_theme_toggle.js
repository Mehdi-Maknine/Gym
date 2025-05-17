console.log("✅ Dark mode JS loaded");

// Apply dark mode from localStorage
const prefersDark = localStorage.getItem('meliora-darkmode') === '1';
if (prefersDark) {
    document.body.classList.add('theme-dark');
    console.log("🌙 Dark mode restored from localStorage");
}

// Observe the DOM for the button to appear
const observer = new MutationObserver(() => {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        observer.disconnect();  // stop watching

        toggleButton.addEventListener('click', function () {
            const isDark = document.body.classList.toggle('theme-dark');
            localStorage.setItem('meliora-darkmode', isDark ? '1' : '0');
            console.log("🌗 Theme toggled:", isDark ? 'Dark' : 'Light');
        });

        console.log("🌑 Theme toggle ready");
    }
});

observer.observe(document.body, { childList: true, subtree: true });
