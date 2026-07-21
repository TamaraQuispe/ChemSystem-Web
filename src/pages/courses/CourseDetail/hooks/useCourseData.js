import { useState, useEffect } from 'react';
import api from '../../../../services/api';

export const useCourseData = (courseSlug) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseSlug) return;
    setLoading(true);
    api.get(`/courses/${courseSlug}/tree`)
      .then(r => setData(r.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseSlug]);

  return { data, loading, error };
};
