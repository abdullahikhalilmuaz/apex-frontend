'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api/client';
import styled from '@emotion/styled';
import { Plus, Save, Trash2, Edit2 } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const SchemeCard = styled(GlassCard)`
  padding: 20px;
  margin-bottom: 16px;
`;

const SchemeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SchemeTitle = styled.h3`
  color: white;
  font-size: 18px;
`;

const SchemeMeta = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const WeekItem = styled.div<{ completed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  background: ${props => props.completed ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border-left: 3px solid ${props => props.completed ? '#34d399' : 'rgba(255,255,255,0.2)'};
`;

const WeekTopic = styled.span`
  color: white;
  font-size: 14px;
`;

const WeekStatus = styled.span<{ completed: boolean }>`
  font-size: 12px;
  color: ${props => props.completed ? '#34d399' : 'rgba(255,255,255,0.4)'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(GlassCard)`
  width: 90%;
  max-width: 600px;
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  margin-bottom: 12px;
  
  option {
    color: black;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  min-height: 60px;
  resize: vertical;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const AddWeekButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  width: 100%;
  margin-bottom: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const WeekRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const RemoveWeek = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: none;
  border-radius: 6px;
  color: #f87171;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
`;

export default function HeadmasterScheme() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    class: 'Primary 1',
    subject: 'Mathematics',
    term: 'First',
    session: '2024/2025',
    weeks: [{ weekNumber: 1, topic: '', subtopics: [] }]
  });

  const classes = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
  const subjects = ['English', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies'];
  const terms = ['First', 'Second', 'Third'];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await api.get('/schemes');
      setSchemes(res.data);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        weeks: formData.weeks.filter(w => w.topic.trim())
      };
      
      if (editing) {
        await api.put(`/schemes/${editing}`, data);
      } else {
        await api.post('/schemes', data);
      }
      fetchSchemes();
      setShowModal(false);
      setEditing(null);
      setFormData({
        class: 'Primary 1',
        subject: 'Mathematics',
        term: 'First',
        session: '2024/2025',
        weeks: [{ weekNumber: 1, topic: '', subtopics: [] }]
      });
    } catch (error) {
      console.error('Error saving scheme:', error);
      alert('Error saving scheme');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this scheme?')) {
      await api.delete(`/schemes/${id}`);
      fetchSchemes();
    }
  };

  const addWeek = () => {
    setFormData({
      ...formData,
      weeks: [...formData.weeks, { weekNumber: formData.weeks.length + 1, topic: '', subtopics: [] }]
    });
  };

  const removeWeek = (index) => {
    const newWeeks = formData.weeks.filter((_, i) => i !== index);
    newWeeks.forEach((w, i) => w.weekNumber = i + 1);
    setFormData({ ...formData, weeks: newWeeks });
  };

  const updateWeek = (index, field, value) => {
    const newWeeks = [...formData.weeks];
    newWeeks[index][field] = value;
    setFormData({ ...formData, weeks: newWeeks });
  };

  if (loading) return <Container><div style={{color:'white'}}>Loading...</div></Container>;

  return (
    <Container>
      <Header>
        <div>
          <Title>📚 Scheme of Work</Title>
          <Subtitle>Create and manage curriculum schemes</Subtitle>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} /> New Scheme
        </Button>
      </Header>

      {schemes.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No schemes created yet</p>
        </GlassCard>
      ) : (
        schemes.map((scheme) => (
          <motion.div
            key={scheme._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SchemeCard>
              <SchemeHeader>
                <div>
                  <SchemeTitle>{scheme.subject} - {scheme.class}</SchemeTitle>
                  <SchemeMeta>
                    Term: {scheme.term} • Session: {scheme.session}
                  </SchemeMeta>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button onClick={() => {
                    setEditing(scheme._id);
                    setFormData(scheme);
                    setShowModal(true);
                  }} style={{ padding: '6px 12px', fontSize: 12 }}>
                    <Edit2 size={14} /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(scheme._id)} style={{ padding: '6px 12px', fontSize: 12, background: 'rgba(239,68,68,0.5)' }}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </SchemeHeader>
              <div>
                {scheme.weeks?.map((week) => (
                  <WeekItem key={week.weekNumber} completed={week.completed || false}>
                    <WeekTopic>
                      Week {week.weekNumber}: {week.topic}
                    </WeekTopic>
                    <WeekStatus completed={week.completed || false}>
                      {week.completed ? '✅ Completed' : '⏳ Pending'}
                    </WeekStatus>
                  </WeekItem>
                ))}
              </div>
            </SchemeCard>
          </motion.div>
        ))
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', marginBottom: 24 }}>
              {editing ? 'Edit Scheme' : 'Create Scheme'}
            </h2>
            <form onSubmit={handleSubmit}>
              <Select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              >
                {terms.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
              <Input
                placeholder="Session (e.g., 2024/2025)"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                required
              />
              
              <h3 style={{ color: 'white', fontSize: 16, marginBottom: 12 }}>Weekly Topics</h3>
              {formData.weeks.map((week, index) => (
                <WeekRow key={index}>
                  <Input
                    placeholder={`Week ${index + 1} Topic`}
                    value={week.topic}
                    onChange={(e) => updateWeek(index, 'topic', e.target.value)}
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <RemoveWeek type="button" onClick={() => removeWeek(index)}>
                    ✕
                  </RemoveWeek>
                </WeekRow>
              ))}
              <AddWeekButton type="button" onClick={addWeek}>
                + Add Week
              </AddWeekButton>
              
              <Button type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={20} /> {editing ? 'Update' : 'Create'}
              </Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}