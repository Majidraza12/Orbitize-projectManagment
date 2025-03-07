"use client";
import { DialogFooter } from "./ui/dialog";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {createTask} from "@/actions/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { stat } from "fs";

const CreateTask = (projectId: { projectId: string }) => {
  const [formData, setFormData] = useState({
    task_name: "",
    description: "",
    status: "",
    dueDate: "",
    assignedTo: "",
    priority: "",
    category: "",
  });

  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Ensure we only render client-side after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.task_name ||
      !formData.description ||
      !formData.status ||
      !formData.dueDate ||
      !formData.assignedTo ||
      !formData.priority ||
      !formData.category
    ) {
      return toast.error("All fields are required");
    }
    const newFormData = new FormData();
    newFormData.append("task_name", formData.task_name);
    newFormData.append("description", formData.description);
    newFormData.append("status", formData.status);
    newFormData.append("dueDate", formData.dueDate);
    newFormData.append("assignedTo", formData.assignedTo);
    newFormData.append("priority", formData.priority);
    newFormData.append("category", formData.category);
    newFormData.append("project_id", projectId.projectId);
    console.log(newFormData);
    // Convert dueDate string to Date object for comparison
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for date comparison
    if (dueDate < today) {
      return toast.error("Due date cannot be in the past");
    }
    const { status, task } = await createTask(newFormData);
    if (status === "Success") {
      setFormData({
        task_name: "",
        description: "",
        status: "",
        dueDate: "",
        assignedTo: "",
        priority: "",
        category: "",
      });
      toast.success("Task created Successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 600);
      setDialogOpen(false);
      return
    }
    return toast.error(status || "Something went wrong");
  };

  if (!isClient) return null; // Avoid rendering until the client is ready

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task_name">Task Name</Label>
              <Input
                id="task_name"
                value={formData.task_name}
                onChange={(e) =>
                  setFormData({ ...formData, task_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                placeholder="Enter email address"
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
