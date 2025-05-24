import './App.css'
import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock, AlertTriangle, Plus, Edit3, Trash2, BarChart3, DollarSign, Filter, Bell, Search, Menu, X, CheckSquare, Square, User, Target, TrendingUp, Activity } from 'lucide-react';

const App = () => {
  // Todo el código de TaskMaster aquí...
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Diseñar interfaz de usuario',
      description: 'Crear mockups y wireframes para la nueva aplicación',
      assignee: 'Ana García',
      priority: 'alta',
      status: 'progreso',
      dueDate: '2025-05-30',
      progress: 75,
      budget: 2500,
      spent: 1200,
      project: 'Proyecto Alpha'
    },
    {
      id: 2,
      title: 'Implementar autenticación',
      description: 'Desarrollar sistema de login y registro',
      assignee: 'Carlos López',
      priority: 'alta',
      status: 'pendiente',
      dueDate: '2025-05-28',
      progress: 0,
      budget: 1800,
      spent: 0,
      project: 'Proyecto Alpha'
    },
    {
      id: 3,
      title: 'Testing de la aplicación',
      description: 'Realizar pruebas unitarias y de integración',
      assignee: 'María Rodríguez',
      priority: 'media',
      status: 'completada',
      dueDate: '2025-05-25',
      progress: 100,
      budget: 1200,
      spent: 1100,
      project: 'Proyecto Beta'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'media',
    dueDate: '',
    budget: '',
    project: ''
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Estadísticas calculadas
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completada').length,
    inProgressTasks: tasks.filter(t => t.status === 'progreso').length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completada').length,
    totalBudget: tasks.reduce((sum, t) => sum + (t.budget || 0), 0),
    totalSpent: tasks.reduce((sum, t) => sum + (t.spent || 0), 0)
  };

  const priorityColors = {
    alta: 'bg-red-100 text-red-800 border-red-200',
    media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    baja: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusColors = {
    pendiente: 'bg-gray-100 text-gray-800',
    progreso: 'bg-blue-100 text-blue-800',
    completada: 'bg-green-100 text-green-800'
  };

  const handleCreateTask = () => {
    if (newTask.title && newTask.assignee) {
      const task = {
        id: Date.now(),
        ...newTask,
        status: 'pendiente',
        progress: 0,
        spent: 0,
        budget: parseInt(newTask.budget) || 0
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        priority: 'media',
        dueDate: '',
        budget: '',
        project: ''
      });
      setShowTaskModal(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map(t => t.id === editingTask.id ? { ...newTask, id: editingTask.id } : t));
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'media',
      dueDate: '',
      budget: '',
      project: ''
    });
    setShowTaskModal(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'completada' ? 'pendiente' : 
                         t.status === 'pendiente' ? 'progreso' : 'completada';
        const newProgress = newStatus === 'completada' ? 100 : 
                           newStatus === 'progreso' ? 50 : 0;
        return { ...t, status: newStatus, progress: newProgress };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'todas' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const GanttChart = () => {
    const projectTasks = tasks.reduce((acc, task) => {
      if (!acc[task.project]) acc[task.project] = [];
      acc[task.project].push(task);
      return acc;
    }, {});
  
  return (
    // JSX de TaskMaster
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Diagrama de Gantt</h3>
        <div className="space-y-6">
          {Object.entries(projectTasks).map(([project, projectTaskList]) => (
            <div key={project} className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3 text-gray-700">{project}</h4>
              <div className="space-y-2">
                {projectTaskList.map(task => (
                  <div key={task.id} className="flex items-center space-x-4">
                    <div className="w-48 text-sm text-gray-600 truncate">{task.title}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className={`h-full rounded-full ${
                          task.status === 'completada' ? 'bg-green-500' :
                          task.status === 'progreso' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {task.progress}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{task.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Tareas</p>
              <p className="text-3xl font-bold">{stats.totalTasks}</p>
            </div>
            <CheckSquare className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Completadas</p>
              <p className="text-3xl font-bold">{stats.completedTasks}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">En Progreso</p>
              <p className="text-3xl font-bold">{stats.inProgressTasks}</p>
            </div>
            <Activity className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Vencidas</p>
              <p className="text-3xl font-bold">{stats.overdueTasks}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-200" />
          </div>
        </div>
      </div>

      {/* Gráfico de presupuesto */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Resumen de Presupuesto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Presupuesto Total</span>
              <span className="text-2xl font-bold text-gray-800">${stats.totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gastado</span>
              <span className="text-2xl font-bold text-red-600">${stats.totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Restante</span>
              <span className="text-2xl font-bold text-green-600">${(stats.totalBudget - stats.totalSpent).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray={`${(stats.totalSpent / stats.totalBudget) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">
                  {Math.round((stats.totalSpent / stats.totalBudget) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tareas recientes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Tareas Recientes</h3>
        <div className="space-y-3">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <button onClick={() => toggleTaskStatus(task.id)}>
                  {task.status === 'completada' ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> :
                    <Square className="h-5 w-5 text-gray-400" />
                  }
                </button>
                <div>
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.assignee} • {task.project}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TaskList = () => (
    <div className="space-y-6">
      {/* Controles de filtrado y búsqueda */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todas">Todas las tareas</option>
              <option value="pendiente">Pendientes</option>
              <option value="progreso">En progreso</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado a</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button onClick={() => toggleTaskStatus(task.id)} className="mr-3">
                        {task.status === 'completada' ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> :
                          <Square className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        }
                      </button>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.project}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          task.status === 'completada' ? 'bg-green-500' :
                          task.status === 'progreso' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{task.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {task.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-sm">
                      <div>${task.spent} / ${task.budget}</div>
                      <div className="text-xs text-gray-500">
                        {task.budget > 0 ? Math.round((task.spent / task.budget) * 100) : 0}% usado
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
            <button 
              onClick={() => {
                setShowTaskModal(false);
                setEditingTask(null);
                setNewTask({
                  title: '',
                  description: '',
                  assignee: '',
                  priority: 'media',
                  dueDate: '',
                  budget: '',
                  project: ''
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título de la tarea</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Ingresa el título de la tarea"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Descripción de la tarea"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asignado a</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  placeholder="Nombre del responsable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proyecto</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTask.project}
                  onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  placeholder="Nombre del proyecto"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de vencimiento</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTask.budget}
                  onChange={(e) => setNewTask({...newTask, budget: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => {
                setShowTaskModal(false);
                setEditingTask(null);
                setNewTask({
                  title: '',
                  description: '',
                  assignee: '',
                  priority: 'media',
                  dueDate: '',
                  budget: '',
                  project: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingTask ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">TaskMaster</h1>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-8">
        <div className="px-6 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === 'tasks' ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="h-5 w-5 mr-3" />
            Tareas
          </button>
          
          <button
            onClick={() => setActiveTab('gantt')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === 'gantt' ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Gantt
          </button>
          
          <button
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === 'resources' ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Recursos
          </button>
          
          <button
            onClick={() => setActiveTab('budget')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === 'budget' ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <DollarSign className="h-5 w-5 mr-3" />
            Presupuesto
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === 'notifications' ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell className="h-5 w-5 mr-3" />
            Notificaciones
          </button>
        </div>
      </nav>
    </div>
  );

  const ResourcesView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Gestión de Recursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Pérez', 'Sofia Torres'].map(person => {
            const personTasks = tasks.filter(t => t.assignee === person);
            const workload = personTasks.length;
            const completedTasks = personTasks.filter(t => t.status === 'completada').length;
            
            return (
              <div key={person} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {person.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{person}</h4>
                    <p className="text-sm text-gray-500">Desarrollador</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tareas asignadas</span>
                    <span className="text-sm font-medium">{workload}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completadas</span>
                    <span className="text-sm font-medium text-green-600">{completedTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${workload > 0 ? (completedTasks / workload) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const BudgetView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Análisis de Presupuesto</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.project}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Presupuesto</span>
                    <span className="text-sm font-medium">${task.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gastado</span>
                    <span className="text-sm font-medium text-red-600">${task.spent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Restante</span>
                    <span className="text-sm font-medium text-green-600">${task.budget - task.spent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (task.spent / task.budget) > 0.8 ? 'bg-red-500' : 
                        (task.spent / task.budget) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${task.budget > 0 ? (task.spent / task.budget) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-4">Resumen General</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Presupuesto Total</span>
                  <span className="font-semibold">${stats.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Gastado</span>
                  <span className="font-semibold text-red-600">${stats.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponible</span>
                  <span className="font-semibold text-green-600">${(stats.totalBudget - stats.totalSpent).toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-600">% Utilizado</span>
                  <span className="font-semibold">{Math.round((stats.totalSpent / stats.totalBudget) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsView = () => {
    const notifications = [
      {
        id: 1,
        type: 'warning',
        title: 'Tarea próxima a vencer',
        message: 'La tarea "Implementar autenticación" vence en 2 días',
        time: 'Hace 1 hora'
      },
      {
        id: 2,
        type: 'success',
        title: 'Tarea completada',
        message: 'María completó "Testing de la aplicación"',
        time: 'Hace 3 horas'
      },
      {
        id: 3,
        type: 'info',
        title: 'Nueva tarea asignada',
        message: 'Se te ha asignado una nueva tarea en Proyecto Alpha',
        time: 'Hace 5 horas'
      },
      {
        id: 4,
        type: 'warning',
        title: 'Presupuesto excedido',
        message: 'El proyecto Beta ha excedido el 80% del presupuesto',
        time: 'Hace 1 día'
      }
    ];

    const notificationColors = {
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      error: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Notificaciones y Recordatorios</h3>
          <div className="space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className={`border rounded-lg p-4 ${notificationColors[notification.type]}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{notification.title}</h4>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                  <span className="text-xs opacity-75">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeTab === 'gantt' ? 'Diagrama de Gantt' : 
                   activeTab === 'resources' ? 'Recursos' :
                   activeTab === 'budget' ? 'Presupuesto' :
                   activeTab === 'notifications' ? 'Notificaciones' :
                   activeTab}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  U
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'gantt' && <GanttChart />}
          {activeTab === 'resources' && <ResourcesView />}
          {activeTab === 'budget' && <BudgetView />}
          {activeTab === 'notifications' && <NotificationsView />}
        </main>
      </div>

      {/* Modal de nueva tarea */}
      {showTaskModal && <TaskModal />}
    </div>
  );
};

export default App;
