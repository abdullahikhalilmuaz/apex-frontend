"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { Menu, X, GraduationCap } from "lucide-react";

const Nav = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.scrolled ? "rgba(20, 20, 40, 0.85)" : "transparent"};
  backdrop-filter: ${(props) => (props.scrolled ? "blur(20px)" : "none")};
  border-bottom: ${(props) =>
    props.scrolled ? "1px solid rgba(255,255,255,0.1)" : "none"};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 900px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(20, 20, 40, 0.95);
    backdrop-filter: blur(20px);
    padding: 24px;
    gap: 12px;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const LoginBtn = styled(Link)`
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 40px -12px rgba(102, 126, 234, 0.5);
  }
`;

const MenuBtn = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  padding: 8px;
  cursor: pointer;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
  }
`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Nav scrolled={scrolled}>
      <Logo href="/">
        <LogoIcon>
          <GraduationCap size={22} />
        </LogoIcon>
        Apex Global Academy
      </Logo>

      <MenuBtn onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </MenuBtn>

      <NavLinks isOpen={isOpen}>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/admissions">Admissions</NavLink>
        <NavLink href="/gallery">Gallery</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        <LoginBtn href="/login">Portal Login</LoginBtn>
      </NavLinks>
    </Nav>
  );
}