import { Link, useLocation } from "react-router-dom";

const breadcrumbMap: Record<string, { text: string; to: string }[]> = {
  "/": [{ text: "Home", to: "/" }],
  "/tasks": [
    { text: "Home", to: "/" },
    { text: "Tasks", to: "/tasks" },
  ],
  "/tasks/new": [
    { text: "Home", to: "/" },
    { text: "Tasks", to: "/tasks" },
    { text: "New task", to: "/tasks/new" },
  ],
  "/tasks/search": [
    { text: "Home", to: "/" },
    { text: "Tasks", to: "/tasks" },
    { text: "Search", to: "/tasks/search" },
  ],
  "/tasks/:id/edit": [
    { text: "Home", to: "/" },
    { text: "Tasks", to: "/tasks" },
    { text: "Edit task", to: "#" },
  ],
  "/tasks/:id/delete": [
    { text: "Home", to: "/" },
    { text: "Tasks", to: "/tasks" },
    { text: "Delete task", to: "#" },
  ],
};

export default function Breadcrumbs() {
  const location = useLocation();
  let path = location.pathname;

  // Handle dynamic routes like /tasks/:id/edit
  if (/^\/tasks\/\d+\/edit$/.test(path)) {
    path = "/tasks/:id/edit";
  }
  if (/^\/tasks\/\d+\/delete$/.test(path)) {
    path = "/tasks/:id/delete";
  }

  const crumbs = breadcrumbMap[path] || [{ text: "Home", to: "/" }];

  return (
    <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol className="govuk-breadcrumbs__list">
        {crumbs.map((crumb, i) => (
          <li className="govuk-breadcrumbs__list-item" key={crumb.to}>
            {i < crumbs.length - 1 ? (
              <Link className="govuk-breadcrumbs__link" to={crumb.to}>
                {crumb.text}
              </Link>
            ) : (
              <span aria-current="page">{crumb.text}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
