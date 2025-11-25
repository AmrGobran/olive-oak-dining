import "./style.css";

class Router {
  constructor() {
    this.routes = {
      "/": "home",
      "/about": "about",
      "/contact": "contact",
      "/menu": "menu",
    };
    this.currentPage = null;
    this.componentCache = {};
    this.init();

    // Icons
    this.closeIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x size-7 shrink-0"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>';
    this.menuIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2 size-7 shrink-0"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>';
    this.successIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-check text-green-500"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" /><path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" /><path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" /><path d="M8.56 20.31a9 9 0 0 0 3.44 .69" /><path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" /><path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" /><path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" /><path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" /><path d="M9 12l2 2l4 -4" /></svg>';
    this.infoIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-info-circle clear-both text-blue-500"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" /></svg>';
    this.errorIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-help-circle text-red-500"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 13a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1.368 -6.673a2.98 2.98 0 0 0 -3.631 .728a1 1 0 0 0 1.44 1.383l.171 -.18a.98 .98 0 0 1 1.11 -.15a1 1 0 0 1 -.34 1.886l-.232 .012a1 1 0 0 0 .111 1.994a3 3 0 0 0 1.371 -5.673z" /></svg>';
  }

  async init() {
    // handle browser back/forward buttons
    window.addEventListener("popstate", () => {
      this.handleRoute(
        window.location.pathname,
        window.location.hash.substring(1)
      );
    });

    // handle initial load
    await this.handleRoute(
      window.location.pathname,
      window.location.hash.substring(1)
    );

    // initialize global functionality that exits on all pages
    this.initializeGlobalFeatures();
  }

  async handleRoute(path, hash) {
    const templateName = this.routes[path] || "404";

    try {
      const content = await this.loadTemplate(templateName);
      this.renderPage(content, templateName, path, hash);
    } catch (err) {
      console.error("Failed to load page: ", err);
      this.handleError();
    }
  }

  async loadTemplate(templateName) {
    if (this.componentCache[templateName]) {
      return this.componentCache[templateName];
    }

    const response = await fetch(`/src/templates/${templateName}.html`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templateName}`);
    }

    const html = await response.text();
    this.componentCache[templateName] = html;
    return html;
  }

  async renderPage(content, templateName, path, hash) {
    const app = document.getElementById("app");

    // fade out animation
    if (!hash) {
      await app.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 500,
        fill: "forwards",
      });
    }

    app.innerHTML = content;
    document.title = this.getPageTitle(templateName);
    this.updateActiveNav(path);
    this.currentPage = templateName;

    this.bindPageEvents(templateName);

    // fade In animation
    if (!hash) {
      await app.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        fill: "forwards",
      });
    }

    // handle scrolling after page is rendered
    this.handleScrolling(hash);
  }

  bindPageEvents(templateName) {
    if (templateName === "home") this.initNewsletterForm();
    if (templateName === "contact") this.initContactForm();
  }

  initializeGlobalFeatures() {
    this.initMobileMenu();
    this.initBackToTop();
    this.initCopyrightYear();
  }

  handleScrolling(hash) {
    if (hash) {
      // wait a bit for the DOM to be fully ready
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // scroll to top for regular navigation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    }
  }

  getPageTitle(templateName) {
    const titles = {
      home: "Olive & Oak",
      about: "About | Olive & Oak",
      contact: "Contact | Olive & Oak",
      menu: "Menu | Olive & Oak",
      404: "Page Not Found",
    };
    return titles[templateName] || "Olive & Oak";
  }

  updateActiveNav(path) {
    const navLinks = document.querySelectorAll(".nav-link");
    // remove nav-active-link class from all nav links
    navLinks.forEach((link) => {
      link.classList.remove("nav-active-link");
    });

    // add nav-active-link class to current page nav link
    const currentLink = document.querySelector(`.nav-link[href="${path}"]`);
    if (currentLink) currentLink.classList.add("nav-active-link");
  }

  navigate(path, hash) {
    const url = hash ? `${path}#${hash}` : path;
    window.history.pushState({}, "", url);
    this.handleRoute(path, hash);
  }

  // --- Feature initializations ---

  initMobileMenu() {
    const toggleBtn = document.getElementById("toggle-button");
    const navMenu = document.getElementById("navigation-menu");

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isClosed = navMenu.classList.contains("max-h-0");

      if (isClosed) {
        navMenu.classList.remove("max-h-0", "opacity-0");
        navMenu.classList.add("max-h-100", "opacity-100");
        toggleBtn.innerHTML = this.closeIcon;
        document.body.classList.add("overflow-hidden");
      } else {
        navMenu.classList.remove("max-h-100", "opacity-100");
        navMenu.classList.add("max-h-0", "opacity-0");
        toggleBtn.innerHTML = this.menuIcon;
        document.body.classList.remove("overflow-hidden");
      }
    });

    // close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove("max-h-100", "opacity-100");
        navMenu.classList.add("max-h-0", "opacity-0");
        toggleBtn.innerHTML = this.menuIcon;
        document.body.classList.remove("overflow-hidden");
      }
    });
  }

  initBackToTop() {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  initCopyrightYear() {
    const copyrightYear = document.getElementById("copyright-year");
    if (!copyrightYear) return;

    copyrightYear.innerText = new Date().getFullYear();
  }

  // --- From logic ---

  initContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission(newForm);
    });

    // Add realtime-form validation
    this.initFormValidation(newForm);
  }

  initNewsletterForm() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (!newsletterForm) return;

    const newForm = newsletterForm.cloneNode(true);
    newsletterForm.parentNode.replaceChild(newForm, newsletterForm);

    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNewsletterSubmission(newForm);
    });
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = document.getElementById("contact-submit-button");

    const inputs = form.querySelectorAll("input, textarea");
    let isFormValid = true;

    inputs.forEach((input) => {
      const fieldValid = this.validateField(input);
      isFormValid = isFormValid && fieldValid;
    });

    if (!isFormValid) {
      this.showToast("error", "Please enter a valid information");
      return;
    }

    // Disable submit button
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");

    try {
      // Simulate API call
      await this.submitContactForm(formData);

      // Show success toast
      this.showToast(
        "success",
        "Thank you! Your message has been sent successfully."
      );

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Form submission error: ", error);

      // Show error toast
      this.showToast("error", "Oops! Something went wrong. Please try again.");
    } finally {
      // Enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  initFormValidation(form) {
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(input) {
    const errorEl = document.getElementById(`${input.name}-error`);

    const value = input.value.trim();
    let isValid = true;
    let message = "";

    // Optional field + empty = auto pass
    const isRequired = input.hasAttribute("required");
    if (!isRequired && value === "") {
      this.clearFieldError(input, errorEl);
      return true;
    }

    switch (input.name) {
      case "name":
        isValid = value !== "";
        message = "Please enter your name";
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = "Please enter a valid email address";
        break;
      case "phone":
        isValid = /^[+]?[\d\s\-()]{7,15}$/.test(value);
        message = "Please enter a valid phone number";
        break;
      case "message":
        isValid = value !== "";
        message = "Please enter your message";
        break;
    }

    if (!isValid) {
      this.showFieldError(input, errorEl, message);
    } else {
      this.clearFieldError(input, errorEl);
    }

    return isValid;
  }

  showFieldError(input, errEl, message) {
    if (!input) return;
    input.classList.remove("border-white");
    input.classList.add("border-red-500");
    errEl.textContent = message;
    errEl.classList.remove("hidden");
  }

  clearFieldError(input, errEl = null) {
    const errorEl = errEl || document.getElementById(`${input.name}-error`);
    if (!errorEl) return;

    input.classList.remove("border-red-500");
    input.classList.add("border-white");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  async submitContactForm(formData) {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.2) {
          resolve({ success: true });
        } else {
          reject(new Error("Network error. Please try again later."));
        }
      }, 1500);
    });
  }

  async handleNewsletterSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = document.getElementById("newsletter-submit-button");
    const input = form.querySelector("input");

    const validEmail = this.validateField(input);

    if (!validEmail) {
      this.showToast("error", "Please enter a valid email address");
      return;
    }

    // Disable submit button
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Joining...";
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");

    try {
      await this.submitNewsletterForm(formData);
      this.showToast(
        "success",
        "🎉 Subscribed! You’ll now receive our newsletter."
      );

      // Clear form on success
      form.reset();
    } catch (err) {
      console.error("Newsletter submission error:", err);

      this.showToast("error", "Oops! Something went wrong. Please try again.");
    } finally {
      // Enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  async submitNewsletterForm(formData) {
    const data = {
      email: formData.get("email"),
    };

    // Basic validation
    if (!data.email) return;
  }

  // --- Toast logic ---

  async showToast(type = "info", message, duration = 5000) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = await this.createToastElement(type, message);
    if (!toast) return;

    toastContainer.appendChild(toast);

    // Auto remove after duration
    const timeoutId = setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);

    toast.dataset.timeoutId = timeoutId;
  }

  async createToastElement(type, message) {
    let toastHTML;

    try {
      toastHTML = await this.loadComponent("toast");
    } catch (error) {
      return null;
    }

    // Create DOM element from string
    const template = document.createElement("template");
    template.innerHTML = toastHTML.trim();

    const toast = template.content.querySelector("#toast");
    const toastIcon = template.content.querySelector("#toast-icon");
    const toastMessage = template.content.querySelector("#toast-message");
    const closeButton = template.content.querySelector("#close-toast");

    const icons = {
      success: this.successIcon,
      error: this.errorIcon,
      info: this.infoIcon,
    };

    toastIcon.innerHTML = icons[type];
    toastMessage.textContent = message;

    // Apply enter animation
    toast.classList.add("animate-toast-enter");

    toast.addEventListener(
      "animationend",
      () => {
        toast.classList.remove("animate-toast-enter");
      },
      { once: true }
    );

    // Close toast when clicking the close button
    closeButton.addEventListener("click", () => this.removeToast(toast));

    // Add swipe functionality
    this.addSwipeToDismiss(toast);

    return toast;
  }

  removeToast(toast) {
    if (!toast || !toast.parentNode) return;

    // Clear any pending auto-remove timer
    if (toast.dataset.timeoutId) clearTimeout(Number(toast.dataset.timeoutId));

    toast.classList.remove("animate-toast-enter");
    toast.classList.add("animate-toast-exit");
    toast.addEventListener(
      "animationend",
      () => {
        toast.classList.remove("animate-toast-exit");
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      },
      { once: true }
    );
  }

  addSwipeToDismiss(toast) {
    let touchStartX = 0;
    let touchCurrentX = 0;
    let swipeThreshold = 100; // Minimum pixels to trigger close

    toast.addEventListener(
      "touchstart",
      (e) => {
        // Cancel auto-remove timer on touch
        if (toast.dataset.timeoutId) {
          clearTimeout(Number(toast.dataset.timeoutId));
          toast.dataset.timeoutId = "";
        }

        touchStartX = e.touches[0].clientX;
        // Disable transition so the drag follows the finger instantly
        toast.style.transition = "none";
      },
      { passive: true }
    );

    toast.addEventListener(
      "touchmove",
      (e) => {
        touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;

        // Move the toast with the finger
        toast.style.transform = `translateX(${diff}px)`;
        // Fade out slightly as you swipe
        toast.style.opacity = 1 - Math.abs(diff) / 300;
      },
      { passive: true }
    );

    toast.addEventListener("touchend", () => {
      const diff = touchCurrentX - touchStartX;

      // If swiped far enough (left or right)
      if (Math.abs(diff) > swipeThreshold) {
        this.swipeRemove(toast, diff > 0 ? "right" : "left");
      } else {
        // Reset
        toast.style.transition =
          "transform 300ms ease-out, opacity 300ms ease-out";
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
      }
    });
  }

  swipeRemove(toast, direction) {
    // Push it off the screen in the direction of the swipe
    toast.style.transition = "transform 200ms ease-in, opacity 200ms ease-in";
    toast.style.transform = `translateX(${
      direction === "right" ? "100%" : "-100%"
    })`;
    toast.style.opacity = "0";

    // Wait for manual transition to finish
    toast.addEventListener(
      "transitionend",
      () => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      },
      { once: true }
    );
  }

  async loadComponent(name) {
    if (this.componentCache[name]) return this.componentCache[name];

    const res = await fetch(`/src/templates/components/${name}.html`);
    if (!res.ok) {
      throw new Error(`Failed to load component: ${name}`);
    }

    const html = await res.text();
    this.componentCache[name] = html;
    return html;
  }

  handleError() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="container flex flex-col items-center justify-center text-center my-10 md:mt-20 lg:mt-30">
        <h1 class="text-4xl text-amber-800 font-bold font-serif">Something went wrong</h1>
        <p class="mt-2 italic text-amber-700 font-medium">Please try refreshing the page.</p>
        <a
          href="/"
          class="flex items-center w-fit mx-auto bg-amber-700 text-white py-2 px-4 rounded-md font-bold text-lg mt-5 hover:bg-amber-600 transition-all duration-300"
        >
          Go Home
        </a>
      </div>
    `;
  }
}

window.addEventListener("load", () => {
  // add router to the window object
  window.router = new Router();
  // window.router.showToast("info", "test info");
});

// add click listeners for navigation (delegated)
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-nav]") || e.target.closest("[data-nav]")) {
    const link = e.target.closest("[data-nav]");
    if (!link) return;

    const href = link.getAttribute("href");

    // special case: hash inside the SPA
    if (href.includes("#")) {
      e.preventDefault();
      const [path, hash] = href.split("#");
      const cleanPath = path || "/";
      const cleanHash = hash || null;

      window.router.navigate(cleanPath, cleanHash);
      return;
    }

    // handle regular navigation
    if (href.startsWith("/")) {
      e.preventDefault();
      window.router.navigate(href);
    }
  }
});
