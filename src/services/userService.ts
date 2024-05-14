import axiosInstance from './axios';

export async function getPendingUsers() {
  try {
    const response = await axiosInstance.get('/user/pendingUsers', {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    if (response.status != 200) {
      throw new Error('Login failed');
    }
    const { data } = await response.data;
    return data;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function changeStatus(id_user: string, status: string) {
  try {
    const response = await axiosInstance.put(`/user/status/${id_user}`, { newStatus: status }, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    if (response.status != 200) {
      throw new Error('Failed to change status');
    }
    return await response;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function updateUser(id_user: string, formData: any) {
  try {
    const response = await axiosInstance.put(`/user/update/${id_user}`, formData, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: true
      }
    });

    return await response.data;

  } catch (error: any) {
    throw Error(error.response.data.error)
  }
}

export async function getMyapplications() {
  try {
    const response = await axiosInstance.get('/user/myApplications', {
      headers: {
        ContentType: 'applications/json',
        AuthorizationRequired: true
      }
    });
    // response.data.data
    // response.data.error

    if (response.status != 200) {
      throw new Error(response.data.error);
    }
    const { data } = await response;

    return data;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}