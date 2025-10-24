"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Calendar, TrendingUp, Target, Award, Flame, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Page() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      window.location.href = "/login";
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/dashboard?uid=${uid}`);
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = stats
    ? [
        { name: "Attended", value: stats.attendedLectures, color: "#10b981" },
        { name: "Missed", value: stats.missedLectures, color: "#ef4444" },
      ]
    : [];

  const getMotivationalMessage = () => {
    if (!stats) return "";
    if (stats.overallAttendance >= 90) {
      return "🌟 Outstanding! You're crushing it with your attendance!";
    } else if (stats.overallAttendance >= 75) {
      return "🎯 Great job! Keep up the consistent attendance!";
    } else if (stats.overallAttendance >= 60) {
      return "💪 You're doing well! A little more consistency will boost your stats!";
    } else {
      return "🚀 Time to level up! Focus on attending more lectures!";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-muted-foreground animate-pulse">Loading your stats...</div>
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
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <ThemeToggle />
        </header>
        
        <div className="flex-1 space-y-6 p-6 overflow-auto">
          {/* Welcome Message */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {localStorage.getItem("name")}!
            </h2>
            <p className="text-muted-foreground mt-1">Here's your attendance overview</p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Overall Attendance Card */}
            <Card className="col-span-full lg:col-span-1 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Overall Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {stats?.overallAttendance || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats?.attendedLectures || 0} of {(stats?.attendedLectures || 0) + (stats?.missedLectures || 0)} lectures attended
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Cards */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats?.thisMonthLectures || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">Lectures attended</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats?.currentStreak || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">Consecutive days</p>
              </CardContent>
            </Card>
          </div>

          {/* Second Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Attendance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 && chartData[0].value + chartData[1].value > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No attendance data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Attended Subject */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Most Attended Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold truncate">
                      {stats?.mostAttendedSubject || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Attended {stats?.mostAttendedCount || 0} times
                    </p>
                  </div>
                  
                  {/* Motivational Message */}
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium">{getMotivationalMessage()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Link href="/calendar">
              <Button className="w-full h-auto py-6 flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold text-lg">View Calendar</p>
                    <p className="text-sm opacity-90">See all your scheduled lectures</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/lectures">
              <Button className="w-full h-auto py-6 flex items-center justify-between bg-purple-600 hover:bg-purple-700 text-white">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold text-lg">My Lectures</p>
                    <p className="text-sm opacity-90">Detailed subject analytics</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
