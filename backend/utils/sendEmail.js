const sendEmail = async (options) =>{
   
    try{
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim(); // trim to remove whitespaces
        if( !BREVO_API_KEY ){

            console.error("Missing BREVO_API_KEY in the .env file ");
            throw new Error("Missing email api key");
        }

        const data = {
            sender : {
                name : " PropHub : Real EState Platform",
                email : process.env.EMAIL_USER
            },
            to:[{email : options.email}],
            subject: options.subject,
            htmlContent :options.message
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email" ,{
            method : "POST",
            headers:{
                "api-key" : BREVO_API_KEY,
                "Content-Type" : "application/json",
                "Accept" : "application/json",
            },
            body : JSON.stringify(data),
        });

        const result = await response.json();
        if( response.ok ){

            console.log("email sent sucessfully via Brevo " , result.message);

        }else{

            console.log("Brevo API Key Error:" , result);
            throw new Error(result.message || "Could not send email via Brevo ");
        }


    }catch (error) {
    console.error("Brevo Email Error:", error.message);
    throw new Error(error.message);

};

 }

export default sendEmail;