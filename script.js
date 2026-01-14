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
      container.innerHTML = "<p>No projects to show</p>";
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
        }
      );

      project.innerHTML = `<h3>${repo.name}</h3>
            <p>${repo.description}</p>
            <p>Updated ${updatedDate}</p>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank">GitHub</a>
                ${
                  repo.has_pages
                    ? `<a href="https://${username}.github.io/${repo.name}/" target="_blank">Page</a>`
                    : ""
                }
            </div>`;

      container.appendChild(project);
    });
  })
  .catch(() => {
    container.innerHTML = "<p>Error loading projects from GitHub</p>";
  });
