import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import Categories from "./pages/Product/Categories";
import CategoryGroups from "./pages/Product/CategoryGroups";
import GroupBrands from "./pages/Product/GroupBrands";
import Groups from "./pages/Product/Groups";
import Brands from "./pages/Product/Brands";
import CatalogItems from "./pages/Product/Items";
import Prices from "./pages/Product/Pages";
import Discounts from "./pages/Product/Discounts";
import Combos from "./pages/Product/Combos";
import ComboCreate from "./pages/Product/ComboCreate";
import TopItems from "./pages/Product/TopItems";
import LandMarkPrices from "./pages/Product/LandMarkPrices";
import LandMarkPriceCreate from "./pages/Product/LandMarkPriceCreate";
import FeaturedCategories from "./pages/Product/FeaturedCategories";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserManagement from "./pages/Users/UserManagement";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected dashboard routes — single AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/product/categories" element={<Categories />} />
              <Route path="/product/groups" element={<Groups />} />
              <Route path="/product/brands" element={<Brands />} />
              <Route path="/product/categories/:categoryId/groups" element={<CategoryGroups />} />
              <Route path="/product/groups/:groupId/brands" element={<GroupBrands />} />
              <Route path="/product/items" element={<CatalogItems />} />
              <Route path="/product/prices" element={<Prices />} />
              <Route path="/product/discounts" element={<Discounts />} />
              <Route path="/product/combos" element={<Combos />} />
              <Route path="/product/combos/new" element={<ComboCreate />} />
              <Route path="/product/top-items" element={<TopItems />} />
              <Route path="/product/land-mark-prices" element={<LandMarkPrices />} />
              <Route path="/product/land-mark-prices/new" element={<LandMarkPriceCreate />} />
              <Route path="/product/featured-categories" element={<FeaturedCategories />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
