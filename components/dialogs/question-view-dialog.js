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


export function QuestionViewDialog({
  game,
  open,
  onOpenChange,
}) {
  if (!game) return null;

  // const [questionsData, setQuestionsData] = useState([]);
  const [answersData, setAnswersData] = useState([]);

  useEffect(() => {
    // if (!game || !game.game || !game.id) return; // Ensure the required data is available

    // const fetchQuestion = async () => {
    //   try {
    //     const response = await getData(
    //       `games/questions?game_id=${game.game.id}&level_id=${game.id}`
    //     );
    //     console.log(response);
    //     setQuestionsData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching questions:", error);
    //   }
    // };
    const fetchAnswer = async () => {
      try {
        const response = await getData(
          `games/answers?question_id=${game.id}`
        );
        console.log(response);
        setAnswersData(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchAnswer()
    // fetchQuestion();
  }, [game]);


  // if (!game || questionsData.length === 0) return <Spinner />;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]" style={{ maxWidth: "800px" }}>
        <DialogHeader>
          <DialogTitle>عرض بيانات السؤال</DialogTitle>
          <DialogDescription>
            عرض تفاصيل بيانات السؤال {game.text}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={game.image}
              className="w-16 h-16 rounded-lg bg-[#ffac33] flex items-center justify-center text-white text-xl"
            />
            <div>
              <h3 className="text-lg font-bold">{game.text}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">اسم اللعبة</Label>
              <p className="font-medium">{game.level.game.name}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">اسم المستوى</Label>
              <p className="font-medium">{game.level.title}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">تاريخ الانشاء</Label>
              <p className="font-medium">
                {new Date(game.created_at).toLocaleDateString("En-ca")}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-500"> النقاط</Label>
              <p className="font-medium">{game.points}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">نوع السؤال</Label>
              <p className="font-medium">{game.type}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">عرض السؤال</Label>
              <p className="font-medium">{game.answers_view === "text" ? "نص" : "صورة"}</p>
            </div>
            {/* <div>
              <Label className="text-sm text-gray-500">الحالة</Label>
              <p>
                <span
                  className={`px-2 py-1 rounded-full ${game.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }  text-xs`}
                >
                  {game.status === "published" ? "نشط" : "غير نشط"}
                </span>
              </p>
            </div> */}
          </div>

          <Tabs defaultValue="answers">
            <TabsList className="flex w-full grid-cols-1">
              {/* <TabsTrigger value="questions">الأسئلة</TabsTrigger> */}
              <TabsTrigger value="answers" className="flex-1">الأجوبة</TabsTrigger>
            </TabsList>

            {/* <TabsContent value="questions">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    {questionsData.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>اللعبة</TableHead>

                            <TableHead>المستوى</TableHead>
                            <TableHead>السؤال</TableHead>
                            <TableHead>الصورة</TableHead>

                            <TableHead>النوع</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {questionsData.map((question) => (
                            <TableRow key={question.id}>
                              <TableCell className="">{question.level.game.name}</TableCell>

                              <TableCell>{question.level.title}</TableCell>
                              <TableCell className="font-medium">
                                {question.text}
                              </TableCell>
                              <TableCell>
                                <img src={question.image} alt="image" className="rounded-lg bottom-2 border-blue-100 h-10 w-10" />

                              </TableCell>

                              <TableCell>{question.type}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p>No data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
            <TabsContent value="answers">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    {answersData.length > 0 ? (

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>اللعبة</TableHead>
                            <TableHead>المستوى</TableHead>
                            <TableHead>السؤال</TableHead>
                            <TableHead>الجواب</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {answersData.map((question) => (
                            <TableRow key={question.id}>
                              <TableCell>{question.question.level.game.name}</TableCell>
                              <TableCell>{question.question.level.title}</TableCell>
                              <TableCell>{question.question.text}</TableCell>

                              {/* <TableCell className="font-medium">
                              {question.question}
                            </TableCell> */}
                              <TableCell>{question.question.answers_view === "text" ? <>{question.text}</> : <>
                                <img src={question.image} alt="image" className="rounded-lg bottom-2 border-blue-100 h-10 w-10" />

                              </>}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center">No data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
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
