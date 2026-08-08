import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import {
  UtensilsCrossed,
  BookOpen,
  Bot,
  User,
  LogOut,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="w-full bg-white border-b border-[#E7E0D9]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 h-16 flex items-center justify-between">

        {/* =========================
            LEFT — RECIPE BOOK
        ========================= */}
        <Link
          to="/"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          {/* Orange crossed-utensils logo */}
          <UtensilsCrossed
            className="w-[17px] h-[17px]"
            strokeWidth={2}
            style={{ color: '#C85A1C' }}
          />

          {/* Serif Recipe Book title */}
          <span
            className="text-[17px] font-semibold tracking-tight"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              color: '#24211F',
            }}
          >
            Recipe Book
          </span>
        </Link>

        {/* =========================
            RIGHT — NAVIGATION
        ========================= */}
        <nav className="flex items-center gap-1.5 sm:gap-2">

          {/* Cookbook */}
          <Link
            to="/cookbook"
            aria-label="My Cookbook"
            title="My Cookbook"
            className="p-2 rounded-full text-[#625C57] hover:text-[#C85A1C] hover:bg-[#FAF3ED] transition-all duration-200"
          >
            <BookOpen
              className="w-[18px] h-[18px]"
              strokeWidth={1.8}
            />
          </Link>

          {/* AI Recipe Generator */}
          <Link
            to="/generate"
            aria-label="AI Recipe Generator"
            title="AI Recipe Generator"
            className="p-2 rounded-full text-[#625C57] hover:text-[#C85A1C] hover:bg-[#FAF3ED] transition-all duration-200"
          >
            <Bot
              className="w-[18px] h-[18px]"
              strokeWidth={1.8}
            />
          </Link>

          {/* =========================
              AUTHENTICATED USER
          ========================= */}
          {user ? (
            <>
              {/* Profile */}
              <div
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full text-[#625C57]"
                title={user.name}
              >
                <div className="w-7 h-7 rounded-full bg-[#F8E8DC] flex items-center justify-center text-[#C85A1C]">
                  <User
                    className="w-[15px] h-[15px]"
                    strokeWidth={1.8}
                  />
                </div>

                <span className="hidden sm:block text-xs font-medium">
                  {user.name}
                </span>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="p-2 rounded-full text-[#625C57] hover:text-[#C85A1C] hover:bg-[#FAF3ED] transition-all duration-200"
              >
                <LogOut
                  className="w-[18px] h-[18px]"
                  strokeWidth={1.8}
                />
              </button>
            </>
          ) : (
            /* =========================
               LOGGED OUT
            ========================= */
            <Link
              to="/login"
              aria-label="Login"
              title="Login"
              className="flex items-center gap-2 ml-1 px-4 py-2 rounded-full bg-[#F47A32] text-white text-sm font-semibold hover:bg-[#E96820] transition-colors"
            >
              <User
                className="w-4 h-4"
                strokeWidth={1.8}
              />

              <span>Login</span>
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
}