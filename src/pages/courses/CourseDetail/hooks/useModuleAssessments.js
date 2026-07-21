import { useState, useCallback } from 'react';
import api from '../../../../services/api';

export const useModuleAssessments = () => {
  const [moduleAssessments, setModuleAssessments] = useState({});

  const fetchAssessment = useCallback(async (moduleId) => {
    if (!moduleId) return null;
    try {
      const r = await api.get(`/courses/modules/${moduleId}/assessments`);
      const assessments = r.data || [];
      setModuleAssessments(prev => ({ ...prev, [moduleId]: assessments }));
      return assessments;
    } catch {
      return [];
    }
  }, []);

  return { moduleAssessments, fetchAssessment, setModuleAssessments };
};
