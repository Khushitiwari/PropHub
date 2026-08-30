// const sendEmail = async (options) =>{
//     console.log("BREVO KEY EXISTS:", !!BREVO_API_KEY);
// console.log("BREVO KEY LENGTH:", BREVO_API_KEY?.length);
// console.log("BREVO KEY PREFIX:", BREVO_API_KEY?.slice(0, 10));
// console.log("SENDER EMAIL:", process.env.EMAIL_USER);
   
//     try{
//         const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim(); // trim to remove whitespaces
//         if( !BREVO_API_KEY ){

//             console.error("Missing BREVO_API_KEY in the .env file ");
//             throw new Error("Missing email api key");
//         }

//         const data = {
//             sender : {
//                 name : " PropHub : Real EState Platform",
//                 email : process.env.EMAIL_USER
//             },
//             to:[{email : options.email}],
//             subject: options.subject,
//             htmlContent :options.message
//         };

//         const response = await fetch("https://api.brevo.com/v3/smtp/email" ,{
//             method : "POST",
//             headers:{
//                 "api-key" : BREVO_API_KEY,
//                 "Content-Type" : "application/json",
//                 "Accept" : "application/json",
//             },
//             body : JSON.stringify(data),
//         });

//         const result = await response.json();
//         if( response.ok ){

//             console.log("email sent sucessfully via Brevo " , result.message);

//         }else{

//             console.log("Brevo API Key Error:" , result);
//             throw new Error(result.message || "Could not send email via Brevo ");
//         }


//     }catch (error) {
//     console.error("Brevo Email Error:", error.message);
//     throw new Error(error.message);

// };

//  }

// export default sendEmail;


const sendEmail = async (options) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        const EMAIL_USER = process.env.EMAIL_USER?.trim();

        if (!BREVO_API_KEY) {
            throw new Error("Missing BREVO_API_KEY");
        }

        if (!EMAIL_USER) {
            throw new Error("Missing EMAIL_USER");
        }

        console.log("Brevo key exists:", !!BREVO_API_KEY);
        console.log("Sender:", EMAIL_USER);
        console.log("Recipient:", options.email);

        const data = {
            sender: {
                name: "PropHub - Real Estate Platform",
                email: EMAIL_USER,
            },
            to: [
                {
                    email: options.email,
                },
            ],
            subject: options.subject,
            htmlContent: options.message,
        };

        console.log("Sending email to Brevo...");

        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",
                headers: {
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const responseText = await response.text();

        console.log("Brevo status:", response.status);
        console.log("Brevo response:", responseText);

        if (!response.ok) {
            throw new Error(
                `Brevo API error ${response.status}: ${responseText}`
            );
        }

        console.log("Email sent successfully!");

        return JSON.parse(responseText);

    } catch (error) {
        console.error("========== BREVO ERROR ==========");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Cause:", error.cause);
        console.error("Full error:", error);
        console.error("=================================");

        throw error;
    }
};

export default sendEmail;