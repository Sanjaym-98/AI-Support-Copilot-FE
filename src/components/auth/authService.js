import api from '../service/api'



export const validateInput = (email, mobile, password) => {

    if (email) {
        const validEmail =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

        if (!validEmail) {
            return "Email is not valid";
        }
    }
    const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/.test(password);
    const validateMobile = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile);


    if (!validPassword) {
        return ("Password is not valid")
    };
    if (!validateMobile) {
        return ("Mobile Number is not valid")
    }

    return null;

}

export const signInUser =async(mobile,password)=>{
    try{
        let response  = await api.post('/v1/auth/sign-in',{mobile,password})
        console.log("resoonse",response)
        return { success: true, data: response?.data?.data };
    } catch (err) {
        console.log("err",err)
        return {
            success: false,
            message: err.response?.data?.message || 'Login failed. Please try again.'
        };
    }
}

export const signUpUser = async (userData) => {
  try {
    const response = await api.post("v1/auth/sign-up", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create account",
    };
  }
};

