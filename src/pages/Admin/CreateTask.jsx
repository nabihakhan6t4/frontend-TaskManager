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
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
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
    todoCheckList: [],
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
      todoCheckList: [],
      attachments: [],
    });
    setError("");
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoCheckList?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todolist,
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
    setLoading(true);
    try {
      const todoList = taskData.todoCheckList?.map((item) => {
        const prevtodoChecklist = currentTask?.todoCheckList || [];
        const matchedTask = prevtodoChecklist.find((task) => task.text == item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoCheckList: todoList,
        }
      );
      toast.success("Task Updated Successfully");
    } catch (err) {
      console.error("error updating tasks", err);
      setLoading(false);
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

    if (!taskData.todoCheckList || taskData.todoCheckList.length === 0) {
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
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );
      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoCheckList:
            taskInfo?.todoCheckList?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        });
      }
    } catch (err) {
      console.error("Error Fetching Users:".err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
    return () => {};
  }, [taskId]);

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task Deleted Successfully");
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Error Deleting expenses:", err);
      err.response?.data?.message || err.message;
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
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300  cursor-pointer "
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
                todoList={taskData?.todoCheckList}
                setTodoList={(value) => {
                  handleValueChange("todoCheckList", value);
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

      <Modal
        isOpen={openDeleteAlert}
        onClick={() => {
          setOpenDeleteAlert(false);
        }}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
