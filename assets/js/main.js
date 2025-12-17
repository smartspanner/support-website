// Navigation functions
function toggleSection(button) {
  const section = button.closest('.nav-section');
  section.classList.toggle('expanded');
}

function toggleAllSections(expand) {
  const sections = document.querySelectorAll('.nav-section');
  sections.forEach(section => {
    if (expand) {
      section.classList.add('expanded');
    } else {
      section.classList.remove('expanded');
    }
  });
}

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

// Search functionality
function initMenuSearch() {
  const searchInput = document.getElementById('menu-search');
  const searchResults = document.getElementById('search-results');
  const searchClear = document.getElementById('search-clear');
  
  if (!searchInput || !searchResults || !window.menuData) return;
  
  // Build searchable menu data including sections and items
  const searchableItems = [];
  
  window.menuData.forEach(section => {
    // Add the section/header itself (for standalone pages or as a category)
    if (section.standalone && section.url) {
      // Standalone sections are clickable pages
      searchableItems.push({
        type: 'section',
        title: section.section,
        url: section.url,
        icon: section.sectionIcon,
        section: null
      });
    } else if (section.items && section.items.length > 0) {
      // Non-standalone sections with sub-items - add section header
      searchableItems.push({
        type: 'header',
        title: section.section,
        url: null,
        icon: section.sectionIcon,
        section: null,
        hasItems: true
      });
      
      // Add all sub-items
      section.items.forEach(item => {
        searchableItems.push({
          type: 'item',
          title: item.title,
          url: item.url,
          icon: item.icon,
          section: section.section
        });
      });
    }
  });
  
  // Search function
  function performSearch(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
      searchResults.style.display = 'none';
      searchResults.innerHTML = '';
      searchClear.style.display = 'none';
      return;
    }
    
    searchClear.style.display = 'flex';
    
    // Filter results - search in title and section name
    const results = searchableItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const sectionMatch = item.section && item.section.toLowerCase().includes(query);
      return titleMatch || sectionMatch;
    });
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      searchResults.style.display = 'block';
      return;
    }
    
    // Group results: sections/headers first, then items by section
    const sections = results.filter(r => r.type === 'section' || r.type === 'header');
    const items = results.filter(r => r.type === 'item');
    
    // Group items by section
    const groupedItems = {};
    items.forEach(item => {
      if (!groupedItems[item.section]) {
        groupedItems[item.section] = [];
      }
      groupedItems[item.section].push(item);
    });
    
    // Build HTML
    let html = '';
    
    // Show matching sections/headers first
    if (sections.length > 0) {
      html += '<div class="search-result-section">Menu Sections</div>';
      sections.forEach(item => {
        const highlightedTitle = highlightMatch(item.title, query);
        if (item.type === 'section' && item.url) {
          // Clickable standalone section
          html += `
            <a href="${item.url}" class="search-result-item">
              <span class="result-icon"><i data-lucide="${item.icon}"></i></span>
              <span class="result-title">${highlightedTitle}</span>
            </a>
          `;
        } else {
          // Header with sub-items - clicking expands the section
          html += `
            <button type="button" class="search-result-item search-result-header" data-section="${escapeHtml(item.title)}">
              <span class="result-icon"><i data-lucide="${item.icon}"></i></span>
              <span class="result-title">${highlightedTitle}</span>
              <span class="result-hint">Click to expand</span>
            </button>
          `;
        }
      });
    }
    
    // Show matching sub-items grouped by section
    for (const [sectionName, sectionItems] of Object.entries(groupedItems)) {
      html += `<div class="search-result-section">${escapeHtml(sectionName)}</div>`;
      sectionItems.forEach(item => {
        const highlightedTitle = highlightMatch(item.title, query);
        html += `
          <a href="${item.url}" class="search-result-item">
            <span class="result-icon"><i data-lucide="${item.icon}"></i></span>
            <span class="result-title">${highlightedTitle}</span>
          </a>
        `;
      });
    }
    
    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
    
    // Add click handlers for section headers
    searchResults.querySelectorAll('.search-result-header').forEach(btn => {
      btn.addEventListener('click', function() {
        const sectionName = this.dataset.section;
        expandSectionByName(sectionName);
        searchResults.style.display = 'none';
        searchInput.value = '';
        searchClear.style.display = 'none';
      });
    });
    
    // Re-initialize Lucide icons for new elements
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  // Expand a section by its name
  function expandSectionByName(name) {
    const sections = document.querySelectorAll('.nav-section');
    sections.forEach(section => {
      const titleEl = section.querySelector('.nav-section-title');
      if (titleEl && titleEl.textContent.trim() === name) {
        section.classList.add('expanded');
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
  
  // Highlight matching text
  function highlightMatch(text, query) {
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Escape regex special characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Event listeners
  searchInput.addEventListener('input', function(e) {
    performSearch(e.target.value);
  });
  
  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
    searchClear.style.display = 'none';
    searchInput.focus();
  });
  
  // Close results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
  
  // Show results again when focusing input with existing query
  searchInput.addEventListener('focus', function() {
    if (searchInput.value.trim()) {
      performSearch(searchInput.value);
    }
  });
  
  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.blur();
      searchResults.style.display = 'none';
    }
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const sidebar = document.querySelector('.sidebar');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  
  if (window.innerWidth <= 768 && 
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) && 
      !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Expand section containing active link on page load and initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Initialize menu search
  initMenuSearch();
  
  // Expand section containing active link
  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink) {
    const section = activeLink.closest('.nav-section');
    if (section) {
      section.classList.add('expanded');
    }
  }
});
