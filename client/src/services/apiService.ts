import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./endpoints";
import axios from "axios";

// -----------------------------
// TYPES (IMPORTANT)
// -----------------------------
export interface ProfileData {
  name: string;
  email: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// -----------------------------
// AUTH
// -----------------------------
export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  return res.data;
};

export const registerApi = async (data: any) => {
  const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  return res.data;
};

export const forgotPasswordApi = async (email: string) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return res.data;
  } catch (error:any) {
    throw {message:error.message};
  }
};

export const getMeApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.AUTH.CURRENT_USER);
  return res.data;
};



export const resetPasswordApi = async (token: string, password: string) => {
  const res = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  return res.data;
};

export const logoutApi = async () => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};


// upload Helper function

const uploadFile = async (
  file: File,
  type: "avatar" | "project"
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(
    API_ENDPOINTS.UPLOAD.IMAGE(type),
    formData
  );

  return response.data;
};


export const uploadAvatarApi = (file: File) => uploadFile(file, "avatar");

export const uploadProjectImageApi = (file: File) => uploadFile(file, "project");



// -----------------------------
// PROFILE (FIXED + ADDED)
// -----------------------------
export const getProfileApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.ADMIN.GET_PROFILE);
  return res.data;
};

export const updateProfileApi = async (data: ProfileData) => {
  const res = await apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_PROFILE, data);
  return res.data;
};

export const changePasswordApi = async (data: ChangePasswordData) => {
  const res = await apiClient.put(API_ENDPOINTS.ADMIN.CHANGE_PASSWORD, data);
  return res.data;
};

// -----------------------------
// PROJECTS (FIXED)
// -----------------------------
export const getProjectsApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.PROJECTS.GET);
  if (import.meta.env.DEV) {
    console.log("[projects] GET response:", res.data);
  }

  return res.data;
};

export const createProjectApi = async (data: any) => {
  const res = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, data);
  return res.data;
};

export const updateProjectApi = async (id: string, data: any) => {
  const res = await apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
  return res.data;
};

export const deleteProjectApi = async (id: string) => {
  await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
};

// -----------------------------
// SKILLS (FIXED)
// -----------------------------

// 🔹 Fetch all skills
export const getSkillsApi = async () => {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.SKILLS.GET);
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch skills" };
  }
};

// 🔹 Bulk update (entire document)
export const updateSkillsApi = async (payload: any) => {
  try {
    const { data } = await apiClient.put(API_ENDPOINTS.SKILLS.UPDATE, payload);
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Bulk update failed" };
  }
};

// 🔹 Add new skill to category (Uses categoryId)
export const addSkillToCategoryApi = async (
  categoryId: string,
  skill: { name: string; level: number }
) => {
  try {
    const { data } = await apiClient.post(
      API_ENDPOINTS.SKILLS.ADD_SKILL(categoryId),
      skill
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to add skill" };
  }
};

// 🔹 Add new category
export const addCategoryApi = async (
  name: string,
  config = { icon: "layout", color: "emerald" }
) => {
  try {
    const payload = {
      name,
      icon: config.icon,
      color: config.color,
    };

    const { data } = await apiClient.put(API_ENDPOINTS.SKILLS.ADD_CATEGORY, payload);
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to add category" };
  }
};

// 🔹 Update skill in category (Uses categoryId and skillId)
export const updateSkillInCategoryApi = async (
  categoryId: string,
  skillId: string,
  updatedFields: any
) => {
  try {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.SKILLS.UPDATE_SKILL(categoryId, skillId),
      updatedFields
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to update skill" };
  }
};

// 🔹 Delete skill (Uses categoryId and skillId)
export const deleteSkillApi = async (
  categoryId: string,
  skillId: string
) => {
  try {
    const { data } = await apiClient.delete(
      API_ENDPOINTS.SKILLS.DELETE(categoryId, skillId)
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to delete skill" };
  }
};

// 🔹 Delete category (Uses categoryId)
export const deleteCategoryApi = async (categoryId: string) => {
  try {
    const { data } = await apiClient.delete(
      API_ENDPOINTS.SKILLS.DELETE_CATEGORY(categoryId)
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || {
      message: "Failed to delete category",
    };
  }
};
// -----------------------------
// TEAM
// -----------------------------
export const getTeamApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.TEAM.GET);
  return res.data;
};

export const createTeamApi = async (data: any) => {
  const res = await apiClient.post(API_ENDPOINTS.TEAM.CREATE, data);
  return res.data;
};

export const updateTeamApi = async (id: string, data: any) => {
  const res = await apiClient.put(API_ENDPOINTS.TEAM.UPDATE(id), data);
  return res.data;
};

export const deleteTeamApi = async (id: string) => {
  await apiClient.delete(API_ENDPOINTS.TEAM.DELETE(id));
};


// -----------------------------
// EXPERIENCE
// -----------------------------
export const getExperienceApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.EXPERIENCE.GET);
  return res.data;
};

export const createExperienceApi = async (data: any) => {
  const res = await apiClient.post(API_ENDPOINTS.EXPERIENCE.CREATE, data);
  return res.data;
};

export const updateExperienceApi = async (id: string, data: any) => {
  const res = await apiClient.put(API_ENDPOINTS.EXPERIENCE.UPDATE(id), data);
  return res.data;
};

export const deleteExperienceApi = async (id: string) => {
  await apiClient.delete(API_ENDPOINTS.EXPERIENCE.DELETE(id));
};

// -----------------------------
// MESSAGES
// -----------------------------
export const getMessagesApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.MESSAGES.GET);
  return res.data;
};

export const sendMessageApi = async (data: any) => {
  const res = await apiClient.post(API_ENDPOINTS.MESSAGES.POST, data);
  return res.data;
}

export const deleteMessageApi = async (id: string) => {
  await apiClient.delete(API_ENDPOINTS.MESSAGES.DELETE(id));
};


// -----------------------------
// STATS
// -----------------------------
export const getStatsApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.STATS.GET);
  return res.data;
};

// -----------------------------
// ANALYTICS
// -----------------------------
export const getAnalyticsApi = async () => {
  const res = await apiClient.get(API_ENDPOINTS.ANALYTICS.GET);
  return res.data;
};

// -----------------------------
// IDENTITY
// -----------------------------

export const getSettingsApi = async () => {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.IDENTITY.GET);
    return data.data; // because backend sends { message, data }
  } catch (error: any) {
    throw error?.response?.data || {
      message: "Failed to fetch identity settings",
    };
  }
};

export const updateSettingsApi = async (formData: FormData) => {
  try {
    const { data } = await apiClient.put(API_ENDPOINTS.IDENTITY.UPDATE, formData);
    return data.data;
  } catch (error: any) {
    throw error?.response?.data || {
      message: "Failed to update identity settings",
    };
  }
};

export const deleteLinkApi = async (linkId: string) => {
  try {
    const { data } = await apiClient.delete(
      API_ENDPOINTS.IDENTITY.DELETE_LINK(linkId)
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || {
      message: "Failed to delete link",
    };
  }
};
