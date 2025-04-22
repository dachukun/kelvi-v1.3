
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Trash2, Calendar, Clock, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date?: string;
  time?: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("kelvi_todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
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
      completed: false,
    };

    if (selectedDate) {
      todo.date = selectedDate;
    }

    if (selectedTime) {
      todo.time = selectedTime;
    }

    setTodos([...todos, todo]);
    setNewTodo("");
    setSelectedDate("");
    setSelectedTime("");
    setShowDateTimePicker(false);

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

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <CardWithHover title="To-Do List" description="Manage your tasks and assignments">
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

            {showDateTimePicker && (
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
                <div className="flex gap-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {!showDateTimePicker && (
              <Button
                variant="outline"
                onClick={() => setShowDateTimePicker(true)}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add Date & Time
              </Button>
            )}

            {todos.length > 0 ? (
              <div className="space-y-2 mt-4">
                {activeTodos.length > 0 && (
                  <div className="space-y-1">
                    <div className="font-medium">Active</div>
                    {activeTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-start space-x-2 py-2"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div>{todo.text}</div>
                          {(todo.date || todo.time) && (
                            <div className="text-xs text-gray-500 mt-1 flex space-x-3">
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
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {completedTodos.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Completed</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearCompletedTodos}
                          className="h-auto py-1 px-2 text-xs"
                        >
                          Clear
                        </Button>
                      </div>
                      {completedTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-start space-x-2 py-2"
                        >
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="line-through text-gray-500">
                              {todo.text}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteTodo(todo.id)}
                            className="h-6 w-6"
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="font-medium">No tasks yet</div>
                <p className="text-sm mt-1">
                  Add a task to get started with your to-do list
                </p>
              </div>
            )}
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
