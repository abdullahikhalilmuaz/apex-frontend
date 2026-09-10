"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  AtSign,
} from "lucide-react";

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 60px 32px 24px;
  color: rgba(255, 255, 255, 0.7);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto 40px;
`;

const Col = styled.div``;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
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

const BrandName = styled.div`
  color: white;
  font-weight: 700;
  font-size: 16px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.7;
  max-width: 320px;
`;

const Heading = styled.h4`
  color: white;
  font-size: 15px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const FooterLink = styled(Link)`
  display: block;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 0;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const ContactRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  margin-bottom: 12px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const SocialIcon = styled.a`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;

const Bottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
`;

export default function Footer() {
  return (
    <FooterContainer>
      <Grid>
        <Col>
          <LogoRow>
            <LogoIcon>
              <GraduationCap size={22} />
            </LogoIcon>
            <BrandName>Apex Global Academy</BrandName>
          </LogoRow>
          <Description>
            Nurturing bright minds for a brighter future. A leading primary
            school in Katsina, Nigeria, committed to quality education and
            character development.
          </Description>
          <SocialRow>
            <SocialIcon href="#" aria-label="Website">
              <Globe size={18} />
            </SocialIcon>
            <SocialIcon href="#" aria-label="Share">
              <Share2 size={18} />
            </SocialIcon>
            <SocialIcon href="#" aria-label="Email">
              <AtSign size={18} />
            </SocialIcon>
          </SocialRow>
        </Col>

        <Col>
          <Heading>Quick Links</Heading>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/admissions">Admissions</FooterLink>
          <FooterLink href="/gallery">Gallery</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </Col>

        <Col>
          <Heading>Portal</Heading>
          <FooterLink href="/login">Parent Login</FooterLink>
          <FooterLink href="/login">Teacher Login</FooterLink>
          <FooterLink href="/login">Headmaster Login</FooterLink>
        </Col>

        <Col>
          <Heading>Contact</Heading>
          <ContactRow>
            <MapPin size={18} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>
              Barhim, Mani Road, Katsina, <br /> Katsina State, Nigeria
            </span>
          </ContactRow>
          <ContactRow>
            <Phone size={18} style={{ flexShrink: 0 }} />
            <span>+234 800 000 0000</span>
          </ContactRow>
          <ContactRow>
            <Mail size={18} style={{ flexShrink: 0 }} />
            <span>info@apexglobalacademy.com</span>
          </ContactRow>
        </Col>
      </Grid>

      <Bottom>
        © {new Date().getFullYear()} Apex Global Academy. All rights reserved. |
        Built with excellence in Katsina, Nigeria.
      </Bottom>
    </FooterContainer>
  );
}
