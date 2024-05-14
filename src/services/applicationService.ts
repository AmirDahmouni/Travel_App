import axiosInstance from './axios';

export async function NewApplication(form: any) {
  try {
    const response = await axiosInstance.post('/application/', form, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: true
      }
    });
    // response.data.data
    // response.data.error

    if (response.status != 201) {
      throw new Error(response.data.error);
    }
    const { data } = await response;

    return data;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function UpdateApplication(id: string, form: any) {
  try {
    const response = await axiosInstance.put(`/application/update/${id}`, form, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: true
      }
    });
    // response.data.data
    // response.data.error

    if (response.status != 202) {
      throw new Error(response.data.error);
    }
    const { data } = await response;

    return data;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function getApplications(status: string) {

  try {
    const response = await axiosInstance.get(`/application/bystatus/${status}`, {
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

export async function getApplicationById(id: string) {

  try {
    const response = await axiosInstance.get(`/application/${id}`, {
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

export async function CheckApplication(id: string, decision: string) {
  try {
    const response = await axiosInstance.put(`/application/validate/${id}`, { decision }, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: true
      }
    });
    // response.data.data
    // response.data.error

    if (response.status != 202) {
      throw new Error(response.data.error);
    }
    const { data } = await response;

    return data;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

