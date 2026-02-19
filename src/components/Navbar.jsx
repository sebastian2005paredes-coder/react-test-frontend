import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { label: "My Orders", path: "/my-orders" },
        { label: "Products", path: "/products" },
    ];

    return (
        <nav className="bg-white shadow-md px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">
                FR<span className="text-yellow-400">A</span>CT<span className="text-yellow-400">A</span>L
            </h1>
                {/* Desktop */}
                <div className="hidden md:flex gap-3">
                    {links.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === link.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-gray-600 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden mt-3 flex flex-col gap-2 px-2">
                    {links.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => { navigate(link.path); setMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
                                location.pathname === link.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
}

export default Navbar;