
import { Clock, MapPin, User, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface CourseData {
  id: string;
  name: string;
  instructor: string;
  location: string;
  startTime: string;
  endTime: string;
  days: string[];
  color: string;
}

interface CourseProps {
  course: CourseData;
  onEdit: (course: CourseData) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export const Course = ({ course, onEdit, onDelete, compact = false }: CourseProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: course.color }}
              />
              <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                {course.name}
              </h3>
            </div>
            
            <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(course.startTime)} - {formatTime(course.endTime)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{course.location}</span>
              </div>
              
              {!compact && (
                <div className="flex gap-1 mt-2">
                  {course.days.map((day) => (
                    <span 
                      key={day}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {!compact && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(course)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(course.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
