"use client";

import Sidebar from "@/components/ui/shared/Sidebar";
import styled from "@emotion/styled";

const MainContent = styled.div`
  margin-left: 0;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  
  @media (min-width: 768px) {
    margin-left: 280px;
    width: calc(100% - 280px);
  }
`;

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar />
      <MainContent>{children}</MainContent>
    </div>
  );
}