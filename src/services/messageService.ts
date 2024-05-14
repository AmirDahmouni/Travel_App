import axiosInstance from './axios';

export async function NewMessage(application: string, traveler: string, content: string) {
  try {
    const response = await axiosInstance.post('/message/', {
      application, traveler, content
    }, {
      headers: {
        ContentType: 'application/json',
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


export async function getMymessages() {
  try {
    const response = await axiosInstance.get('/message/', {
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

export async function getMessagesByApplication(id: string) {
  try {
    const response = await axiosInstance.get(`/message/${id}`, {
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

export async function validateMessages(ids: string[]) {
  try {
    const response = await axiosInstance.put('/message/seen', {
      ids
    }, {
      headers: {
        ContentType: 'application/json',
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