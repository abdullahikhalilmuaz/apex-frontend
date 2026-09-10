'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api/client';
import styled from '@emotion/styled';
import { Eye, FileText, Search } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

const NoteCard = styled(GlassCard)`
  padding: 20px;
  margin-bottom: 16px;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const NoteTitle = styled.h3`
  color: white;
  font-size: 18px;
`;

const NoteTeacher = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const NoteMeta = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 8px;
`;

const NoteContent = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const Select = styled.select`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  margin-bottom: 20px;
  width: 200px;
  margin-right: 12px;
  
  option {
    color: black;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export default function HeadmasterLessonNotes() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');

  const classes = ['All', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
  const subjects = ['All', 'English', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies'];

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notes, filterClass, filterSubject]);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/lesson-notes/all');
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = notes;
    if (filterClass !== 'All') {
      filtered = filtered.filter(n => n.class === filterClass);
    }
    if (filterSubject !== 'All') {
      filtered = filtered.filter(n => n.subject === filterSubject);
    }
    setFilteredNotes(filtered);
  };

  if (loading) return <Container><div style={{color:'white'}}>Loading...</div></Container>;

  return (
    <Container>
      <Title>📝 All Lesson Notes</Title>
      <Subtitle>View all teachers' lesson notes</Subtitle>

      <FilterSection>
        <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </FilterSection>

      {filteredNotes.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: 'center' }}>
          <FileText size={48} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No lesson notes found</p>
        </GlassCard>
      ) : (
        filteredNotes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NoteCard>
              <NoteHeader>
                <NoteTitle>{note.topic}</NoteTitle>
                <NoteTeacher>👨‍🏫 {note.teacherId?.userId?.name || 'Unknown'}</NoteTeacher>
              </NoteHeader>
              <NoteMeta>
                {note.class} • {note.subject} • {new Date(note.date).toLocaleDateString()}
              </NoteMeta>
              <NoteContent>{note.introduction?.substring(0, 150)}...</NoteContent>
              {note.objectives?.length > 0 && (
                <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  Objectives: {note.objectives.slice(0, 2).join(', ')}
                  {note.objectives.length > 2 && ` +${note.objectives.length - 2} more`}
                </div>
              )}
            </NoteCard>
          </motion.div>
        ))
      )}
    </Container>
  );
}