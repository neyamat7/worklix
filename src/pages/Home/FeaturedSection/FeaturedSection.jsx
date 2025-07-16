import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import { FiArrowRight, FiClock, FiUsers } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import ErrorMessage from "../../../components/shared/ErrorMessage/ErrorMessage";
import Loading from "../../../components/shared/Loading/Loading";
import { useRecentTasks } from "../../../hooks/useRecentTasks";
import { useUserRole } from "../../../hooks/useUserRole";
import { formatDate } from "../../../utils/formateDate";
import { getDeadlineDuration } from "../../../utils/getDeadlineDuration";
import TaskModal from "../../Dashboard/DashboardHome/BuyerDashboard/TaskModal";

export default function FeaturedSection() {
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { role, roleLoading } = useUserRole();

  const { data: tasks, isLoading, error } = useRecentTasks(6);
  const navigate = useNavigate();

  // const categories = [
  //   { id: "all", name: "All Tasks", count: 24 },
  //   { id: "web", name: "Web Development", count: 8 },
  //   { id: "mobile", name: "Mobile Apps", count: 6 },
  //   { id: "design", name: "UI/UX Design", count: 5 },
  //   { id: "data", name: "Data Science", count: 3 },
  //   { id: "devops", name: "DevOps", count: 2 },
  // ];

  // const tasks = [
  //   {
  //     id: 1,
  //     title: "Build React E-commerce Dashboard",
  //     description:
  //       "Need a modern admin dashboard for e-commerce platform with analytics, product management, and order tracking.",
  //     category: "web",
  //     budget: "$1,200",
  //     duration: "2 weeks",
  //     applicants: 12,
  //     featured: true,
  //     skills: ["React", "TypeScript", "Tailwind CSS"],
  //     employer: {
  //       name: "TechCorp Inc.",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       rating: 4.8,
  //       verified: true,
  //     },
  //     postedTime: "2 hours ago",
  //   },
  //   {
  //     id: 2,
  //     title: "Flutter Mobile App Development",
  //     description:
  //       "Create a cross-platform mobile app for food delivery with real-time tracking and payment integration.",
  //     category: "mobile",
  //     budget: "$2,500",
  //     duration: "4 weeks",
  //     applicants: 18,
  //     featured: true,
  //     skills: ["Flutter", "Firebase", "Payment APIs"],
  //     employer: {
  //       name: "FoodieApp",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       rating: 4.9,
  //       verified: true,
  //     },
  //     postedTime: "4 hours ago",
  //   },
  //   {
  //     id: 3,
  //     title: "UI/UX Design for SaaS Platform",
  //     description:
  //       "Design modern and intuitive user interface for a project management SaaS application.",
  //     category: "design",
  //     budget: "$800",
  //     duration: "1 week",
  //     applicants: 8,
  //     featured: false,
  //     skills: ["Figma", "Adobe XD", "Prototyping"],
  //     employer: {
  //       name: "StartupXYZ",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       rating: 4.7,
  //       verified: false,
  //     },
  //     postedTime: "6 hours ago",
  //   },
  //   {
  //     id: 4,
  //     title: "Python Data Analysis & Visualization",
  //     description:
  //       "Analyze sales data and create interactive dashboards using Python and modern visualization libraries.",
  //     category: "data",
  //     budget: "$600",
  //     duration: "1 week",
  //     applicants: 5,
  //     featured: false,
  //     skills: ["Python", "Pandas", "Plotly"],
  //     employer: {
  //       name: "DataCorp",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       rating: 4.6,
  //       verified: true,
  //     },
  //     postedTime: "8 hours ago",
  //   },
  //   {
  //     id: 5,
  //     title: "AWS Infrastructure Setup",
  //     description:
  //       "Set up scalable AWS infrastructure with auto-scaling, load balancing, and monitoring for web application.",
  //     category: "devops",
  //     budget: "$1,500",
  //     duration: "3 weeks",
  //     applicants: 7,
  //     featured: false,
  //     skills: ["AWS", "Docker", "Terraform"],
  //     employer: {
  //       name: "CloudTech",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       rating: 4.8,
  //       verified: true,
  //     },
  //     postedTime: "12 hours ago",
  //   },
  //   {
  //     id: 6,
  //     title: "WordPress Custom Theme Development",
  //     description:
  //       "Develop a custom WordPress theme for a creative agency with portfolio showcase and blog functionality.",
  //     category: "web",
  //     budget: "$900",
  //     duration: "2 weeks",
  //     applicants: 15,
  //     featured: false,
  //     skills: ["WordPress", "PHP", "JavaScript"],
  //     employer: {
  //       name: "Creative Agency",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       rating: 4.5,
  //       verified: false,
  //     },
  //     postedTime: "1 day ago",
  //   },
  // ];

  // const filteredTasks =
  //   selectedCategory === "all"
  //     ? tasks
  //     : tasks.filter((task) => task.category === selectedCategory);

  if (isLoading || roleLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <section
      id="recent-task"
      className="pt-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-green-600 dark:text-green-400 rounded-full mb-4">
            <FiClock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Fresh Opportunities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Recenly Added{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Task
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the latest opportunities from top companies and startups
          </p>
        </div>

        {/* Category Filter */}
        {/* <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div> */}

        {/* Tasks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className="group relative bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-[555px]"
            >
              <div className="mb-4 w-full h-50 flex">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={task.task_image_url}
                  alt=""
                />
              </div>

              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.task_title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {task.task_detail}
                  </p>
                </div>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <FaCoins className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {task.total_payable_amount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Budget
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <FiClock className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {getDeadlineDuration(task.completion_date)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Duration
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <FiUsers className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {task.total_workers}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Required
                  </div>
                </div>
              </div>

              {/* buyer Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className=" text-gray-500 dark:text-gray-300">
                        Posted By
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.buyer_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(task.created_at)}
                </div>
              </div>

              <div className="flex-1"></div>

              {/* Button */}
              {role === "worker" && (
                <Link to={`/dashboard/task-details/${task._id}`}>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2">
                    Apply Now
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              )}

              {role === "buyer" && (
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
                >
                  View Summary
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}

              {role === "admin" && (
                <button
                  onClick={() => navigate("/dashboard/manage-tasks")}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
                >
                  Manage Task
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}

              {!role && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
                >
                  See Details
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {/* <div className="text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
            View All Tasks
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div> */}
      </div>
      {selectedTask && isModalOpen && (
        <TaskModal
          selectedTask={selectedTask}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </section>
  );
}
