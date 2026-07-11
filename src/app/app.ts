import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  priority: string;
  createdAt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  tasks: Task[] = [];
  searchText = '';
  filter = 'All';

  constructor() {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

 addTask(taskName: string, priority: string) {

  if (!taskName.trim()) return;

  const task: Task = {
    id: Date.now(),
    name: taskName.trim(),
    completed: false,
    priority: priority,
    createdAt: new Date().toLocaleString()
  };

  this.tasks.unshift(task);
  this.saveTasks();

}

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  clearTasks() {

    if (confirm('Are you sure you want to delete all tasks?')) {
      this.tasks = [];
      localStorage.removeItem('tasks');
    }

  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  get filteredTasks(): Task[] {

    return this.tasks.filter(task => {

      const matchesSearch =
        task.name.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesFilter =
        this.filter === 'All' ||
        (this.filter === 'Completed' && task.completed) ||
        (this.filter === 'Pending' && !task.completed);

      return matchesSearch && matchesFilter;

    });

  }

}