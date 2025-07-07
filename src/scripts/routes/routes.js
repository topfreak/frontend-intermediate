import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import LogoutHandler from "../pages/auth/logout-handler";
import FavoritesPage from "../pages/favorites/favorites-page";
import NotFoundPage from "../pages/not-found/not-found-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add-story": new AddStoryPage(),
  "/logout": new LogoutHandler(),
  "/favorites": new FavoritesPage(),
  "*": new NotFoundPage(),
};

export default routes;
