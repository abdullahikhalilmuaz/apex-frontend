"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "@emotion/styled";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  LogOut,
  Menu,
  X,
  BookOpen,
  MessageCircle,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SidebarOverlay = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;

  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 280px;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 16px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: transform 0.3s ease;

  @media (max-width: 767px) {
    transform: ${(props) =>
      props.isOpen ? "translateX(0)" : "translateX(-100%)"};
  }

  @media (min-width: 768px) {
    transform: translateX(0);
  }
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 60;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 10px;
  color: white;
  cursor: pointer;
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 40px;
  padding-left: 12px;
`;

const NavSection = styled.div`
  flex: 1;
`;

const NavItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${(props) => (props.active ? "white" : "rgba(255,255,255,0.6)")};
  background: ${(props) =>
    props.active ? "rgba(255,255,255,0.1)" : "transparent"};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.5);
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
  }
`;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const headmasterNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/headmaster" },
    { icon: Users, label: "Pupils", href: "/headmaster/pupils" },
    { icon: Calendar, label: "Attendance", href: "/headmaster/attendance" },
    { icon: Bell, label: "Announcements", href: "/headmaster/announcements" },
    { icon: BookOpen, label: "Scheme of Work", href: "/headmaster/scheme" },
    { icon: BookOpen, label: "Results", href: "/headmaster/results" }, // ← ADD THIS
    { icon: MessageCircle, label: "Messages", href: "/headmaster/messages" },
  ];

  const teacherNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
    { icon: Users, label: "My Pupils", href: "/teacher/pupils" },
    { icon: Calendar, label: "Attendance", href: "/teacher/attendance" },
    { icon: BookOpen, label: "Results", href: "/teacher/results" },
    { icon: Calendar, label: "Scheme of Work", href: "/teacher/scheme" },
    { icon: BookOpen, label: "Lesson Notes", href: "/teacher/lessons" },
    { icon: Bell, label: "Announcements", href: "/teacher/announcements" }, // ← ADD THIS
    { icon: MessageCircle, label: "Messages", href: "/teacher/messages" },
  ];

  const parentNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/parent" },
    { icon: Users, label: "My Children", href: "/parent/children" },
    { icon: Bell, label: "Announcements", href: "/parent/announcements" },
    { icon: MessageCircle, label: "Messages", href: "/parent/messages" },
  ];

  const getNavItems = () => {
    if (user?.role === "headmaster") return headmasterNavItems;
    if (user?.role === "teacher") return teacherNavItems;
    if (user?.role === "parent") return parentNavItems;
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </HamburgerButton>

      <SidebarOverlay isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <SidebarContainer isOpen={isOpen}>
        <Logo>🏫 ApexGlobal Academy</Logo>

        <NavSection>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              active={pathname === item.href}
            >
              <item.icon size={20} />
              {item.label}
            </NavItem>
          ))}
        </NavSection>

        <LogoutButton onClick={logout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </SidebarContainer>
    </>
  );
}
