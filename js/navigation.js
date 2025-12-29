// Navigation Component using Bootstrap
function createNavigation(activePage = 'home') {
    return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="index.html">
                    <i class="bi bi-book"></i> Luyện Thi Tiếng Nhật
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="index.html">
                                <i class="bi bi-house-door"></i> Trang Chủ
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'history' ? 'active' : ''}" href="history.html">
                                <i class="bi bi-clock-history"></i> Lịch Sử
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'settings' ? 'active' : ''}" href="settings.html">
                                <i class="bi bi-gear"></i> Cấu Hình
                            </a>
                        </li>
                        <li class="nav-item">
                            <button class="theme-toggle ms-2" onclick="toggleTheme()" title="Chuyển theme">
                                <i class="bi bi-moon-stars-fill" id="theme-icon"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

// Insert navigation into page
function insertNavigation(activePage) {
    const navHTML = createNavigation(activePage);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navHTML;

    // Insert at the very beginning of body
    document.body.insertAdjacentElement('afterbegin', tempDiv.firstElementChild);

    // Load saved theme
    loadTheme();
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }

    // Save preference
    localStorage.setItem('theme', newTheme);

    // Update icon
    updateThemeIcon();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;

    const isDark = document.body.classList.contains('dark-mode');
    icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
}

