import { useState, useCallback } from 'react';
import api from '../../../../services/api';

export const useLessonLoader = () => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  const loadLesson = useCallback(async (lessonId) => {
    if (!lessonId || currentLesson === lessonId) return;
    setLessonLoading(true);
    setCurrentLesson(lessonId);
    try {
      const r = await api.get(`/courses/lessons/${lessonId}`);
      setLessonContent(r.data);
      return r.data;
    } catch {
      return null;
    } finally {
      setLessonLoading(false);
    }
  }, [currentLesson]);

  const clearLesson = useCallback(() => {
    setCurrentLesson(null);
    setLessonContent(null);
    setLessonLoading(false);
  }, []);

  return {
    currentLesson,
    lessonContent,
    lessonLoading,
    loadLesson,
    clearLesson,
    setCurrentLesson,
    setLessonContent,
  };
};
