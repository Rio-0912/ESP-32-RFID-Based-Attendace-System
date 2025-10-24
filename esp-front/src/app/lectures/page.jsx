"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      window.location.href = "/login";
      return;
    }

    const fetchLectures = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/lectures?uid=${uid}`);
        setLectures(res.data.lectures);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 75) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-muted-foreground animate-pulse">Loading lectures...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">My Lectures</h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Subject Analytics</h2>
            <p className="text-muted-foreground mt-1">
              Detailed attendance breakdown for each of your subjects
            </p>
          </div>

          {/* Lectures Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {lectures.map((lecture) => (
              <Card
                key={lecture.cid}
                className="hover:shadow-xl transition-all duration-300 border-l-4"
                style={{
                  borderLeftColor: lecture.percentage >= 75 ? "#10b981" : lecture.percentage >= 60 ? "#f59e0b" : "#ef4444",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold leading-tight break-words">
                          {lecture.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{lecture.startTime} - {lecture.endTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Attendance Percentage */}
                  <div className="text-center py-4">
                    <div className={`text-5xl font-bold ${getPercentageColor(lecture.percentage)}`}>
                      {lecture.percentage}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Attendance Rate</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${getProgressBarColor(lecture.percentage)} transition-all duration-500 ease-out rounded-full`}
                        style={{ width: `${lecture.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {lecture.attended}
                      </div>
                      <p className="text-xs text-muted-foreground">Attended</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {lecture.missed}
                      </div>
                      <p className="text-xs text-muted-foreground">Missed</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {lecture.total}
                      </div>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {/* Status Message */}
                  {lecture.percentage >= 90 && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-800 dark:text-green-200 text-center">
                        🌟 Excellent attendance! Keep it up!
                      </p>
                    </div>
                  )}
                  {lecture.percentage >= 75 && lecture.percentage < 90 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                        👍 Great job! You're on track!
                      </p>
                    </div>
                  )}
                  {lecture.percentage >= 60 && lecture.percentage < 75 && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                        ⚠️ Needs improvement. Try to attend more!
                      </p>
                    </div>
                  )}
                  {lecture.percentage < 60 && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-800 dark:text-red-200 text-center">
                        🚨 Low attendance! Focus on this subject!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {lectures.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Lectures Found</h3>
              <p className="text-muted-foreground">
                Start attending lectures to see your analytics here!
              </p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
