import React from "react";
import { Link } from "react-router-dom";

function Header({
  isAdmin,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  return (
    <header
      style={{
        background: "#f8f9fa",
        padding: "10px 20px",
        borderBottom: "1px solid #e7e7e7",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: "none",
            "@media (max-width: 768px)": {
              display: "block",
              background: "none",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              marginRight: "10px",
            },
          }}
        >
          <div
            style={{
              width: "25px",
              height: "3px",
              background: "#333",
              marginBottom: "5px",
              transition: "0.3s",
            }}
          />
          <div
            style={{
              width: "25px",
              height: "3px",
              background: "#333",
              marginBottom: "5px",
              transition: "0.3s",
            }}
          />
          <div
            style={{
              width: "25px",
              height: "3px",
              background: "#333",
              transition: "0.3s",
            }}
          />
        </button>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src="/TriCities2015Logo.webp"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span
            className="header-title"
            style={{
              fontWeight: "bold",
              fontSize: "1.2em",
              marginRight: "20px",
              "@media (max-width: 768px)": {
                fontSize: "1em",
                marginRight: "10px",
                display: "none", // Hide text on small screens
              },
            }}
          >
            Tri cities area mpo tip/plan2050 projects
          </span>
        </Link>
      </div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          "@media (max-width: 768px)": {
            display: isMobileMenuOpen ? "flex" : "none",
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#f8f9fa",
            flexDirection: "column",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          },
        }}
      >
        {isAdmin ? (
          <button
            onClick={handleLogout}
            style={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "#333",
              marginRight: "15px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1em",
              "@media (max-width: 768px)": {
                margin: "10px 0",
              },
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "#333",
              marginRight: "15px",
              "@media (max-width: 768px)": {
                margin: "10px 0",
              },
            }}
          >
            Login as admin
          </Link>
        )}
        {isAdmin && (
          <>
            <Link
              to="/comments"
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#333",
                marginRight: "15px",
                "@media (max-width: 768px)": {
                  margin: "10px 0",
                },
              }}
            >
              View Comments
            </Link>
            <Link
              to="/projects"
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#333",
                "@media (max-width: 768px)": {
                  margin: "10px 0",
                },
              }}
            >
              View Projects
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
