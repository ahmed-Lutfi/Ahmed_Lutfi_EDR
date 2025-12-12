// main.js
// Shared script for landing + base layout pages.

document.addEventListener("DOMContentLoaded", () => {
  initHeaderOnScroll();
  initScrollIndicator();
  initMobileNav();
  initSmoothScrollForNavLinks();
  initActiveNavOnScroll();
  initRevealOnScroll();
  initHeroParallax();

  console.log("EDR Mini main.js initialized");
});

/**
 * Sticky header state on scroll.
 * Adds / removes .site-header--scrolled based on scroll position.
 */
function initHeaderOnScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 12) {
      header.classList.add("site-header--scrolled");
    } else {
      header.classList.remove("site-header--scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/**
 * Top scroll progress bar.
 * Uses .scroll-indicator__bar with transform: scaleX().
 */
function initScrollIndicator() {
  const bar = document.querySelector(".scroll-indicator__bar");
  if (!bar) return;

  const updateBar = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight <= 0) {
      bar.style.transform = "scaleX(0)";
      return;
    }

    const progress = Math.min(scrollTop / docHeight, 1);
    bar.style.transform = `scaleX(${progress})`;
  };

  updateBar();
  window.addEventListener("scroll", updateBar, { passive: true });
  window.addEventListener("resize", updateBar);
}

/**
 * Mobile navigation toggle.
 * Requires:
 * - button[data-nav-toggle]
 * - ul[data-nav-menu]
 */
function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("site-nav__list--open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("nav-toggle--active");
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("site-nav__list--open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.classList.toggle("nav-toggle--active", isOpen);
  };

  toggle.addEventListener("click", toggleMenu);

  // Close on link click (for in-page navigation)
  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (href.includes("#")) {
      closeMenu();
    }
  });

  // Optional: close on escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/**
 * Smooth scroll for nav links that point to sections
 * on the same page.
 * Works with links:
 * - having [data-nav-link]
 * - href like "/path/#section-id"
 */
function initSmoothScrollForNavLinks() {
  const links = document.querySelectorAll("[data-nav-link]");
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;

      let url;
      try {
        url = new URL(href, window.location.origin);
      } catch (_error) {
        return;
      }

      const hash = url.hash;
      if (!hash) return;

      // Same page → intercept and smooth scroll
      if (url.pathname === window.location.pathname) {
        const targetId = hash.slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/**
 * Highlight active nav link while scrolling.
 * Maps fixed section ids to nav links that contain #id in href.
 */
function initActiveNavOnScroll() {
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  if (!navLinks.length) return;

  const sectionIds = ["overview", "features", "endpoints", "alerts", "docs", "demo"];
  const trackedSections = [];

  sectionIds.forEach((id) => {
    const sectionEl = document.getElementById(id);
    if (!sectionEl) return;

    const link = navLinks.find((linkEl) => {
      const href = linkEl.getAttribute("href") || "";
      return href.includes(`#${id}`);
    });

    if (!link) return;

    trackedSections.push({
      id,
      section: sectionEl,
      link,
    });
  });

  if (!trackedSections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) =>
      link.classList.remove("site-nav__link--active")
    );
    const found = trackedSections.find((item) => item.id === id);
    if (found) {
      found.link.classList.add("site-nav__link--active");
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (id) setActive(id);
        });
      },
      {
        root: null,
        rootMargin: "-55% 0px -40% 0px",
        threshold: 0,
      }
    );

    trackedSections.forEach((item) => observer.observe(item.section));
  } else {
    // Fallback for older browsers
    const onScroll = () => {
      const scrollPos =
        window.scrollY || document.documentElement.scrollTop;

      let currentId = null;

      trackedSections.forEach((item) => {
        const rect = item.section.getBoundingClientRect();
        const offsetTop = rect.top + scrollPos;
        if (scrollPos >= offsetTop - 140) {
          currentId = item.id;
        }
      });

      if (currentId) {
        setActive(currentId);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}

/**
 * Scroll reveal for landing elements (hero text, feed items, grid cards).
 * Adds .reveal-item and later .reveal-item--visible when in view.
 */
function initRevealOnScroll() {
  const candidates = Array.from(
    document.querySelectorAll(
      ".landing-hero__content, .feed-item, .grid-card"
    )
  );

  if (!candidates.length) return;

  candidates.forEach((element, index) => {
    element.classList.add("reveal-item");
    const delay = index * 70;
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-item--visible");
          obs.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
      }
    );

    candidates.forEach((element) => observer.observe(element));
  } else {
    // Simple fallback without IntersectionObserver
    const onScroll = () => {
      const viewportHeight = window.innerHeight;

      candidates.forEach((element) => {
        if (element.classList.contains("reveal-item--visible")) return;

        const rect = element.getBoundingClientRect();
        if (rect.top < viewportHeight * 0.85) {
          element.classList.add("reveal-item--visible");
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}

/**
 * Simple parallax effect for hero panel on mouse move.
 * Applies 3D transform on .landing-hero__panel inside .landing-hero.
 */
function initHeroParallax() {
  const hero = document.querySelector(".landing-hero");
  const panel = document.querySelector(".landing-hero__panel");

  if (!hero || !panel) return;

  // Only apply on devices with fine pointer (mouse, trackpad)
  const hasFinePointer =
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches;

  if (!hasFinePointer) return;

  const strength = 10; // max translation in pixels
  const maxRotation = 4; // max degrees

  const onMouseMove = (event) => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const relX = (event.clientX - rect.left) / rect.width - 0.5; // [-0.5, 0.5]
    const relY = (event.clientY - rect.top) / rect.height - 0.5; // [-0.5, 0.5]

    const translateX = -relX * strength;
    const translateY = -relY * strength;
    const rotateX = relY * maxRotation;
    const rotateY = -relX * maxRotation;

    panel.style.transform = `
      translate3d(${translateX}px, ${translateY}px, 0)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  };

  const resetTransform = () => {
    panel.style.transform =
      "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";
  };

  hero.addEventListener("mousemove", onMouseMove);
  hero.addEventListener("mouseleave", resetTransform);
}
