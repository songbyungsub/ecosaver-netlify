import { Button, Nav, NavItem } from "reactstrap";
import { Link, useNavigate, useLocation } from "react-router-dom"

const navigation = [
  {
    title: "절감률 대시보드",
    href: "/Dashboard",
    icon: "bi bi-speedometer2",
  },
  {
    title: "실시간 전력량/전력비",
    href: "/Power",
    icon: "bi bi-lightning-charge-fill",
  },
  // {
  //   title: "국사_주차별 현황",
  //   href: "/Cost",
  //   icon: "bi bi-credit-card-fill",
  // },
  // {
  //   title: "차트연습",
  //   href: "/buttons",
  //   icon: "bi bi-hdd-stack",
  // },
  {
    title: "일일 리포트",
    href: "/report",
    icon: "bi bi-file-earmark-text",
  },
  // {
  //   title: "Grid",
  //   href: "/grid",
  //   icon: "bi bi-columns",
  // },
  // {
  //   title: "Table",
  //   href: "/table",
  //   icon: "bi bi-layout-split",
  // },
  // {
  //   title: "Forms",
  //   href: "/forms",
  //   icon: "bi bi-textarea-resize",
  // },
  // {
  //   title: "Breadcrumbs",
  //   href: "/breadcrumbs",
  //   icon: "bi bi-link",
  // },
  // {
  //   title: "About",
  //   href: "/about",
  //   icon: "bi bi-people",
  // },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const navigateTo = (path) => {
    navigate(path);
    // 페이지 이동 후 자동으로 새로고침
    window.location.reload();
  };

  return (
    <div className="bg-dark">
      <div className="d-flex">
        <Button
          color="white"
          className="ms-auto text-white d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-x"></i>
        </Button>
      </div>
      <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link py-3"
                }
                onClick={() => navigateTo(navi.href)}
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
