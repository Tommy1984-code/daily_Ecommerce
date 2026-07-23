import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Categories from "./pages/Product/Categories";
import CategoryGroups from "./pages/Product/CategoryGroups";
import Groups from "./pages/Product/Groups";
import GroupBrands from "./pages/Product/GroupBrands";
import Brands from "./pages/Product/Brands";
import CatalogItems from "./pages/Product/Items";
import Prices from "./pages/Product/Pages";
import Discounts from "./pages/Product/Discounts";
import Combos from "./pages/Product/Combos";
import ComboCreate from "./pages/Product/ComboCreate";
import ComboEdit from "./pages/Product/ComboEdit";
import TopItems from "./pages/Product/TopItems";
import LandMarkPrices from "./pages/Product/LandMarkPrices";
import LandMarkPriceCreate from "./pages/Product/LandMarkPriceCreate";
import FeaturedCategories from "./pages/Product/FeaturedCategories";
import FeaturedCategoriesAdd from "./pages/Product/FeaturedCategoriesAdd";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserManagement from "./pages/Users/UserManagement";
import RoleManagement from "./pages/Users/RoleManagement";
import NewOrders from "./pages/Orders/NewOrders";
import DeficiencyOrders from "./pages/Orders/DeficiencyOrders";
import PendingPaymentOrders from "./pages/Orders/PendingPaymentOrders";
import ProcessingOrders from "./pages/Orders/ProcessingOrders";
import DeliveredOrders from "./pages/Orders/DeliveredOrders";
import CanceledOrders from "./pages/Orders/CanceledOrders";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/orders/new" element={<NewOrders />} />
              <Route path="/orders/deficiency" element={<DeficiencyOrders />} />
              <Route path="/orders/pending-payment" element={<PendingPaymentOrders />} />
              <Route path="/orders/processing" element={<ProcessingOrders />} />
              <Route path="/orders/delivered" element={<DeliveredOrders />} />
              <Route path="/orders/canceled" element={<CanceledOrders />} />
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
              <Route path="/product/combos/:id/edit" element={<ComboEdit />} />
              <Route path="/product/top-items" element={<TopItems />} />
              <Route path="/product/land-mark-prices" element={<LandMarkPrices />} />
              <Route path="/product/land-mark-prices/new" element={<LandMarkPriceCreate />} />
              <Route path="/product/featured-categories" element={<FeaturedCategories />} />
              <Route path="/product/featured-categories/new" element={<FeaturedCategoriesAdd />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
