const toggle = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const ICON_LIGHT =
  "https://img.icons8.com/?size=100&id=15352&format=png&color=000000";
const ICON_DARK =
  "https://img.icons8.com/?size=100&id=62034&format=png&color=000000";
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  icon.src = ICON_LIGHT;
  icon.alt = "Light mode";
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");

  icon.src = isLight ? ICON_LIGHT : ICON_DARK;
  icon.alt = isLight ? "Light mode" : "Dark mode";
});

const username = "mateorossello";
const container = document.getElementById("project-list");

fetch(`https://api.github.com/users/${username}/starred`)
  .then((res) => res.json())
  .then((repos) => {
    const filtered = repos
      .filter((repo) => !repo.fork)
      .filter((repo) => repo.name.toLowerCase() !== "mateorossello.github.io")
      .filter((repo) => repo.description)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    if (filtered.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No projects to show";
      container.appendChild(p);
      return;
    }

    filtered.forEach((repo) => {
      const project = document.createElement("div");
      project.classList.add("project");

      const updatedDate = new Date(repo.updated_at).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      );

      const title = document.createElement("h3");
      title.textContent = repo.name;
      project.appendChild(title);

      const desc = document.createElement("p");
      desc.textContent = repo.description;
      project.appendChild(desc);

      const dateText = document.createElement("p");
      dateText.textContent = `Updated ${updatedDate}`;
      project.appendChild(dateText);

      const linksDiv = document.createElement("div");
      linksDiv.classList.add("project-links");

      const githubLink = document.createElement("a");
      githubLink.href = repo.html_url;
      githubLink.target = "_blank";
      githubLink.textContent = "GitHub";
      linksDiv.appendChild(githubLink);

      if (repo.has_pages) {
        const pageLink = document.createElement("a");
        pageLink.href = `https://${username}.github.io/${repo.name}/`;
        pageLink.target = "_blank";
        pageLink.textContent = "Page";
        linksDiv.appendChild(pageLink);
      }

      project.appendChild(linksDiv);
      container.appendChild(project);
    });
  })
  .catch(() => {
    const p = document.createElement("p");
    p.textContent = "Error loading projects from GitHub";
    container.appendChild(p);
  });
