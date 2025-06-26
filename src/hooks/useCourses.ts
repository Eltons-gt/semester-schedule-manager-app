
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CourseData } from '@/components/Course';
import { useToast } from '@/hooks/use-toast';

export const useCourses = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform database data to match CourseData interface
      const transformedCourses: CourseData[] = data.map(course => ({
        id: course.id,
        name: course.name,
        instructor: course.instructor || '',
        location: course.location || '',
        startTime: course.start_time,
        endTime: course.end_time,
        days: course.days,
        color: course.color,
      }));

      setCourses(transformedCourses);
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save course to Supabase
  const saveCourse = async (courseData: Omit<CourseData, 'id'> & { id?: string }) => {
    if (!user) return;

    try {
      if (courseData.id) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            name: courseData.name,
            instructor: courseData.instructor,
            location: courseData.location,
            start_time: courseData.startTime,
            end_time: courseData.endTime,
            days: courseData.days,
            color: courseData.color,
            updated_at: new Date().toISOString(),
          })
          .eq('id', courseData.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([{
            user_id: user.id,
            name: courseData.name,
            instructor: courseData.instructor,
            location: courseData.location,
            start_time: courseData.startTime,
            end_time: courseData.endTime,
            days: courseData.days,
            color: courseData.color,
          }]);

        if (error) throw error;
      }

      // Refresh courses list
      await fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error saving course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete course from Supabase
  const deleteCourse = async (courseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh courses list
      await fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error deleting course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  return {
    courses,
    loading,
    saveCourse,
    deleteCourse,
    refreshCourses: fetchCourses,
  };
};
