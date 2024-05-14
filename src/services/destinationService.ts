import axiosInstance from './axios';

export async function getDestinations(queryParams: any) {
  try {
    const response = await axiosInstance.get('/destination/', {
      params: queryParams,
      headers: {
        ContentType: 'application/json',
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

export async function newDestination(formData: any) {
  try {
    const response = await axiosInstance.post('/destination/', formData, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: true
      }
    });

    if (response.status != 201) {
      throw new Error(response.data.error);
    }
    const data = await response;
    return data;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function deleteDestination(id: string) {
  try {
    const response = await axiosInstance.delete(`/destination/${id}`, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    if (response.status != 200) {
      throw new Error(response.data.error);
    }
    return await response;


  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function updateDestination(id: string, formData: any) {
  try {
    const response = await axiosInstance.put(`/destination/update/${id}`, formData, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: true
      }
    });

    if (response.status != 202) {
      throw new Error(response.data.error);
    }
    return await response;


  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function getDestination(id: string) {
  try {
    const response = await axiosInstance.get(`/destination/${id}`, {
      headers: {
        ContentType: 'application/json',
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