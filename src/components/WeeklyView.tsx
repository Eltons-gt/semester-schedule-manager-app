
import { CourseData } from "./Course";

interface WeeklyViewProps {
  courses: CourseData[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyView = ({ courses }: WeeklyViewProps) => {
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCoursesForDay = (dayAbbr: string) => {
    return courses
      .filter(course => course.days.includes(dayAbbr))
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {DAYS.map((day, index) => (
          <div key={day} className="p-4 text-center border-r last:border-r-0 bg-gray-50">
            <div className="font-semibold text-gray-900">{day}</div>
            <div className="text-sm text-gray-500">{DAY_ABBR[index]}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 min-h-96">
        {DAY_ABBR.map((dayAbbr) => {
          const dayCourses = getCoursesForDay(dayAbbr);
          
          return (
            <div key={dayAbbr} className="border-r last:border-r-0 p-2 space-y-2">
              {dayCourses.map((course) => (
                <div
                  key={`${course.id}-${dayAbbr}`}
                  className="p-2 rounded text-white text-xs shadow-sm"
                  style={{ backgroundColor: course.color }}
                >
                  <div className="font-semibold truncate">{course.name}</div>
                  <div className="opacity-90">
                    {formatTime(course.startTime)} - {formatTime(course.endTime)}
                  </div>
                  <div className="opacity-80 truncate">{course.location}</div>
                </div>
              ))}
              
              {dayCourses.length === 0 && (
                <div className="text-gray-400 text-center py-8 text-sm">
                  No classes
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
