
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "./Course";

interface CourseFormProps {
  course?: CourseData | null;
  onSave: (course: Omit<CourseData, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export const CourseForm = ({ course, onSave, onCancel }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    location: '',
    startTime: '',
    endTime: '',
    days: [] as string[],
    color: COLORS[0]
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        instructor: course.instructor,
        location: course.location,
        startTime: course.startTime,
        endTime: course.endTime,
        days: course.days,
        color: course.color
      });
    }
  }, [course]);

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.instructor && formData.days.length > 0) {
      onSave({
        ...formData,
        id: course?.id
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{course ? 'Edit Course' : 'Add New Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Computer Science 101"
              required
            />
          </div>

          <div>
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
              placeholder="e.g., Dr. Smith"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Room 101, Science Building"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Days</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={formData.days.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={day} className="text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {course ? 'Update' : 'Add'} Course
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
