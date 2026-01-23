// API Client utilities for EduNexus

export class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'An error occurred',
    }));
    throw new APIError(response.status, error.error || 'An error occurred');
  }

  return response.json();
}

// Class Management API
export const classesAPI = {
  list: (params?: { academicYearId?: string; includeDetails?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.academicYearId) {
      searchParams.append('academicYearId', params.academicYearId);
    }
    if (params?.includeDetails !== undefined) {
      searchParams.append('includeDetails', params.includeDetails.toString());
    }
    return apiRequest<any[]>(
      `/api/classes${searchParams.toString() ? `?${searchParams}` : ''}`
    );
  },

  get: (id: string) => apiRequest<any>(`/api/classes/${id}`),

  create: (data: any) =>
    apiRequest<any>('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`/api/classes/${id}`, {
      method: 'DELETE',
    }),

  // Sections
  sections: {
    list: (classId: string) =>
      apiRequest<any[]>(`/api/classes/${classId}/sections`),

    create: (classId: string, data: any) =>
      apiRequest<any>(`/api/classes/${classId}/sections`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Subjects
  subjects: {
    list: (classId: string) =>
      apiRequest<any[]>(`/api/classes/${classId}/subjects`),

    create: (classId: string, data: any) =>
      apiRequest<any>(`/api/classes/${classId}/subjects`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Timetable
  timetable: {
    get: (classId: string, sectionId: string) =>
      apiRequest<any[]>(
        `/api/classes/${classId}/timetable?sectionId=${sectionId}`
      ),

    update: (classId: string, sectionId: string, slots: any[]) =>
      apiRequest<any[]>(`/api/classes/${classId}/timetable`, {
        method: 'PUT',
        body: JSON.stringify({ sectionId, slots }),
      }),
  },
};

// Section Management API
export const sectionsAPI = {
  list: (params?: { classId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.classId) {
      searchParams.append('classId', params.classId);
    }
    return apiRequest<any[]>(
      `/api/sections${searchParams.toString() ? `?${searchParams}` : ''}`
    );
  },

  get: (id: string) => apiRequest<any>(`/api/sections/${id}`),

  update: (id: string, data: any) =>
    apiRequest<any>(`/api/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`/api/sections/${id}`, {
      method: 'DELETE',
    }),
};
