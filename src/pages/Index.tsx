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

interface WorkItem {
  id: string;
  title: string;
  deadline: string;
  status: 'in-progress' | 'completed' | 'accepted' | 'overdue';
  progress: number;
}

interface JournalEntry {
  id: string;
  contractor: string;
  date: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  comment?: string;
}

const Index = () => {
  const [userRole, setUserRole] = useState<'contractor' | 'supervisor' | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [newEntryText, setNewEntryText] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  // Mock data
  const [workItems, setWorkItems] = useState<WorkItem[]>([
    { id: 'ventilation', title: 'Монтаж вентиляции', deadline: '25.09.2024', status: 'in-progress', progress: 65 },
    { id: 'foundation', title: 'Укладка фундамента', deadline: '30.08.2024', status: 'accepted', progress: 100 },
    { id: 'windows', title: 'Монтаж окон', deadline: '15.10.2024', status: 'completed', progress: 100 }
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      contractor: 'Иван Петров',
      date: '15.08.2024',
      description: 'Уложено 50 м кабеля в вентшахте. Выполнена прокладка по 2 и 3 этажам согласно проекту.',
      status: 'pending'
    },
    {
      id: '2', 
      contractor: 'Андрей Смирнов',
      date: '14.08.2024',
      description: 'Смонтировано 3 окна в классных комнатах. Проверена герметичность установки.',
      status: 'accepted',
      comment: 'Работа выполнена качественно'
    }
  ]);

  const handleAddEntry = () => {
    if (newEntryText.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        contractor: 'Текущий пользователь',
        date: new Date().toLocaleDateString('ru-RU'),
        description: newEntryText,
        status: 'pending'
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setNewEntryText('');
      setActiveProject(null);
    }
  };

  const handleEntryAction = (entryId: string, action: 'accept' | 'reject', comment?: string) => {
    setJournalEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, status: action === 'accept' ? 'accepted' : 'rejected', comment }
        : entry
    ));
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
                <h1 className="font-bold text-xl text-gray-800">Школа №12</h1>
                <p className="text-construction-blue font-medium">г. Сургут</p>
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
        <div className="max-w-md mx-auto p-6 space-y-6">
          {/* Work Items */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Icon name="ListTodo" size={20} className="text-construction-orange" />
              Мои работы
            </h2>
            
            {workItems.map((item) => (
              <Card 
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-l-4 border-l-construction-orange" 
                onClick={() => setActiveProject(item.id)}
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

          {/* Work Detail Modal */}
          {activeProject && (
            <Card className="animate-slide-up border-2 border-construction-orange shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-construction-blue">
                    {workItems.find(item => item.id === activeProject)?.title}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveProject(null)}>
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
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Button variant="ghost" className="flex-col gap-1 h-16 hover:bg-construction-orange/10">
              <Icon name="FileText" size={22} className="text-construction-orange" />
              <span className="text-xs font-medium">Журнал</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-16 hover:bg-construction-blue/10">
              <Icon name="Calendar" size={22} className="text-construction-blue" />
              <span className="text-xs font-medium">Сроки</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-16 hover:bg-gray-100">
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
          <TabsList className="grid w-full grid-cols-4 mb-6 h-12 bg-white shadow-md">
            <TabsTrigger value="projects" className="text-sm font-medium data-[state=active]:bg-construction-blue data-[state=active]:text-white">
              <Icon name="Building" className="mr-2" size={16} />
              Объекты
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-sm font-medium data-[state=active]:bg-construction-orange data-[state=active]:text-white">
              <Icon name="ListTodo" className="mr-2" size={16} />
              Работы
            </TabsTrigger>
            <TabsTrigger value="journal" className="text-sm font-medium data-[state=active]:bg-construction-blue data-[state=active]:text-white">
              <Icon name="FileText" className="mr-2" size={16} />
              Журнал
            </TabsTrigger>
            <TabsTrigger value="inspections" className="text-sm font-medium data-[state=active]:bg-construction-orange data-[state=active]:text-white">
              <Icon name="ClipboardCheck" className="mr-2" size={16} />
              Проверки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Школа №12, Сургут</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">В работе</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <img 
                        src="/img/30cb8d47-3c2d-40f9-99c2-3a851d42c7c7.jpg" 
                        alt="Школа №12" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Прогресс</span>
                      <span className="font-bold text-construction-blue">67%</span>
                    </div>
                    <Progress value={67} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Начало: 01.08.2024</span>
                      <span>Окончание: 15.11.2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">ЖК Северный, Тюмень</CardTitle>
                    <Badge className="bg-green-100 text-green-800">Завершен</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <img 
                        src="/img/0f9fc4e2-c428-404f-a729-bf058ab41db5.jpg" 
                        alt="ЖК Северный" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Прогресс</span>
                      <span className="font-bold text-green-600">100%</span>
                    </div>
                    <Progress value={100} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Начало: 15.05.2024</span>
                      <span>Окончание: 20.08.2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6 mt-6">
            <div className="space-y-4">
              {journalEntries.map((entry) => (
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
              ))}
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