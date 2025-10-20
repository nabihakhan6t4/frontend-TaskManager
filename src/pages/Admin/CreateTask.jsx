import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDates: "",
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
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      })); // 🛑 FRONTEND FIX: taskData state mein 'dueDate' hai, lekin server 'dueDates' expect kar raha hai.

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData, // title, description, priority, assignedTo, attachments // Yahan hum 'dueDate' ko overwrite kar rahe hain 'dueDates' se
        dueDates: new Date(taskData.dueDate).toISOString(), // ✅
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
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

      navigate("/dashboard/tasks");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    //  Input validation
    if (!taskData.title.trim()) {
      setError("Task title is required!");
      return;
    }

    if (!taskData.description.trim()) {
      setError("Task description is required!");
      return;
    }

    if (!taskData.dueDate) {
      setError("Due date is required!");
      return;
    }

    if (!taskData.assignedTo || taskData.assignedTo.length === 0) {
      setError("At least one user must be assigned!");
      return;
    }

    if (!taskData.todoChecklist || taskData.todoChecklist.length === 0) {
      setError("Add at least one item to the TODO checklist!");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (taskId) {
      getTaskDetails();
    }
  }, [taskId]);

  // Delete Task
  const deleteTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`${API_PATHS.DELETE_TASK}/${taskId}`);

      navigate("/dashboard/tasks");
    } catch (err) {
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
                Task Description
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

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  placeholder="Select due date"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>
              <div className="col-span-12  md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3 ">
              <label className="text-sm font-medium text-slate-600 ">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) => {
                  handleValueChange("todoChecklist", value);
                }}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 ">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7 ">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
