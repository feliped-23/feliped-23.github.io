/* 
=======================================
  Blog/Research Page Functionality
  Felipe Diaz Website
=======================================
*/

/**
 * Tag filters and clickable cards for blog page
 */
export const initBlogFilters = () => {
  const grid   = document.getElementById("blogGrid");
  const tagUi  = document.getElementById("tagControls");
  const clear  = document.getElementById("clearFilters");
  const status = document.getElementById("activeFilterText");
  const noResults = document.getElementById("noResultsMessage");
  const clearInline = document.getElementById("clearFiltersInline");
  if (!grid || !tagUi || !clear || !status || !noResults || !clearInline) return;

  const cards = Array.from(grid.querySelectorAll(".post-card"));
  const selected = new Set();

  const cardTags = (card) =>
    (card.getAttribute("data-tags") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

  const updateStatusText = () => {
    if (!selected.size) { 
      status.textContent = "Showing all posts"; 
      return; 
    }
    status.textContent = `Filtering by: ${Array.from(selected).join(", ")}`;
  };

  const applyFilter = () => {
    let visibleCount = 0;
    cards.forEach(card => {
      const tags = cardTags(card);
      const show = Array.from(selected).every(t => tags.includes(t));
      card.hidden = !show;
      if (show) visibleCount++;
    });
    
    // Show/hide no results message
    noResults.hidden = visibleCount > 0;
    
    clear.hidden = selected.size === 0;
    updateStatusText();
  };

  // Tag button clicks
  tagUi.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-btn");
    if (!btn) return;
    const tag = btn.dataset.tag;
    if (!tag) return;
    const active = selected.has(tag);
    if (active) {
      selected.delete(tag);
      btn.classList.remove("is-active");
      btn.setAttribute("aria-pressed", "false");
    } else {
      selected.add(tag);
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
    }
    applyFilter();
  });

  // Clear filters
  const clearAllFilters = () => {
    selected.clear();
    tagUi.querySelectorAll(".tag-btn").forEach(b => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    applyFilter();
  };
  
  clear.addEventListener("click", clearAllFilters);
  clearInline.addEventListener("click", clearAllFilters);

  // Make whole card clickable
  const goToPost = (card) => {
    const href = card.getAttribute("data-href") || "";
    if (href) {
      window.location.href = href;
    } else {
      // Show placeholder popup for unpublished posts
      showBlogPlaceholder(card);
    }
  };

  // Show blog placeholder popup
  const showBlogPlaceholder = (card) => {
    const modal = document.getElementById("blogPlaceholderModal");
    const dateElement = document.getElementById("placeholderDate");
    const postDate = card.querySelector(".post-date");
    
    if (modal && dateElement && postDate) {
      // Extract and format the date
      const dateText = postDate.textContent.trim();
      dateElement.textContent = dateText;
      
      // Show the modal using existing modal functionality
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      
      // Focus the first button for accessibility
      const firstButton = modal.querySelector("button");
      if (firstButton) firstButton.focus();
    }
  };

  // Close blog placeholder popup
  const closeBlogPlaceholder = () => {
    const modal = document.getElementById("blogPlaceholderModal");
    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }
  };

  // Add event listeners for closing the blog placeholder modal
  const blogModal = document.getElementById("blogPlaceholderModal");
  if (blogModal) {
    // Close on backdrop click
    const backdrop = blogModal.querySelector(".modal__backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", closeBlogPlaceholder);
    }

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && blogModal.classList.contains("open")) {
        closeBlogPlaceholder();
      }
    });

    // Close on close button clicks
    blogModal.addEventListener("click", (e) => {
      if (e.target.matches("[data-close-modal]")) {
        closeBlogPlaceholder();
      }
    });
  }
  
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a,button")) return;
      goToPost(card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToPost(card);
      }
    });
  });

  applyFilter();
};
