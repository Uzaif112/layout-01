const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navigationItems = [...document.querySelectorAll(".nav-links a")];

const setActiveLink = (activeLink) => {
  navigationItems.forEach((item) => {
    const isActive = item === activeLink;
    item.classList.toggle("active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
};

window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 30),
  { passive: true },
);

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navigationItems.forEach((link) =>
  link.addEventListener("click", () => {
    setActiveLink(link);
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }),
);

const navTargets = navigationItems
  .map((link) => ({ link, target: document.querySelector(link.getAttribute("href")) }))
  .filter(({ target }) => target);

let scrollTicking = false;
const updateScrollNavigation = () => {
  const marker = window.scrollY + header.offsetHeight + 72;
  let current = navTargets[0]?.link;

  navTargets.forEach(({ link, target }) => {
    if (target.offsetTop <= marker) current = link;
  });

  if (current) setActiveLink(current);
  scrollTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollNavigation);
      scrollTicking = true;
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateScrollNavigation);
updateScrollNavigation();

document.querySelectorAll(".goal").forEach((goal) =>
  goal.addEventListener("click", () => {
    document.querySelectorAll(".goal").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-checked", "false");
    });
    goal.classList.add("selected");
    goal.setAttribute("aria-checked", "true");
  }),
);

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));

document
  .querySelector(".footer-news form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    input.value = "";
    input.placeholder = "You’re on the list!";
  });
