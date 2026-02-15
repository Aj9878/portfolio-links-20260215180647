(function () {
  "use strict";

  var REQUIRED_FIELDS = ["id", "title", "description", "url", "category"];

  function normalizeUrl(rawUrl) {
    if (typeof rawUrl !== "string") {
      return null;
    }

    var trimmed = rawUrl.trim();
    if (!trimmed) {
      return null;
    }

    if (/^www\./i.test(trimmed)) {
      trimmed = "https://" + trimmed;
    } else if (/^http:\/\//i.test(trimmed)) {
      trimmed = trimmed.replace(/^http:\/\//i, "https://");
    } else if (!/^https:\/\//i.test(trimmed)) {
      return null;
    }

    try {
      var parsed = new URL(trimmed);
      if (parsed.protocol !== "https:") {
        return null;
      }
      return parsed.toString();
    } catch (error) {
      return null;
    }
  }

  function isValidItem(item, index, seenIds) {
    if (!item || typeof item !== "object") {
      console.warn("Skipping link at index " + index + ": item is not an object.");
      return false;
    }

    for (var i = 0; i < REQUIRED_FIELDS.length; i += 1) {
      var key = REQUIRED_FIELDS[i];
      if (typeof item[key] !== "string" || item[key].trim() === "") {
        console.warn("Skipping link at index " + index + ": missing or invalid '" + key + "'.");
        return false;
      }
    }

    if (seenIds.has(item.id)) {
      console.warn("Skipping link at index " + index + ": duplicate id '" + item.id + "'.");
      return false;
    }
    seenIds.add(item.id);

    var normalized = normalizeUrl(item.url);
    if (!normalized) {
      console.warn("Skipping link '" + item.id + "': invalid URL '" + item.url + "'.");
      return false;
    }

    item.url = normalized;
    return true;
  }

  function createCard(item, index) {
    var card = document.createElement("article");
    card.className = "link-card";
    card.setAttribute("role", "listitem");
    card.style.setProperty("--card-index", String(index));

    var category = document.createElement("p");
    category.className = "category";
    category.textContent = item.category;

    var title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = item.title;

    var description = document.createElement("p");
    description.className = "card-description";
    description.textContent = item.description;

    var button = document.createElement("a");
    button.className = "visit-button";
    button.href = item.url;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = "Visit";
    button.setAttribute("aria-label", "Visit " + item.title);

    card.appendChild(category);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);

    return card;
  }

  function renderLinks() {
    var links = Array.isArray(window.PORTFOLIO_LINKS) ? window.PORTFOLIO_LINKS : [];
    var container = document.getElementById("links-grid");
    var emptyState = document.getElementById("empty-state");

    if (!container || !emptyState) {
      return;
    }

    container.innerHTML = "";

    var seenIds = new Set();
    var validLinks = [];

    for (var i = 0; i < links.length; i += 1) {
      var item = links[i];
      if (isValidItem(item, i, seenIds)) {
        validLinks.push(item);
      }
    }

    if (validLinks.length === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    for (var j = 0; j < validLinks.length; j += 1) {
      container.appendChild(createCard(validLinks[j], j));
    }

    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([container]).catch(function (error) {
        console.warn("MathJax rendering failed:", error);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderLinks);
  } else {
    renderLinks();
  }
})();
