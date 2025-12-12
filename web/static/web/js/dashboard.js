// dashboard.js
// Small UX helpers for the dashboard layout

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle on small screens
  const sidebar = document.querySelector("[data-dash-sidebar]");
  const toggleBtn = document.querySelector("[data-dash-toggle]");

  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("dash-sidebar--open");
    });
  }

  // Topbar shadow on scroll
  const topbar = document.querySelector("[data-dash-topbar]");
  if (topbar) {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > 8) {
        topbar.classList.add("dash-topbar--scrolled");
      } else {
        topbar.classList.remove("dash-topbar--scrolled");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Role pills toggle
  const roleGroup = document.querySelector("[data-dash-role-group]");
  if (roleGroup) {
    const pills = roleGroup.querySelectorAll(".dash-role__pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) =>
          p.classList.remove("dash-role__pill--active")
        );
        pill.classList.add("dash-role__pill--active");
      });
    });
  }

  // Scroll reveal for dashboard content
  const revealItems = document.querySelectorAll("[data-dash-reveal]");
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealItems.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) =>
        el.classList.add("dash-reveal--visible")
      );
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("dash-reveal--visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );

      revealItems.forEach((el) => {
        observer.observe(el);
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Page enter animation
  const mainContent = document.querySelector(".dash-main__content");
  if (mainContent) {
    // Use rAF to wait one frame so transition is visible
    requestAnimationFrame(() => {
      mainContent.classList.add("dash-main__content--ready");
    });
  }

  // Role pills visual toggle
  const rolePills = document.querySelectorAll("[data-role-pill]");
  if (rolePills.length) {
    rolePills.forEach((pill) => {
      pill.addEventListener("click", () => {
        rolePills.forEach((p) =>
          p.classList.remove("dash-role__pill--active")
        );
        pill.classList.add("dash-role__pill--active");
      });
    });
  }
});

