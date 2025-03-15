"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getData } from "@/lib/apiHelper";



export function GameViewDialog({
  game,
  open,
  onOpenChange,
}) {
  if (!game) return null;
  const [levelsData, setLevelsData] = useState([]);
  useEffect(() => {
    const fetchLevels = async () => {
      const response = await getData(`games/levels?game_id=${game?.id}`);
      console.log(response);

      setLevelsData(response.data);
    };
    fetchLevels();
  }, [game]);

  // بيانات وهمية للمستويات والأسئلة
  // const levelsData = [
  //   { id: 1, level: "المستوى الأول", questions: 5, difficulty: "سهل" },
  //   { id: 2, level: "المستوى الثاني", questions: 7, difficulty: "متوسط" },
  //   { id: 3, level: "المستوى الثالث", questions: 10, difficulty: "صعب" },
  // ];
  // if (!levelsData) return null;

  // const questionsData = [
  //   {
  //     id: 1,
  //     level: "المستوى الأول",
  //     question: "أي من هذه الأطعمة صحي لمريض السكري؟",
  //     type: "اختيار متعدد",
  //   },
  //   {
  //     id: 2,
  //     level: "المستوى الأول",
  //     question: "ما هو الطعام الذي يحتوي على نسبة سكر عالية؟",
  //     type: "اختيار متعدد",
  //   },
  // ];
  // console.log(game);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]" style={{maxWidth:"800px"}}>
        <DialogHeader>
          <DialogTitle>عرض بيانات اللعبة</DialogTitle>
          <DialogDescription>
            عرض تفاصيل بيانات اللعبة {game.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={game.image}
              className="w-16 h-16 rounded-lg bg-[#ffac33] flex items-center justify-center text-white text-xl"
            />
            {/* {game.name?.charAt(0) || "ل"} */}

            <div>
              <h3 className="text-lg font-bold">{game.name}</h3>
              {/* <p className="text-sm text-gray-500">{game.description}</p> */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">اسم اللعبة</Label>
              <p className="font-medium">{game.name}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">تاريخ الانشاء</Label>
              <p className="font-medium">
                {new Date(game.created_at).toLocaleDateString("En-ca")}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">عدد المستويات</Label>
              <p className="font-medium">{game.levels_count}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">الحالة</Label>
              <p>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                  {game.is_enable === 1 ? "نشط" : "غير نشط"}
                </span>
              </p>
            </div>
          </div>

          <Tabs defaultValue="levels">
            <TabsList className="flex w-full ">
              <TabsTrigger value="levels" className="flex-1">المستويات</TabsTrigger>
              {/* <TabsTrigger value="questions">الأسئلة</TabsTrigger> */}
            </TabsList>
            <TabsContent value="levels">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>المستوى</TableHead>
                          <TableHead>عدد الأسئلة</TableHead>
                          <TableHead>حالة المستوى </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {levelsData.map((level) => (
                          <TableRow key={level?.id}>
                            <TableCell className="font-medium">
                              {level.title}
                            </TableCell>
                            <TableCell>{level.question_count}</TableCell>
                            <TableCell>
                              {" "}
                              <span
                                className={`px-2 py-1 rounded-full ${level.status === "published"
                                    ? "bg-green-100 text-green-800 "
                                    : "bg-red-100 text-red-800 "
                                  }  text-xs`}
                              >
                                {level.status === "published"
                                  ? "نشط"
                                  : "غير نشط"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* <TabsContent value="questions">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>المستوى</TableHead>
                          <TableHead>السؤال</TableHead>
                          <TableHead>النوع</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {questionsData.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>{question.level}</TableCell>
                            <TableCell className="font-medium">
                              {question.question}
                            </TableCell>
                            <TableCell>{question.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
