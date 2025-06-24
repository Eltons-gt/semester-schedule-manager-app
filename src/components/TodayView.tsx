
import { CourseData, Course } from "./Course";

interface TodayViewProps {
  courses: CourseData[];
  onEdit: (course: CourseData) => void;
  onDelete: (id: string) => void;
}

export const TodayView = ({ courses, onEdit, onDelete }: TodayViewProps) => {
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayAbbr = dayNames[today.getDay()];
  
  const todayCourses = courses
    .filter(course => course.days.includes(todayAbbr))
    .sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

  const getCurrentStatus = (course: CourseData) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = course.startTime.split(':').map(Number);
    const endTime = course.endTime.split(':').map(Number);
    const courseStart = startTime[0] * 60 + startTime[1];
    const courseEnd = endTime[0] * 60 + endTime[1];
    
    if (currentTime < courseStart) return 'upcoming';
    if (currentTime >= courseStart && currentTime <= courseEnd) return 'current';
    return 'completed';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Today's Schedule
        </h2>
        <div className="text-sm text-gray-500">
          {today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {todayCourses.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-lg font-medium">No classes today!</p>
            <p className="text-sm">Enjoy your free day.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {todayCourses.map((course) => {
            const status = getCurrentStatus(course);
            return (
              <div
                key={course.id}
                className={`relative ${
                  status === 'current' 
                    ? 'ring-2 ring-blue-500 ring-opacity-50' 
                    : status === 'completed'
                    ? 'opacity-60'
                    : ''
                }`}
              >
                {status === 'current' && (
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
                <Course
                  course={course}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  compact={true}
                />
                {status === 'current' && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    In Progress
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
