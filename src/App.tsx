import { useState, useEffect } from 'react';
import { Check, Trash2, Plus, Sparkles, Trash, Edit2, X } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
    setPriority('medium');
  };

  const updateTodo = (id: string) => {
    if (editText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const clearAll = () => {
    setTodos([]);
    setShowClearConfirm(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingId) {
        updateTodo(editingId);
      } else {
        addTodo();
      }
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      updateTodo(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <style>{`
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .check-animated:hover {
          animation: checkBounce 0.4s ease-in-out;
        }
      `}</style>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={32} className="text-yellow-200" />
              <h1 className="text-3xl font-bold">我的待办清单</h1>
            </div>
            <p className="text-blue-100">让每一天都充满成就感</p>
          </div>

          <div className="p-6">
            <div className="mb-6 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="今天要做什么？"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors bg-white"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                >
                  <Plus size={20} />
                  添加任务
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">未完成:</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                    {activeCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">已完成:</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    {completedCount}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {completedCount > 0 && (
                  <button
                    onClick={clearCompleted}
                    className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <Trash size={14} />
                    清空已完成
                  </button>
                )}
                {todos.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <Trash size={14} />
                    全部清空
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {todos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">✨</div>
                  <p className="text-lg text-gray-600 font-semibold">还没有任务呢</p>
                  <p className="text-gray-400 mt-2">添加你的第一个任务，开始变得更有效率吧！</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id}>
                    {editingId === todo.id ? (
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                          autoFocus
                          className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
                        />
                        <button
                          onClick={() => updateTodo(todo.id)}
                          className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all check-animated ${
                            todo.completed
                              ? 'bg-purple-500 border-purple-500 scale-110'
                              : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          {todo.completed && <Check size={16} className="text-white" />}
                        </button>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          {getPriorityLabel(todo.priority)}优先级
                        </span>

                        <span
                          className={`flex-1 transition-all ${
                            todo.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-700'
                          }`}
                        >
                          {todo.text}
                        </span>

                        <button
                          onClick={() => startEdit(todo.id, todo.text)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 size={18} />
                        </button>

                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {showClearConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
                  <p className="text-lg font-semibold text-gray-800 mb-4">确定要清空所有任务吗？</p>
                  <p className="text-gray-600 text-sm mb-6">这个操作无法撤销。</p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      确定清空
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
