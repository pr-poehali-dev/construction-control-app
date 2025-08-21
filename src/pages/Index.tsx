import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  image?: string;
}

interface WorkItem {
  id: string;
  projectId: string;
  title: string;
  deadline: string;
  status: 'in-progress' | 'completed' | 'accepted' | 'overdue';
  progress: number;
  assignedTo?: string;
}

interface JournalEntry {
  id: string;
  projectId: string;
  workItemId: string;
  contractor: string;
  date: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  comment?: string;
  photos?: string[];
}

interface Inspection {
  id: string;
  projectId: string;
  workItemId: string;
  title: string;
  checklist: ChecklistItem[];
  defects: Defect[];
  status: 'pending' | 'in-progress' | 'completed';
  inspector: string;
  date: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface Defect {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'fixed' | 'verified';
  photos?: string[];
}

const Index = () => {
  const [userRole, setUserRole] = useState<'contractor' | 'supervisor' | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [contractorTab, setContractorTab] = useState('projects');
  const [newEntryText, setNewEntryText] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [showInspection, setShowInspection] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(null);

  // Mock data
  const [projects] = useState<Project[]>([
    {
      id: 'school-12',
      name: 'Школа №12',
      location: 'г. Сургут',
      startDate: '01.08.2024',
      endDate: '15.11.2024',
      progress: 67,
      status: 'active',
      image: '/img/30cb8d47-3c2d-40f9-99c2-3a851d42c7c7.jpg'
    },
    {
      id: 'zhk-northern',
      name: 'ЖК Северный',
      location: 'г. Тюмень',
      startDate: '15.05.2024',
      endDate: '20.08.2024',
      progress: 100,
      status: 'completed',
      image: '/img/0f9fc4e2-c428-404f-a729-bf058ab41db5.jpg'
    }
  ]);

  const [workItems, setWorkItems] = useState<WorkItem[]>([
    { id: 'ventilation', projectId: 'school-12', title: 'Монтаж вентиляции', deadline: '25.09.2024', status: 'in-progress', progress: 65, assignedTo: 'Текущий пользователь' },
    { id: 'foundation', projectId: 'school-12', title: 'Укладка фундамента', deadline: '30.08.2024', status: 'accepted', progress: 100, assignedTo: 'Текущий пользователь' },
    { id: 'windows', projectId: 'zhk-northern', title: 'Монтаж окон', deadline: '15.10.2024', status: 'completed', progress: 100, assignedTo: 'Иван Петров' },
    { id: 'electrical', projectId: 'zhk-northern', title: 'Электромонтажные работы', deadline: '10.08.2024', status: 'accepted', progress: 100, assignedTo: 'Андрей Смирнов' }
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      projectId: 'school-12',
      workItemId: 'ventilation',
      contractor: 'Иван Петров',
      date: '15.08.2024',
      description: 'Уложено 50 м кабеля в вентшахте. Выполнена прокладка по 2 и 3 этажам согласно проекту.',
      status: 'pending'
    },
    {
      id: '2',
      projectId: 'zhk-northern',
      workItemId: 'windows',
      contractor: 'Андрей Смирнов',
      date: '14.08.2024',
      description: 'Смонтировано 3 окна в классных комнатах. Проверена герметичность установки.',
      status: 'accepted',
      comment: 'Работа выполнена качественно'
    }
  ]);

  const [inspections, setInspections] = useState<Inspection[]>([]);

  const handleAddEntry = () => {
    if (newEntryText.trim() && selectedWork && selectedProject) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        projectId: selectedProject,
        workItemId: selectedWork,
        contractor: 'Текущий пользователь',
        date: new Date().toLocaleDateString('ru-RU'),
        description: newEntryText,
        status: 'pending'
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setNewEntryText('');
      setSelectedWork(null);
      setSelectedProject(null);
    }
  };

  const handleEntryAction = (entryId: string, action: 'accept' | 'reject', comment?: string) => {
    setJournalEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, status: action === 'accept' ? 'accepted' : 'rejected', comment }
        : entry
    ));
  };

  const handleStartInspection = (projectId: string, workItemId: string) => {
    const workItem = workItems.find(w => w.id === workItemId);
    const project = projects.find(p => p.id === projectId);
    
    if (workItem && project) {
      const inspection: Inspection = {
        id: Date.now().toString(),
        projectId,
        workItemId,
        title: `Проверка: ${workItem.title}`,
        checklist: [
          { id: '1', title: 'Проверить соответствие проекту', completed: false },
          { id: '2', title: 'Проверить качество материалов', completed: false },
          { id: '3', title: 'Проверить качество выполнения', completed: false },
          { id: '4', title: 'Сделать фотофиксацию', completed: false }
        ],
        defects: [],
        status: 'in-progress',
        inspector: 'Технический заказчик',
        date: new Date().toLocaleDateString('ru-RU')
      };
      setCurrentInspection(inspection);
      setShowInspection(true);
    }
  };

  const handleCompleteInspection = () => {
    if (currentInspection) {
      setInspections(prev => [...prev, { ...currentInspection, status: 'completed' }]);
      setCurrentInspection(null);
      setShowInspection(false);
    }
  };

  const getProjectWorkItems = (projectId: string) => {
    return workItems.filter(work => work.projectId === projectId);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Неизвестный проект';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'accepted': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'overdue': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Завершено';
      case 'accepted': return 'Принято';
      case 'overdue': return 'Просрочено';
      case 'pending': return 'На проверке';
      case 'rejected': return 'Отклонено';
      default: return status;
    }
  };
  
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-construction-blue via-purple-500 to-construction-orange flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-construction-orange/20 rounded-full animate-pulse"></div>
              <Icon name="HardHat" size={64} className="mx-auto text-construction-orange relative z-10" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-construction-blue to-construction-orange bg-clip-text text-transparent">
              СтройКонтроль
            </CardTitle>
            <p className="text-muted-foreground mt-2">Выберите вашу роль для входа</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setUserRole('contractor')}
              className="w-full h-16 text-lg bg-gradient-to-r from-construction-orange to-construction-light hover:from-construction-light hover:to-construction-orange transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Icon name="Wrench" className="mr-3" size={24} />
              Я Подрядчик
            </Button>
            <Button 
              onClick={() => setUserRole('supervisor')}
              className="w-full h-16 text-lg bg-gradient-to-r from-construction-blue to-blue-600 hover:from-blue-600 hover:to-construction-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Icon name="ClipboardCheck" className="mr-3" size={24} />
              Я Технический заказчик
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'contractor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-md mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-xl text-gray-800">СтройКонтроль</h1>
                <p className="text-construction-blue font-medium">Подрядчик</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setUserRole(null)}
                  className="hover:bg-gray-100"
                >
                  <Icon name="LogOut" size={16} />
                </Button>
                <Avatar className="ring-2 ring-construction-orange">
                  <AvatarFallback className="bg-construction-orange text-white font-bold">П</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto p-6 space-y-6 pb-24">
          {contractorTab === 'projects' && (
            <>
              {!selectedProject ? (
                /* Projects List */
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Icon name="Building" size={20} className="text-construction-orange" />
                    Мои объекты
                  </h2>
                  
                  {projects.map((project) => {
                    const projectWorks = getProjectWorkItems(project.id).filter(w => w.assignedTo === 'Текущий пользователь');
                    const completedWorks = projectWorks.filter(w => w.status === 'accepted' || w.status === 'completed').length;
                    
                    if (projectWorks.length === 0) return null;
                    
                    return (
                      <Card 
                        key={project.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-l-4 border-l-construction-orange" 
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800">{project.name}</h3>
                              <p className="text-sm text-construction-blue font-medium">{project.location}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {projectWorks.length} работ • {completedWorks} завершено
                              </p>
                            </div>
                            <Badge className={project.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {project.status === 'active' ? 'В работе' : 'Завершен'}
                            </Badge>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Прогресс объекта</span>
                            <span>{project.progress}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                /* Project Works List */
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                      <Icon name="ArrowLeft" size={20} />
                    </Button>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {getProjectName(selectedProject)}
                      </h2>
                      <p className="text-sm text-gray-500">Мои работы на объекте</p>
                    </div>
                  </div>
                  
                  {getProjectWorkItems(selectedProject)
                    .filter(work => work.assignedTo === 'Текущий пользователь')
                    .map((item) => (
                    <Card 
                      key={item.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-l-4 border-l-construction-orange" 
                      onClick={() => setSelectedWork(item.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              срок до {item.deadline}
                            </p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Прогресс</span>
                          <span>{item.progress}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Work Detail Modal */}
              {selectedWork && (
                <Card className="animate-slide-up border-2 border-construction-orange shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-construction-blue">
                        {workItems.find(item => item.id === selectedWork)?.title}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedWork(null)}>
                        <Icon name="X" size={20} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Описание выполненных работ
                      </label>
                      <Textarea 
                        placeholder="Опишите выполненные работы..."
                        value={newEntryText}
                        onChange={(e) => setNewEntryText(e.target.value)}
                        className="min-h-[100px] focus:ring-2 focus:ring-construction-orange"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                        <Icon name="Mic" className="mr-2" size={16} />
                        Надиктовать
                      </Button>
                      <Button variant="outline" className="hover:bg-green-50 hover:border-green-300">
                        <Icon name="Camera" className="mr-2" size={16} />
                        Добавить фото
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleAddEntry}
                      disabled={!newEntryText.trim()}
                      className="w-full bg-gradient-to-r from-construction-orange to-construction-light hover:from-construction-light hover:to-construction-orange transition-all duration-300 h-12 text-lg font-semibold"
                    >
                      <Icon name="Send" className="mr-2" size={18} />
                      Отправить запись в журнал
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileText" size={20} className="text-construction-blue" />
                    Мои последние записи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {journalEntries.filter(entry => entry.contractor === 'Текущий пользователь').slice(0, 3).map(entry => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 truncate">{entry.description}</p>
                          <p className="text-xs text-gray-500">{entry.date}</p>
                        </div>
                        <Badge className={getStatusColor(entry.status)} variant="outline">
                          {getStatusText(entry.status)}
                        </Badge>
                      </div>
                    ))}
                    {journalEntries.filter(entry => entry.contractor === 'Текущий пользователь').length === 0 && (
                      <p className="text-center text-gray-500 py-4">Записей пока нет</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {contractorTab === 'schedule' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Icon name="Calendar" size={20} className="text-construction-blue" />
                Календарь работ
              </h2>
              
              {projects.map(project => {
                const myWorks = getProjectWorkItems(project.id).filter(w => w.assignedTo === 'Текущий пользователь');
                if (myWorks.length === 0) return null;
                
                return (
                  <Card key={project.id} className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {myWorks.map(work => {
                          const isOverdue = new Date(work.deadline.split('.').reverse().join('-')) < new Date() && work.status !== 'accepted';
                          return (
                            <div key={work.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{work.title}</h4>
                                <p className="text-sm text-gray-500">до {work.deadline}</p>
                              </div>
                              <Badge className={isOverdue ? 'bg-red-100 text-red-800' : getStatusColor(work.status)}>
                                {isOverdue ? 'Просрочено' : getStatusText(work.status)}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {contractorTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Icon name="User" size={20} className="text-gray-600" />
                Мой профиль
              </h2>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-16 h-16 ring-4 ring-construction-orange">
                      <AvatarFallback className="bg-construction-orange text-white font-bold text-xl">П</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">Подрядчик</h3>
                      <p className="text-construction-blue">Строительные работы</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Активных объектов</span>
                        <span className="font-bold text-construction-blue">{projects.filter(p => p.status === 'active').length}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Завершенных работ</span>
                        <span className="font-bold text-green-600">{workItems.filter(w => w.assignedTo === 'Текущий пользователь' && (w.status === 'accepted' || w.status === 'completed')).length}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">В процессе</span>
                        <span className="font-bold text-construction-orange">{workItems.filter(w => w.assignedTo === 'Текущий пользователь' && w.status === 'in-progress').length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Bell" className="mr-2" size={16} />
                    Уведомления
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Download" className="mr-2" size={16} />
                    Экспорт данных
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={() => setUserRole(null)}>
                    <Icon name="LogOut" className="mr-2" size={16} />
                    Выход
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Button 
              variant="ghost" 
              className={`flex-col gap-1 h-16 ${contractorTab === 'projects' ? 'bg-construction-orange/10' : 'hover:bg-construction-orange/10'}`}
              onClick={() => setContractorTab('projects')}
            >
              <Icon name="Building" size={22} className="text-construction-orange" />
              <span className="text-xs font-medium">Объекты</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex-col gap-1 h-16 ${contractorTab === 'schedule' ? 'bg-construction-blue/10' : 'hover:bg-construction-blue/10'}`}
              onClick={() => setContractorTab('schedule')}
            >
              <Icon name="Calendar" size={22} className="text-construction-blue" />
              <span className="text-xs font-medium">Сроки</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex-col gap-1 h-16 ${contractorTab === 'profile' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              onClick={() => setContractorTab('profile')}
            >
              <Icon name="Settings" size={22} className="text-gray-600" />
              <span className="text-xs font-medium">Профиль</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Supervisor View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl text-gray-800">Панель Техзаказчика</h1>
              <p className="text-construction-blue font-medium">Контроль строительных работ</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowAIHelper(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Icon name="Bot" className="mr-2" size={18} />
                ИИ Помощник
              </Button>
              <Button 
                variant="outline"
                onClick={() => setUserRole(null)}
                className="hover:bg-gray-100"
              >
                <Icon name="LogOut" size={16} />
              </Button>
              <Avatar className="ring-2 ring-construction-blue">
                <AvatarFallback className="bg-construction-blue text-white font-bold">Т</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 h-12 bg-white shadow-md">
            <TabsTrigger value="projects" className="text-sm font-medium data-[state=active]:bg-construction-blue data-[state=active]:text-white">
              <Icon name="Building" className="mr-1" size={14} />
              Объекты
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-sm font-medium data-[state=active]:bg-construction-orange data-[state=active]:text-white">
              <Icon name="ListTodo" className="mr-1" size={14} />
              Работы
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-sm font-medium data-[state=active]:bg-construction-blue data-[state=active]:text-white">
              <Icon name="Calendar" className="mr-1" size={14} />
              Сроки
            </TabsTrigger>
            <TabsTrigger value="journal" className="text-sm font-medium data-[state=active]:bg-construction-blue data-[state=active]:text-white">
              <Icon name="FileText" className="mr-1" size={14} />
              Журнал
            </TabsTrigger>
            <TabsTrigger value="inspections" className="text-sm font-medium data-[state=active]:bg-construction-orange data-[state=active]:text-white">
              <Icon name="ClipboardCheck" className="mr-1" size={14} />
              Проверки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
                      onClick={() => setSelectedProject(project.id)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">{project.name}, {project.location}</CardTitle>
                      <Badge className={project.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {project.status === 'active' ? 'В работе' : 'Завершен'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Icon name="Building" size={48} className="text-white opacity-70" />
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Прогресс</span>
                        <span className={`font-bold ${project.status === 'active' ? 'text-construction-blue' : 'text-green-600'}`}>
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Начало: {project.startDate}</span>
                        <span>Окончание: {project.endDate}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Работ: {getProjectWorkItems(project.id).length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 mt-6">
            {!selectedProject ? (
              <div className="text-center py-8">
                <Icon name="ArrowLeft" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Выберите объект для просмотра работ</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                    <Icon name="ArrowLeft" size={20} />
                  </Button>
                  <div>
                    <h3 className="font-bold text-xl">{getProjectName(selectedProject)}</h3>
                    <p className="text-gray-600">Работы на объекте</p>
                  </div>
                </div>
                
                {getProjectWorkItems(selectedProject).map(work => (
                  <Card key={work.id} className="shadow-lg border-l-4 border-l-construction-orange hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800 mb-2">{work.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              до {work.deadline}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={14} />
                              {work.assignedTo}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(work.status)}>
                            {getStatusText(work.status)}
                          </Badge>
                          {userRole === 'supervisor' && work.status === 'completed' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStartInspection(selectedProject, work.id)}
                              className="bg-construction-blue hover:bg-blue-600"
                            >
                              <Icon name="ClipboardCheck" className="mr-1" size={14} />
                              Проверить
                            </Button>
                          )}
                        </div>
                      </div>
                      <Progress value={work.progress} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">
                        Прогресс: {work.progress}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">График работ</h3>
              
              {projects.map(project => (
                <Card key={project.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={project.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {project.status === 'active' ? 'Активный' : 'Завершен'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{project.startDate} - {project.endDate}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={project.progress} className="h-3" />
                      <div className="text-sm text-gray-600 mb-4">Общий прогресс: {project.progress}%</div>
                      
                      <h4 className="font-medium text-gray-800 mb-3">Работы:</h4>
                      <div className="space-y-2">
                        {getProjectWorkItems(project.id).map(work => {
                          const isOverdue = new Date(work.deadline.split('.').reverse().join('-')) < new Date() && work.status !== 'accepted';
                          return (
                            <div key={work.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{work.title}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span>до {work.deadline}</span>
                                  <span>•</span>
                                  <span>{work.assignedTo}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-500">{work.progress}%</div>
                                <Badge className={isOverdue ? 'bg-red-100 text-red-800' : getStatusColor(work.status)}>
                                  {isOverdue ? 'Просрочено' : getStatusText(work.status)}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6 mt-6">
            <div className="space-y-4">
              {journalEntries.map((entry) => {
                const project = projects.find(p => p.id === entry.projectId);
                const workItem = workItems.find(w => w.id === entry.workItemId);
                
                return (
                  <Card key={entry.id} className="border-l-4 border-l-construction-orange shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="ring-2 ring-construction-orange">
                          <AvatarFallback className="bg-construction-orange text-white font-bold text-sm">
                            {entry.contractor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-gray-800">{entry.contractor}</span>
                            <Badge variant="outline" className="text-xs">{entry.date}</Badge>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-construction-blue font-medium">{project?.name} • {workItem?.title}</p>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">{entry.description}</p>
                          
                          {entry.status === 'pending' && userRole === 'supervisor' && (
                            <div className="flex items-center gap-3">
                              <Button 
                                size="sm" 
                                onClick={() => handleEntryAction(entry.id, 'accept')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Icon name="Check" className="mr-1" size={14} />
                                Принять
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleEntryAction(entry.id, 'reject', 'Нужны дополнительные фото')}
                              >
                                <Icon name="X" className="mr-1" size={14} />
                                Отклонить
                              </Button>
                            </div>
                          )}
                          
                          {entry.comment && (
                            <p className="text-sm text-muted-foreground italic mt-2 bg-gray-50 p-2 rounded">
                              Комментарий: "{entry.comment}"
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(entry.status)}>
                          {getStatusText(entry.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="inspections" className="space-y-6 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-construction-blue">
                    <Icon name="ClipboardList" size={22} />
                    Проверка вентиляции
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm p-2 rounded hover:bg-gray-50">
                      <Icon name="Square" size={18} className="text-muted-foreground" />
                      <span>Проверить акты скрытых работ</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-2 rounded bg-green-50">
                      <Icon name="CheckSquare" size={18} className="text-green-600" />
                      <span>Сделать фото системы</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-2 rounded hover:bg-gray-50">
                      <Icon name="Square" size={18} className="text-muted-foreground" />
                      <span>Проверить соответствие проекту</span>
                    </div>
                    <Button className="w-full mt-4 bg-construction-blue hover:bg-blue-600" variant="outline">
                      <Icon name="Play" className="mr-2" size={16} />
                      Начать проверку
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Icon name="Bot" size={22} />
                    ИИ Помощник активен
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-purple-500">
                      <p className="text-sm"><strong>💡 Рекомендация:</strong></p>
                      <p className="text-sm text-gray-700 mt-1">При проверке вентиляции обратите внимание на СП 60.13330.2020 п. 7.1 - проверьте герметичность соединений.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                      <p className="text-sm"><strong>⚠️ Напоминание:</strong></p>
                      <p className="text-sm text-gray-700 mt-1">В прошлый раз были замечания по креплению воздуховодов. Проверьте устранение.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                      <p className="text-sm"><strong>📊 Статистика проверок:</strong></p>
                      <p className="text-sm text-gray-700 mt-1">Проведено проверок: {inspections.length} • Найдено дефектов: {inspections.reduce((acc, inspection) => acc + inspection.defects.length, 0)}</p>
                    </div>
                    <Button 
                      onClick={() => setShowAIHelper(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Icon name="MessageCircle" className="mr-2" size={16} />
                      Задать вопрос ИИ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Inspection Dialog */}
      <Dialog open={showInspection} onOpenChange={setShowInspection}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-construction-blue">
              <Icon name="ClipboardCheck" size={24} />
              {currentInspection?.title}
            </DialogTitle>
          </DialogHeader>
          {currentInspection && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="CheckSquare" size={20} />
                      Чеклист проверки
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentInspection.checklist.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedInspection = { ...currentInspection };
                              updatedInspection.checklist[index].completed = !item.completed;
                              setCurrentInspection(updatedInspection);
                            }}
                          >
                            <Icon 
                              name={item.completed ? "CheckSquare" : "Square"} 
                              size={20} 
                              className={item.completed ? "text-green-600" : "text-gray-400"}
                            />
                          </Button>
                          <div className="flex-1">
                            <p className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {item.title}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Defects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="AlertTriangle" size={20} />
                      Дефекты и замечания
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentInspection.defects.map((defect) => (
                        <div key={defect.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{defect.title}</h4>
                            <Badge className={
                              defect.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              defect.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              defect.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {defect.severity === 'critical' ? 'Критично' :
                               defect.severity === 'high' ? 'Высокий' :
                               defect.severity === 'medium' ? 'Средний' : 'Низкий'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{defect.description}</p>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          const newDefect: Defect = {
                            id: Date.now().toString(),
                            title: 'Новый дефект',
                            description: '',
                            severity: 'medium',
                            status: 'open'
                          };
                          setCurrentInspection({
                            ...currentInspection,
                            defects: [...currentInspection.defects, newDefect]
                          });
                        }}
                      >
                        <Icon name="Plus" className="mr-2" size={16} />
                        Добавить дефект
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCompleteInspection}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Icon name="CheckCircle" className="mr-2" size={16} />
                  Завершить проверку
                </Button>
                <Button variant="outline" onClick={() => setShowInspection(false)}>
                  Отменить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Helper Dialog */}
      <Dialog open={showAIHelper} onOpenChange={setShowAIHelper}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-700">
              <Icon name="Bot" size={24} />
              ИИ Помощник по строительным нормам
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Здравствуйте! Я помогу вам с вопросами по строительным нормам и правилам контроля качества.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ваш вопрос:</label>
              <Textarea 
                placeholder="Например: Какие требования к креплению вентиляционных коробов?"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={!aiQuestion.trim()}
              >
                <Icon name="Send" className="mr-2" size={16} />
                Отправить вопрос
              </Button>
              <Button variant="outline" onClick={() => setShowAIHelper(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;