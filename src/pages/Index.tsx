import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [userRole, setUserRole] = useState<'contractor' | 'supervisor' | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-construction-blue to-construction-orange flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Icon name="HardHat" size={48} className="mx-auto text-construction-orange" />
            </div>
            <CardTitle className="text-2xl font-bold">СтройКонтроль</CardTitle>
            <p className="text-muted-foreground">Выберите вашу роль</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setUserRole('contractor')}
              className="w-full h-14 text-lg bg-construction-orange hover:bg-construction-light"
            >
              <Icon name="Wrench" className="mr-2" />
              Я Подрядчик
            </Button>
            <Button 
              onClick={() => setUserRole('supervisor')}
              variant="outline"
              className="w-full h-14 text-lg border-construction-blue text-construction-blue hover:bg-construction-blue hover:text-white"
            >
              <Icon name="ClipboardCheck" className="mr-2" />
              Я Технический заказчик
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'contractor') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-semibold text-lg">Школа №12</h1>
                <p className="text-sm text-muted-foreground">г. Сургут</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-construction-orange text-white">П</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Work Items */}
          <div className="space-y-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveProject('ventilation')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Монтаж вентиляции</h3>
                    <p className="text-sm text-muted-foreground">срок до 25.09</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">В процессе</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Укладка фундамента</h3>
                    <p className="text-sm text-muted-foreground">срок до 30.08</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Принято</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Монтаж окон</h3>
                    <p className="text-sm text-muted-foreground">срок до 15.10</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Завершено</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Detail Modal */}
          {activeProject === 'ventilation' && (
            <Card className="animate-slide-up border-construction-orange">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Монтаж вентиляции</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveProject(null)}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Описание выполненных работ..." />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Icon name="Mic" className="mr-2" size={16} />
                    Надиктовать
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="Camera" className="mr-2" size={16} />
                    Фото
                  </Button>
                </div>
                <Button className="w-full bg-construction-orange hover:bg-construction-light">
                  <Icon name="Send" className="mr-2" size={16} />
                  Отправить запись
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-md mx-auto flex justify-around py-2">
            <Button variant="ghost" className="flex-col gap-1 h-16">
              <Icon name="FileText" size={20} />
              <span className="text-xs">Журнал</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-16">
              <Icon name="Calendar" size={20} />
              <span className="text-xs">Сроки</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-16">
              <Icon name="Settings" size={20} />
              <span className="text-xs">Профиль</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Supervisor View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-xl">Панель Техзаказчика</h1>
              <p className="text-sm text-muted-foreground">Контроль строительных работ</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Icon name="Bot" className="mr-2" size={16} />
                ИИ Помощник
              </Button>
              <Avatar>
                <AvatarFallback className="bg-construction-blue text-white">Т</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Объекты</TabsTrigger>
            <TabsTrigger value="tasks">Работы</TabsTrigger>
            <TabsTrigger value="journal">Журнал</TabsTrigger>
            <TabsTrigger value="inspections">Проверки</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Школа №12, Сургут</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">В работе</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Начало: 01.08.2024</span>
                      <span>Окончание: 15.11.2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">ЖК Северный, Тюмень</CardTitle>
                    <Badge className="bg-green-100 text-green-800">Завершен</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Начало: 15.05.2024</span>
                      <span>Окончание: 20.08.2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-4 mt-6">
            <div className="space-y-4">
              <Card className="border-l-4 border-l-construction-orange">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-construction-orange text-white text-sm">ИП</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Иван Петров</span>
                        <Badge variant="outline" className="text-xs">15.08.2024</Badge>
                      </div>
                      <p className="text-sm mb-3">Уложено 50 м кабеля в вентшахте. Выполнена прокладка по 2 и 3 этажам согласно проекту.</p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Icon name="Check" className="mr-1" size={14} />
                          Принять
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Icon name="X" className="mr-1" size={14} />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">На проверке</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-construction-blue text-white text-sm">АС</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Андрей Смирнов</span>
                        <Badge variant="outline" className="text-xs">14.08.2024</Badge>
                      </div>
                      <p className="text-sm mb-3">Смонтировано 3 окна в классных комнатах. Проверена герметичность установки.</p>
                      <p className="text-xs text-muted-foreground italic">Принято техзаказчиком с комментарием: "Работа выполнена качественно"</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Принято</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inspections" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="ClipboardList" size={20} />
                    Проверка вентиляции
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Square" size={16} className="text-muted-foreground" />
                      <span>Проверить акты скрытых работ</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="CheckSquare" size={16} className="text-green-600" />
                      <span>Сделать фото системы</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Square" size={16} className="text-muted-foreground" />
                      <span>Проверить соответствие проекту</span>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Icon name="Play" className="mr-2" size={16} />
                      Начать проверку
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-construction-blue">
                    <Icon name="Bot" size={20} />
                    ИИ Помощник
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg text-sm">
                      <p><strong>💡 Рекомендация:</strong></p>
                      <p>При проверке вентиляции обратите внимание на СП 60.13330.2020 п. 7.1 - проверьте герметичность соединений.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-sm">
                      <p><strong>⚠️ Напоминание:</strong></p>
                      <p>В прошлый раз были замечания по креплению воздуховодов. Проверьте устранение.</p>
                    </div>
                    <Button className="w-full" size="sm">
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
    </div>
  );
};

export default Index;