import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Clock, X, Plus, Search, Tag, Star, Filter, BarChart2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  date?: string;
  time?: string;
  priority: "low" | "medium" | "high";
  category?: string;
  tags: string[];
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("kelvi_todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("kelvi_todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === "") {
      toast({
        description: "Task cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      description: description.trim(),
      completed: false,
      priority,
      category: category.trim(),
      tags,
    };

    if (selectedDate) {
      todo.date = selectedDate;
    }

    if (selectedTime) {
      todo.time = selectedTime;
    }

    setTodos([...todos, todo]);
    setNewTodo("");
    setDescription("");
    setSelectedDate("");
    setSelectedTime("");
    setShowDateTimePicker(false);
    setPriority("medium");
    setCategory("");
    setTags([]);

    toast({
      description: "Task added successfully",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      description: "Task deleted",
    });
  };

  const clearCompletedTodos = () => {
    if (todos.some((todo) => todo.completed)) {
      setTodos(todos.filter((todo) => !todo.completed));
      toast({
        description: "Completed tasks cleared",
      });
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && !todo.completed;
    if (filter === "completed") return matchesSearch && todo.completed;
    return matchesSearch;
  });

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const highPriorityTodos = todos.filter((todo) => todo.priority === "high" && !todo.completed);
  const today = new Date().toISOString().split("T")[0];
  const dueToday = todos.filter((todo) => todo.date === today && !todo.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      case "low":
        return "border-l-4 border-l-green-500";
      default:
        return "border-l-4 border-l-gray-500";
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <CardWithHover title="To-Do List" description="Manage your tasks and assignments">
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filter} onValueChange={(value: "all" | "active" | "completed") => setFilter(value)}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setShowStats(!showStats)}>
                <BarChart2 className="h-4 w-4 mr-2" />
                Stats
              </Button>
            </div>

            {/* Stats Overview */}
            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeTodos.length}</div>
                  <div className="text-sm text-gray-500">Active Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{highPriorityTodos.length}</div>
                  <div className="text-sm text-gray-500">High Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{dueToday.length}</div>
                  <div className="text-sm text-gray-500">Due Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedTodos.length}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            )}

            {/* Add New Task */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTodo();
                    }
                  }}
                />
                <Button onClick={addTodo} className="gradient-blue">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                placeholder="Add description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                  <SelectTrigger>
                    <Star className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className={`${getPriorityColor("low")} hover:${getPriorityColor("low")} focus:${getPriorityColor("low")}`}>
                      Low Priority
                    </SelectItem>
                    <SelectItem value="medium" className={`${getPriorityColor("medium")} hover:${getPriorityColor("medium")} focus:${getPriorityColor("medium")}`}>
                      Medium Priority
                    </SelectItem>
                    <SelectItem value="high" className={`${getPriorityColor("high")} hover:${getPriorityColor("high")} focus:${getPriorityColor("high")}`}>
                      High Priority
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Category (optional)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Add tags (press Enter)"
                    value={tags.join(", ")}
                    onChange={(e) => {
                      const newTags = e.target.value.split(",").map(tag => tag.trim());
                      setTags(newTags);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newTag = e.currentTarget.value.split(",").pop()?.trim();
                        if (newTag) {
                          addTag(newTag);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {showDateTimePicker ? (
                <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Add deadline</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowDateTimePicker(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowDateTimePicker(true)}
                  className="w-full"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Date & Time
                </Button>
              )}
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTodos.length > 0 ? (
                <div className="space-y-4">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`p-4 rounded-lg border ${
                        todo.completed ? "bg-gray-50" : "bg-white"
                      } ${getPriorityBorderColor(todo.priority)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className={`${todo.completed ? "line-through text-gray-500" : ""}`}>
                            {todo.text}
                          </div>
                          {todo.description && (
                            <div className="text-sm text-gray-600">
                              {todo.description}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {todo.category && (
                              <Badge variant="outline">{todo.category}</Badge>
                            )}
                            {todo.priority && (
                              <Badge className={`${getPriorityColor(todo.priority)} border`}>
                                {todo.priority} priority
                              </Badge>
                            )}
                            {todo.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                            {(todo.date || todo.time) && (
                              <div className="text-xs text-gray-500 flex items-center space-x-2">
                                {todo.date && (
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(todo.date).toLocaleDateString()}
                                  </span>
                                )}
                                {todo.time && (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {todo.time}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="font-medium">No tasks found</div>
                  <p className="text-sm mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Add a task to get started"}
                  </p>
                </div>
              )}
            </div>

            {/* Clear Completed Button */}
            {completedTodos.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCompletedTodos}
                className="w-full"
              >
                Clear Completed Tasks
              </Button>
            )}
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
