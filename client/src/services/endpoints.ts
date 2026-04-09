export const API_ENDPOINTS = {
  SERVER:{
    LOCAL_SERVER_URL:"http://localhost:5000/api",
    // RENDER_SERVER_URL:"https://rajnish-portfolio.onrender.com/api",

  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CURRENT_USER: "/auth/me",
    LOGOUT: "/auth/logout",
  },

  ADMIN: {
    GET_PROFILE: "/admin/profile",
    UPDATE_PROFILE: "/admin/profile",
    CHANGE_PASSWORD: "/admin/change-password",
    UPLOAD_AVATAR: "/admin/upload-avatar",
  },

  PROJECTS: {
    GET: "/projects",
    CREATE: "/projects",
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },

  UPLOAD: {
  IMAGE: (type: "avatar" | "project") => `/upload?type=${type}`,
},

  SKILLS: {
    GET: "/skills",
    UPDATE: "/skills",
    ADD_SKILL: (category: string) => `/skills/${category}`,
    UPDATE_SKILL: (category: string, skillId: string) =>
      `/skills/${category}/${skillId}`,
    DELETE: (category: string, skillId: string) =>
      `/skills/${category}/${skillId}`,
    DELETE_CATEGORY: (categoryId: string) => `/skills/remove-category/${categoryId}`,
    RESET: "/skills/reset",
    ADD_CATEGORY: "/skills/category",
  },

  TEAM: {
    GET: "/team",
    CREATE: "/team",
    UPDATE: (id: string) => `/team/${id}`,
    DELETE: (id: string) => `/team/${id}`,
  },
  EXPERIENCE: {
    GET: "/experience",
    CREATE: "/experience",
    UPDATE: (id: string) => `/experience/${id}`,
    DELETE: (id: string) => `/experience/${id}`,
  },

  MESSAGES: {
    GET: "/messages",
    POST: "/messages",
    DELETE: (id: string) => `/messages/${id}`,
  },

  STATS: {
    GET: "/stats",
  },

  ANALYTICS: {
    GET: "/analytics",
  },
};
