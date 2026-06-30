import api from '../service/api'

export const getAllTickets = async () => {
    try {
         let response = await api.get('/v1/ticket/getTickets');
         return {success:true,data:response?.data}
         
    } catch (err) {
        console.log("err", err)
        return {
            success: false,
            message: err.response?.data?.message || 'Login failed. Please try again.'
        };
    }
}


export const getTicketTypes = async() => { 
    try{
    let response =await api.get('/v1/ticket/ticketType'); 
    console.log("tucej",response)
    return {success:true,data:response?.data}
    } catch (err) {
        console.log("err", err)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to get ticket type. Please try again.'
        };
    }
}

export const createTicket = async(data) => {
    try {
        let response =await api.post('/v1/ticket/create', data)
         return {success:true,data:response?.data}
    } catch (err) {
        console.log("err", err)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to create ticket. Please try again.'
        };
    }
    
};


export const getTicketDetails = async(id)=>{
     try {
        let response =await api.get(`/v1/ticket/ticketDetail/${id}`)
        console.log("response",response)
         return {success:true,data:response?.data}
    } catch (err) {
        console.log("err", err)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to get details. Please try again.'
        };
    }
}



export const getStatusWorkflow = async () => {
  try {
    const response = await api.get('/v1/ticket/statusWorkflow');
    return { success: true, data: response?.data?.data || [] };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to load statuses',
    };
  }
};

export const updateTicketStatus = async (ticketId, statusId) => {
  try {
    const response = await api.patch('/v1/ticket/status', {}, {
      params: { statusId: Number(statusId), ticketId: Number(ticketId) },
    });
    return { success: true, data: response?.data };
  } catch (err) {
    const isNetworkError = !err.response && err.message;
    return {
      success: false,
      message: err.response?.data?.message
        || (isNetworkError ? `Network error: ${err.message}. The server may be waking up — try again.` : 'Failed to update status'),
    };
  }
};

export const uploadDocumentToAI = async (file) => {
  const formData = new FormData();
  formData.append('document', file);
  try {
    const response = await api.post('/v1/ai/uploadFiles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response?.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Upload failed',
    };
  }
};

export const askKnowledgeBase = async (question) => {
  try {
    const response = await api.get('/v1/ai/getAiInfo', { params: { question } });
    return { success: true, data: response?.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to get answer',
    };
  }
};

export const sendMessage = async (ticketId,text)=>{
  try{
    const response = await api.post("/v1/chats/save",{ticketId,text});
    return { success: true, data: response?.data };
  }catch(err){
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to save messages',
    };
  }
}

export const getMessages = async (ticketId) => {
  try {
    const response = await api.get(`/v1/chats/get/${ticketId}`);
    return {success:true,data:response?.data}
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to get messages',
    };
  }
}


export const processRefund = async (ticketId, reason) => {
    try {
        const response = await api.post('/v1/payment/refund', { ticketId, reason });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to process refund'
        };
    }
};


export const getSummary = async (ticketId) => {
  try {
    let response = await api.get(`/v1/ai/getSummary/${ticketId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to process refund'
    };
  }
}

export const fetchUploadedDocs=async() => {

  try {
    const response = await api.get('/v1/ai/getUploadedDocs');
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to get Documents'
    };
  }
}