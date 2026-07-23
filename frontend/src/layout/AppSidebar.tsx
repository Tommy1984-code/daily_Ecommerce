import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutGrid,
  ShoppingBag,
  ClipboardList,
  UserCircle,
  Lock,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <ShoppingBag size={20} />,
    name: "Products",
    subItems: [
      { name: "Categories", path: "/product/categories" },
      { name: "Groups", path: "/product/groups" },
      { name: "Brands", path: "/product/brands" },
      { name: "Featured Categories", path: "/product/featured-categories" },
      { name: "Items", path: "/product/items" },
      { name: "Prices", path: "/product/prices" },
      { name: "Discounts", path: "/product/discounts" },
      { name: "Combos", path: "/product/combos" },
      { name: "Top Products", path: "/product/top-items" },
      { name: "Land Mark Prices", path: "/product/land-mark-prices" },
    ],
  },
  {
    icon: <ClipboardList size={20} />,
    name: "Orders & Cart",
    subItems: [
      { name: "New Orders", path: "/orders/new" },
      { name: "Deficiency", path: "/orders/deficiency" },
      { name: "Pending Payment", path: "/orders/pending-payment" },
      { name: "Processing", path: "/orders/processing" },
      { name: "Delivered", path: "/orders/delivered" },
      { name: "Canceled", path: "/orders/canceled" },
    ],
  },
  {
    icon: <UserCircle size={20} />,
    name: "Users",
    path: "/users",
  },
  {
    icon: <Lock size={20} />,
    name: "Roles",
    path: "/roles",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev && prev.index === index ? null : { index }
    );
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const isSubmenuOpen = openSubmenu?.index === index;
        const hasActiveChild =
          nav.subItems?.some((s) => isActive(s.path)) ?? false;
        const isItemActive = nav.path ? isActive(nav.path) : hasActiveChild;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group w-full ${
                  isItemActive ? "menu-item-active" : "menu-item-inactive"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isItemActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="flex-1 text-left">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isSubmenuOpen ? "menu-item-arrow-active" : "menu-item-arrow-inactive"
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => { subMenuRefs.current[`${index}`] = el; }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-1 space-y-0.5 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-sidebar text-sidebar-foreground border-r border-border h-screen transition-all duration-300 ease-in-out z-50 
        ${
          isExpanded || isMobileOpen
            ? "w-[260px]"
            : isHovered
            ? "w-[260px]"
            : "w-[80px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center pt-5 pb-4">
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              src="/images/dailymart-logo.png"
              alt="Daily Mart"
              className="w-28 h-auto object-contain"
            />
          ) : (
            <img
              src="/images/dailymart-logo.png"
              alt="Daily Mart"
              className="w-7 h-auto object-contain"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="mb-4">
          <div className="flex flex-col gap-1">
            <div>
              <h2
                className={`mb-3 text-xs uppercase tracking-wider flex leading-[20px] text-muted-foreground ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal size={20} />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
