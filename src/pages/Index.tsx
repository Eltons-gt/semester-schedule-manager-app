
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, LogOut, User } from "lucide-react";
import { CourseForm } from "@/components/CourseForm";
import { WeeklyView } from "@/components/WeeklyView";
import { TodayView } from "@/components/TodayView";
import { Course, CourseData } from "@/components/Course";
import { useToast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const { toast } = useToast();
  const { courses, loading, saveCourse, deleteCourse } = useCourses();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSaveCourse = async (courseData: Omit<CourseData, 'id'> & { id?: string }) => {
    await saveCourse(courseData);
    
    if (courseData.id) {
      toast({
        title: "Course updated",
        description: `${courseData.name} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Course added",
        description: `${courseData.name} has been added to your timetable.`,
      });
    }
    
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEditCourse = (course: CourseData) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = async (id: string) => {
    const courseToDelete = courses.find(c => c.id === id);
    await deleteCourse(id);
    toast({
      title: "Course deleted",
      description: `${courseToDelete?.name} has been removed from your timetable.`,
      variant: "destructive",
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your timetable...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <CourseForm
            course={editingCourse}
            onSave={handleSaveCourse}
            onCancel={handleCancelForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Semester Timetable Manager
              </h1>
              <p className="text-gray-600">
                Organize and track your academic schedule with ease
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {user.email}
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No courses added yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start building your semester timetable by adding your first course
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Course
            </Button>
          </div>
        ) : (
          // Main content with tabs
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="today" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="all">All Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <TodayView
                courses={courses}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            </TabsContent>

            <TabsContent value="weekly">
              <WeeklyView courses={courses} />
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Courses ({courses.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Course
                      key={course.id}
                      course={course}
                      onEdit={handleEditCourse}
                      onDelete={handleDeleteCourse}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
