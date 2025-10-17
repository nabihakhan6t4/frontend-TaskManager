import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
    setError("");
  };

  // Create Task
  const createTask = async () => {
    if (!taskData.title || !taskData.description || !taskData.dueDate) {
      toast.error("Please fill all required fields!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        API_PATHS.CREATE_TASK,
        taskData
      );
      toast.success("Task created successfully 🎉");
      clearData();
      navigate("/dashboard/tasks");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create task 😞");
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      await axiosInstance.put(`${API_PATHS.UPDATE_TASK}/${taskId}`, taskData);
      toast.success("Task updated successfully ✨");
      navigate("/dashboard/tasks");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update task 😔");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    taskId ? updateTask() : createTask();
  };

  // get Task info by ID
  const getTaskDetails = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `${API_PATHS.GET_TASK_BY_ID}/${taskId}`
      );
      setTaskData({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: moment(data.dueDate).format("YYYY-MM-DD"),
        assignedTo: data.assignedTo || [],
        todoChecklist: data.todoChecklist || [],
        attachments: data.attachments || [],
      });
    } catch (err) {
      toast.error("Failed to fetch task details ⚠️");
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`${API_PATHS.DELETE_TASK}/${taskId}`);
      toast.success("Task deleted successfully 🗑️");
      navigate("/dashboard/tasks");
    } catch (err) {
      toast.error("Failed to delete task ❌");
    } finally {
      setLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-1 mt-4 ">
          <div className="form-card col-span-3 ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium ">
                {" "}
                {taskId ? "Update Task" : "Create Task"}{" "}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium font-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300  cursor-pointer "
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  {" "}
                  <LuTrash2 className="text-base" /> Delete{" "}
                </button>
              )}
            </div>
            <div className="mt-4 ">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              >
                {" "}
              </textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
