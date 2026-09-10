"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Smartphone,
  Shield,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: white;
  padding-top: 72px;
`;

const Hero = styled.section`
  min-height: 90vh;
  padding: 80px 32px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 50px;
  font-size: 14px;
  color: #a5b4fc;
  margin-bottom: 24px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  max-width: 900px;

  span {
    background: linear-gradient(135deg, #667eea 0%, #a78bfa 50%, #f472b6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin-bottom: 40px;
  line-height: 1.7;
`;

const CTA = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 60px;
`;

const PrimaryBtn = styled(Link)`
  padding: 16px 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 25px 50px -12px rgba(102, 126, 234, 0.6);
  }
`;

const SecondaryBtn = styled(Link)`
  padding: 16px 36px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
  }
`;

const StatsBar = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  max-width: 900px;
  width: 100%;
`;

const StatBox = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
`;

const Section = styled.section`
  padding: 100px 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  text-align: center;
  margin-bottom: 16px;

  span {
    background: linear-gradient(135deg, #667eea 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  max-width: 700px;
  margin: 0 auto 60px;
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled(motion.div)`
  padding: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(102, 126, 234, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const CardText = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  line-height: 1.7;
`;

const CTASection = styled.section`
  padding: 80px 32px;
  text-align: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const CTATitle = styled.h2`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  margin-bottom: 16px;
`;

const CTAText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 17px;
  max-width: 600px;
  margin: 0 auto 32px;
  line-height: 1.7;
`;

const TestimonialCard = styled(Card)`
  position: relative;
`;

const Quote = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 20px;
`;

const Author = styled.div`
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const AuthorRole = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  color: #fbbf24;
`;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  return (
    <Container>
      {/* HERO */}
      <Hero>
        <Badge
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles size={16} /> Katsina's Premier Primary School
        </Badge>

        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Welcome to <span>Apex Global Academy</span>
        </HeroTitle>

        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Nurturing bright minds for a brighter future. A leading primary school
          in Katsina, Nigeria, committed to quality education, character
          development, and smart learning for every child.
        </HeroSubtitle>

        <CTA>
          <PrimaryBtn href="/admissions">
            Apply for Admission <ArrowRight size={20} />
          </PrimaryBtn>
          <SecondaryBtn href="/login">
            Portal Login
          </SecondaryBtn>
        </CTA>

        <StatsBar
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <StatBox>
            <StatValue>10+</StatValue>
            <StatLabel>Years of Excellence</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>25+</StatValue>
            <StatLabel>Qualified Teachers</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>500+</StatValue>
            <StatLabel>Happy Pupils</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>98%</StatValue>
            <StatLabel>Pass Rate</StatLabel>
          </StatBox>
        </StatsBar>
      </Hero>

      {/* ABOUT */}
      <Section id="about">
        <SectionTitle {...fadeUp}>
          Why Choose <span>Apex Global Academy</span>
        </SectionTitle>
        <SectionSubtitle {...fadeUp}>
          We combine modern teaching methods with strong moral values to shape
          the leaders of tomorrow.
        </SectionSubtitle>

        <Grid>
          <Card {...fadeUp}>
            <CardIcon>
              <GraduationCap size={28} />
            </CardIcon>
            <CardTitle>Quality Education</CardTitle>
            <CardText>
              A comprehensive Nigerian primary curriculum delivered by
              experienced and caring teachers.
            </CardText>
          </Card>

          <Card {...fadeUp}>
            <CardIcon>
              <Users size={28} />
            </CardIcon>
            <CardTitle>Small Class Sizes</CardTitle>
            <CardText>
              Individual attention for every pupil ensuring better
              understanding and academic growth.
            </CardText>
          </Card>

          <Card {...fadeUp}>
            <CardIcon>
              <BookOpen size={28} />
            </CardIcon>
            <CardTitle>Rich Curriculum</CardTitle>
            <CardText>
              English, Mathematics, Science, Social Studies, ICT, and
              extra-curricular activities.
            </CardText>
          </Card>

          <Card {...fadeUp}>
            <CardIcon>
              <Smartphone size={28} />
            </CardIcon>
            <CardTitle>Smart Learning Portal</CardTitle>
            <CardText>
              Parents and teachers get real-time access to attendance, results,
              and progress.
            </CardText>
          </Card>

          <Card {...fadeUp}>
            <CardIcon>
              <Shield size={28} />
            </CardIcon>
            <CardTitle>Safe Environment</CardTitle>
            <CardText>
              A secure, nurturing space where every child feels safe and valued.
            </CardText>
          </Card>

          <Card {...fadeUp}>
            <CardIcon>
              <Award size={28} />
            </CardIcon>
            <CardTitle>Proven Results</CardTitle>
            <CardText>
              Consistently excellent results in primary school examinations.
            </CardText>
          </Card>
        </Grid>
      </Section>

      {/* PROGRAMS */}
      <Section>
        <SectionTitle {...fadeUp}>
          Our <span>Programs</span>
        </SectionTitle>
        <SectionSubtitle {...fadeUp}>
          Complete primary education from Primary 1 through Primary 6.
        </SectionSubtitle>

        <Grid>
          {[
            "Primary 1 - Foundation",
            "Primary 2 - Building Blocks",
            "Primary 3 - Growing Minds",
            "Primary 4 - Expanding Knowledge",
            "Primary 5 - Advanced Learning",
            "Primary 6 - Excellence & Prep",
          ].map((p, i) => (
            <Card key={i} {...fadeUp}>
              <CardIcon>
                <CheckCircle size={28} />
              </CardIcon>
              <CardTitle>{p}</CardTitle>
              <CardText>
                Structured curriculum designed for each stage of your child's
                growth and development.
              </CardText>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <SectionTitle {...fadeUp}>
          What <span>Parents Say</span>
        </SectionTitle>
        <SectionSubtitle {...fadeUp}>
          Trusted by hundreds of families across Katsina State.
        </SectionSubtitle>

        <Grid>
          {[
            {
              text: "Apex Global Academy has transformed my child's learning. The teachers are dedicated and the smart portal keeps me informed every day.",
              name: "Mrs. Hauwa Ibrahim",
              role: "Parent, Primary 3",
            },
            {
              text: "The best decision we made was enrolling our daughter here. Her confidence and grades have improved tremendously.",
              name: "Mr. Aliyu Musa",
              role: "Parent, Primary 5",
            },
            {
              text: "Excellent environment, qualified teachers, and a perfect blend of academics and character building.",
              name: "Mrs. Amina Sani",
              role: "Parent, Primary 1",
            },
          ].map((t, i) => (
            <TestimonialCard key={i} {...fadeUp}>
              <Stars>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </Stars>
              <Quote>"{t.text}"</Quote>
              <Author>{t.name}</Author>
              <AuthorRole>{t.role}</AuthorRole>
            </TestimonialCard>
          ))}
        </Grid>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Ready to Enroll Your Child?</CTATitle>
        <CTAText>
          Join families who trust Apex Global Academy for their
          children's education. Admissions are now open.
        </CTAText>
        <CTA>
          <PrimaryBtn href="/admissions">
            Apply Now <ArrowRight size={20} />
          </PrimaryBtn>
          <SecondaryBtn href="/contact">Contact Us</SecondaryBtn>
        </CTA>
      </CTASection>
    </Container>
  );
}