// Send emails through Brevo (verification, password reset, etc.)

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

    const data = {
      sender: {
        name: "PropHub - Real Estate Platform",
        email: EMAIL_USER,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.message,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Brevo API error ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Brevo email error:", error.message);
    throw error;
  }
};

export default sendEmail;
